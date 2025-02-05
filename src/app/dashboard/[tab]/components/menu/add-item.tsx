import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Flex,
  Select,
  Switch,
  Button,
  Row,
  Col,
  Dropdown,
  MenuProps,
  Spin,
  Image,
  message,
  theme,
  FormInstance,
  Tooltip,
} from "antd";
import style from "@/styles/menu/add-item";
import { IoCameraOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import TextArea from "antd/es/input/TextArea";
import ItemOptionsList from "./item-options-list";
import NewItemOption from "./new-item-option";
import { useMenuContext } from "@/app/providers/MenuProvider";
import { GET_ALL_CATEGORIES, GET_ALL_MENUS } from "@/lib/queries/menu";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ITEM } from "@/lib/mutations/menu";
import { IoCloseSharp } from "react-icons/io5";
import toast from "react-hot-toast";
// import Image from "next/image";
import ExistingItemList from "./existing-item-list";
import validation from "@/validations/menu-validation";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { BiSpa } from "react-icons/bi";
import { MdOutlineEco } from "react-icons/md";
import { LuRefreshCcw } from "react-icons/lu";
import { ItemOptionList } from "@/utils/interfaces";
import UpdateItemOption from "./update-item-option";
interface Category {
  id: string;
  name: string;
  menu: any;
  is_deleted: boolean;
}
interface LabelsState {
  Vegan: boolean;
  Vegetarian: boolean;
  GlutenFree: boolean;
}

function AddItem({
  action,
  modalTitle,
  modalVisibility,
  clickedComponent,
}: // selectedLabel,
{
  action: (_?: any) => any;
  modalTitle: string;
  modalVisibility: boolean;
  clickedComponent: string;
  selectedLabel?: string;
}) {
  const {
    token: {
      colorBgBase,
      blue9,
      cyan2,
      colorBgContainer,
      blue7,
      purple1,
      // green4,
      // colorTextDisabled,
      colorBgContainerDisabled,
      red1,
      colorTextBase,
    },
  } = theme.useToken();

  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [isResetForm, setIsResetForm] = useState(false);

  let restaurant_id: number | null = null;
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("lono_restaurant_id");
    if (storedId) {
      restaurant_id = parseInt(storedId, 10);
    }
  }

  const { data: menusData } = useQuery<any>(GET_ALL_MENUS, {
    variables: { restaurant_id: restaurant_id },
  });
  const { data: categoriesData } = useQuery<any>(GET_ALL_CATEGORIES, {
    variables: { restaurant_id: restaurant_id },
  });

  const menuList =
    menusData &&
    menusData.getAllMenus &&
    menusData.getAllMenus.menus &&
    menusData.getAllMenus.menus.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
        is_special: item.is_special,
        is_deleted: item.is_deleted,
      };
    });

  const menuListNormal: any[] =
    menuList &&
    menuList.filter(
      (menu: any) => menu.is_special === false && menu.is_deleted === false
    );

  const menuListSpecial: any[] =
    menuList && menuList.filter((menu: any) => menu.is_special === true);

  const categoryList =
    categoriesData &&
    categoriesData.getAllCategorys.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
        menu: item.menu,
        is_deleted: item.is_deleted,
      };
    });

  const filteredCategoryList: any[] =
    categoryList &&
    categoryList.filter(
      (category: Category) =>
        category.menu.id === selectedMenuId && !category.is_deleted
    );
  const [form] = Form.useForm();
  const formUseRef = useRef<FormInstance>(null);
  const {
    selectedStep,
    setSelectedStep,
    updateCurrentStep,
    updateItemAdded,
    itemFileUrls,
    handleFileUpload,
    setItemFileUrls,
    isImageUploading,
    isExistingItem,
    isUpdatingItemOption,
    selectedItemOptionList,
    setSelectedItemOptionList,
    updateCategoryAdded,
    selectedLabel,
    clickedMenuCardId,
    clickedCategoryCardId,
  } = useMenuContext();

  const [selectedLabels, setSelectedLabels] = useState<LabelsState>({
    Vegan: false,
    Vegetarian: false,
    GlutenFree: false,
  });
  const [customLabels, setCustomLabels] = useState<string[]>([]);
  const handleCustomLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputLabels = e.target.value;
    const formattedLabels = inputLabels.split(",").map((label) => {
      return label
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()); //first letter of each word is capital
    });
    setCustomLabels(formattedLabels);
  };
  const [isLoading, setIsLoading] = useState(false);

  const [createItem] = useMutation<any>(CREATE_ITEM);

  const handleButtonClick = (label: keyof LabelsState) => {
    setSelectedLabels((prevLabels) => {
      if (prevLabels[label]) {
        return {
          ...prevLabels,
          [label]: false,
        };
      }

      /*
      const numSelected = Object.values(prevLabels).filter(
        (value) => value
      ).length;
      
      if (numSelected >= 2) {
        return {
          Vegetarian: false,
          GlutenFree: false,
          Vegan: false,
          [label]: true,
        };
      }

      if (prevLabels.Vegan && label === "Vegetarian") {
        return {
          ...prevLabels,
          [label]: true,
          Vegan: false,
        };
      }

      if (prevLabels.Vegetarian && label === "Vegan") {
        return {
          ...prevLabels,
          [label]: true,
          Vegetarian: false,
        };
      }
*/
      return {
        ...prevLabels,
        [label]: true,
      };
    });
  };

  const validateCategory = (_: any, value: any) => {
    if (value === "Select a category") {
      return Promise.reject(new Error("Please select a category"));
    }
    return Promise.resolve();
  };

  const validateItemOptions = async () => {
    let itemPrice = parseFloat(form.getFieldValue("price"));
    const items = selectedItemOptionList.map((element: any) => {
      const choices = element.choices.map((choice: any) => {
        return {
          label: choice.label,
          price: parseFloat(choice.price),
          index_no: choice.index_no,
        };
      });

      return {
        id: element.id,
        index_no: element.index_no,
        type: element.type,
        title: element.title,
        choice_limit: element.choice_limit,
        choices: choices,
      };
    });

    items.forEach((item: ItemOptionList) => {
      const negativePrices = item.choices
        .map((choice) => parseFloat(choice.price))
        .filter((price) => price < 0)
        .sort((a, b) => a - b);
      const sumOfLowestNegatives = negativePrices
        .slice(0, item.choice_limit)
        .reduce((acc, price) => acc + price, 0);
      itemPrice += sumOfLowestNegatives;
    });

    if (itemPrice < 0) {
      return Promise.reject(
        new Error(`ERROR: The current item price, with its item option's respective negative 
            choice prices and choice limits, allows the final total to go below 0. 
            This can be abused to artificially lower the final bill. 
            Please ensure that any item option price subtractions are set up in such 
            a way that the same ingredient value cannot be subtracted twice.`)
      );
    }

    return Promise.resolve();
  };

  const handleFormSubmit = async () => {
    form
      .validateFields()
      .then(async (formValues: any) => {
        const img_urls =
          itemFileUrls && itemFileUrls.length > 0
            ? itemFileUrls.map((filename: string) => filename)
            : ["food/mains1.png"];
        setIsLoading(true);
        formValues["img_urls"] = img_urls;
        //fix is_active==undefined (defaults to true now)
        formValues["is_active"] =
          formValues["is_active"] === false ? false : true;
        const price = parseFloat(formValues["price"]);
        formValues["price"] = price;
        formValues["is_special"] = selectedLabel === "Menu" ? false : true;
        formValues["custom_labels"] = customLabels;
        const items = selectedItemOptionList.map((element: any) => {
          const choices = element.choices.map((choice: any) => {
            return {
              label: choice.label,
              price: parseFloat(choice.price),
              index_no: choice.index_no,
            };
          });

          return {
            id: element.id,
            index_no: element.index_no,
            type: element.type,
            title: element.title,
            choice_limit: element.choice_limit,
            choices: choices,
          };
        });
        formValues["item_options"] = items;

        const lables = Object.entries(selectedLabels)
          .filter(([_key, value]) => value === true)
          .map(([key]) => key);
        formValues["labels"] = lables;
        formValues["restaurant_id"] = restaurant_id;

        if (clickedComponent && clickedComponent.includes("Add")) {
          try {
            const { data: _data } = await createItem({
              variables: {
                input: formValues,
                is_special: true,
              },
            });
          } catch (error: any) {
            setIsLoading(false);
            console.log(error);

            if (error.message.includes("A Item already exists")) {
              message.error("A item with this name already exists.");
              return;
            } else {
              message.error(
                "An error occurred while creating the menu. Please try again."
              );
              return;
            }
          }
        }

        form.resetFields();
        setIsLoading(false);
        action();
        updateItemAdded();
        updateCategoryAdded();
      })
      .catch((_error: any) => {
        setIsLoading(false);
        toast.error("Please fill all the required fields");
      });
  };

  useEffect(() => {
    return () => {
      if (form) {
        form.resetFields();
      }
      setSelectedLabels({
        Vegan: false,
        Vegetarian: false,
        GlutenFree: false,
      });
      setItemFileUrls([]);
      setSelectedItemOptionList([]);
    };
  }, []);

  // useEffect(() => {
  //   if (form) {
  //     form.setFieldsValue({
  //       category_id: "Select a category",
  //     });
  //   }

  //   return () => {};
  // }, [selectedMenuId]);

  useEffect(() => {
    let selectedMenu: any;
    if (selectedLabel === "Menu") {
      selectedMenu = menuListNormal.filter(
        (obj) => obj.value === clickedMenuCardId
      )[0];
    } else {
      selectedMenu = menuListSpecial.filter(
        (obj) => obj.value === clickedMenuCardId
      )[0];
    }
    const filteredCategory: any[] =
      categoryList &&
      selectedMenu &&
      categoryList.filter(
        (category: Category) => category.menu.id === selectedMenu.value
      );
    const selectedCategory =
      filteredCategory &&
      filteredCategory.filter((obj) => obj.value === clickedCategoryCardId)[0];

    if (selectedCategory) {
      setSelectedMenuId(selectedMenu.value);
      form.setFieldsValue({
        category_id: selectedCategory.value,
        menu_id: selectedMenu.value,
        is_active: true,
      });
    }

    return () => {};
  }, [clickedMenuCardId, clickedCategoryCardId, isResetForm]);

  const uploadRef = useRef<HTMLInputElement>(null);

  const handleMenuClick: MenuProps["onClick"] = (e: any) => {
    if (e.key === "replace") {
      uploadRef.current?.click();
    } else if (e.key === "delete") {
      setItemFileUrls([]);
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "replace",
      key: "replace",
      icon: <LuRefreshCcw style={{ transform: "rotate(-120deg)" }} />,
    },
    {
      label: "delete",
      key: "delete",
      icon: <RiDeleteBin6Fill />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      if (
        !file.type.includes("image/jpeg") &&
        !file.type.includes("image/png")
      ) {
        message.error("Please upload a JPEG or PNG file.");
        return;
      }
      await handleFileUpload(file);
      // Array.from(files).forEach(async (file) => {
      //   await handleFileUpload(file);
      // });
    }
  };

  const handleMenuChange = (value: any) => {
    setSelectedMenuId(value);

    if (form) {
      form.setFieldsValue({
        category_id: "Select a category",
      });
    }
  };

  const handlePressEnter = () => {
    const activeElement = document.activeElement as HTMLInputElement;
    activeElement?.blur();
  };

  const onCloseModal = () => {
    if (formUseRef.current) {
      formUseRef.current.resetFields();
    }
    setIsResetForm(!isResetForm);
    action();
    setSelectedStep(0);
    if (form) {
      form.resetFields();
    }
    setSelectedLabels({
      Vegan: false,
      Vegetarian: false,
      GlutenFree: false,
    });
    setItemFileUrls([]);
    setSelectedItemOptionList([]);
  };

  return (
    <Modal
      style={{
        top: "169px",
        right: "23px", // Position 23px from the right edge
        position: "absolute",
        minHeight: "570px",
        height: "auto",
        border: `12px solid ${colorBgBase}`,
        borderRadius: "1.5rem",
        paddingBottom: 0,
      }}
      width={"471px"}
      open={modalVisibility}
      onCancel={onCloseModal}
      footer={null}
      closable={false}
    >
      {" "}
      <Row style={{ marginTop: "-11px" }}>
        <Col span={23}>
          <div style={{ ...style.modalTitle }}>
            {selectedStep != 0 ? (
              <span style={{ marginLeft: "-21px" }}>
                <Button
                  icon={<IoIosArrowBack size={18} />}
                  onClick={() => updateCurrentStep(false)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    margin: "0px",
                  }}
                />

                <b
                  style={{
                    marginLeft:
                      selectedStep == 2 && isExistingItem ? "97px" : "138px",
                  }}
                >
                  {selectedStep == 2
                    ? isUpdatingItemOption
                      ? "Update Modifiers"
                      : isExistingItem
                      ? "Add Existing Modifiers"
                      : "New Modifier"
                    : "Modifiers"}
                </b>
              </span>
            ) : (
              modalTitle
            )}
          </div>
        </Col>
        <Col span={1}>
          <div style={{ ...style.closeBtn }} onClick={onCloseModal}>
            <IoCloseSharp />
          </div>
        </Col>
      </Row>
      {selectedStep == 0 ? (
        <div style={style.menuModals}>
          <Form
            form={form}
            ref={formUseRef}
            name="validateOnly"
            layout="vertical"
            autoComplete="off"
            style={{ marginLeft: "-8px" }}
          >
            <Flex vertical={true}>
              <Flex
                vertical={false}
                gap={"14.5px"}
                style={{ marginTop: "-5px" }}
              >
                <div
                  style={{
                    backgroundColor: colorBgContainer,
                    position: "relative",
                    width: "257px",
                    height: "12rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "4px",
                    marginLeft: "-15px",
                  }}
                >
                  {itemFileUrls && itemFileUrls.length > 0 ? (
                    <Image
                      preview={false}
                      src={process.env.NEXT_PUBLIC_IMAGES_URL + itemFileUrls[0]}
                      alt="image"
                      style={{
                        objectFit: "cover",
                        width: "257px",
                        height: "180px",
                        margin: 0,
                        padding: 0,
                        marginTop: "0.8rem",
                        marginLeft: "0.8rem",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "257px",
                        height: "180px",
                        backgroundColor: blue7,
                        marginTop: "0.8rem",
                        marginLeft: "0.8rem",
                      }}
                    ></div>
                  )}
                  {/* <Image
                    width={"14rem"}
                    height={"12rem"}
                    src={
                      itemFileUrls && itemFileUrls.length > 0
                        ? process.env.NEXT_PUBLIC_IMAGES_URL + itemFileUrls[0]
                        : "data:image/png;base64,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"
                    }
                    alt="image"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      margin: 0,
                      padding: 0,
                    }}
                  /> */}
                  {isImageUploading ? (
                    <div
                      style={{
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Spin />
                    </div>
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        bottom:
                          itemFileUrls && itemFileUrls.length > 0
                            ? "1rem"
                            : "3.5rem",
                      }}
                    >
                      <input
                        type="file"
                        multiple={false}
                        ref={uploadRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        name="image-input"
                      />

                      {itemFileUrls && itemFileUrls.length > 0 ? (
                        <Dropdown menu={menuProps} placement="bottomLeft">
                          <Button style={{ ...style.imgUpdateBtn }}>
                            <span style={{ ...style.imgUpdateIcon }}>
                              <IoCameraOutline />
                            </span>
                            <span style={{ ...style.imgUpdateTxt }}>
                              Update
                            </span>
                          </Button>
                        </Dropdown>
                      ) : (
                        <Form.Item
                          name="img_urls"
                          valuePropName="fileList"
                          getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                              return e;
                            }
                            return e && e.fileList;
                          }}
                        >
                          <Upload
                            name="logo"
                            customRequest={({ file }) => {
                              // Custom upload request to handle file upload to signed URL
                              handleFileUpload(file)
                                .then(() => {})
                                .catch((_error: any) => {});
                            }}
                            listType="picture"
                            showUploadList={false}
                            multiple={false}
                            beforeUpload={(file) => {
                              const isJpgOrPng =
                                file.type === "image/jpeg" ||
                                file.type === "image/png";
                              if (!isJpgOrPng) {
                                message.error(
                                  "You can only upload JPG/PNG file!"
                                );
                              }
                              return isJpgOrPng;
                            }}
                            style={{ width: "260px", height: "180px" }}
                          >
                            <Button style={{ ...style.uploadBtn }}>
                              <span style={{ ...style.cameraIcon }}>
                                <IoCameraOutline />
                              </span>
                              <span style={{ ...style.uploadBtnTxt }}>
                                Add Picture
                              </span>
                            </Button>
                          </Upload>
                        </Form.Item>
                      )}
                    </div>
                  )}
                </div>

                <Flex vertical={true}>
                  {menuList && (
                    <Form.Item
                      label={
                        <p style={{ color: blue9, ...style.updateLabelNew }}>
                          Menu
                        </p>
                      }
                      name="menu_id"
                      style={{ marginBottom: "16px", lineHeight: "0.8rem" }}
                      rules={[{ required: true }]}
                    >
                      <Select
                        // defaultValue={"Select a menu"}
                        style={{ ...style.dropDownSelect }}
                        // value={menu}
                        onChange={handleMenuChange}
                        allowClear={true}
                        options={
                          selectedLabel === "Menu"
                            ? menuListNormal
                            : menuListSpecial
                        }
                      />
                    </Form.Item>
                  )}
                  {filteredCategoryList && (
                    <Form.Item
                      label={
                        <p
                          style={{
                            color: blue9,
                            marginTop: "-3px",
                            ...style.updateLabelNew,
                          }}
                        >
                          Category
                        </p>
                      }
                      name="category_id"
                      style={style.categoryBox}
                      rules={[{ required: true, validator: validateCategory }]}
                    >
                      <Select
                        // defaultValue="Select a category"
                        style={{ ...style.dropDownSelect }}
                        // value={category}
                        // onChange={handleCategoryChange}
                        allowClear={true}
                        options={filteredCategoryList}
                      />
                    </Form.Item>
                  )}
                  <Form.Item
                    label={
                      <p style={{ color: blue9, ...style.updateLabelNew }}>
                        Item Status
                      </p>
                    }
                    name="is_active"
                    style={style.stausBox}
                  >
                    <Switch
                      // style={{
                      //   backgroundColor: menuStatus
                      //     ? green4
                      //     : colorTextDisabled,
                      //   ...style.switchBox,
                      // }}
                      style={{
                        width: "84px",
                        height: "31px",
                        marginTop: "-3px",
                        fontSize: "11px",
                      }}
                      checkedChildren="active"
                      unCheckedChildren="inactive"
                      defaultChecked={true}

                      // onChange={(e) => onCheckedChange(e, menuStatus)}
                    />
                  </Form.Item>
                </Flex>
              </Flex>
              <Form.Item style={{ marginTop: "1rem", marginBottom: "0rem" }}>
                <Form.Item
                  name="name"
                  label={
                    <p style={{ color: blue9, ...style.updateLabelNew }}>
                      Item Name
                    </p>
                  }
                  rules={[
                    {
                      required: true,
                    },
                    validation.menuName,
                    validation.nameLength,
                  ]}
                  style={style.itemNameLabel}
                >
                  <Input
                    placeholder="e.g. Pepperoni Pizza"
                    // value={itemName}
                    // onChange={(e) => setItemName(e.target.value)}
                    style={style.inputBox}
                    width={"302.54px"}
                  />
                </Form.Item>
                <Form.Item
                  name="price"
                  label={
                    <p style={{ color: blue9, ...style.updateLabelNew }}>
                      Price
                    </p>
                  }
                  rules={[{ required: true }, validation.menuPrice]}
                  style={style.priceLabel}
                >
                  <Input
                    placeholder="$00.00"
                    // value={itemPrice}
                    // onChange={(e) => setItemPrice(e.target.value)}
                    style={style.inputBox}
                    // type="number"
                    // inputMode="numeric"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <p
                      style={{
                        color: blue9,
                        ...style.updateLabelNew,
                      }}
                    >
                      Description
                    </p>
                  }
                  name="description"
                  style={style.descriptionBox}
                  rules={[
                    { required: true },
                    //validation.descriptionLength
                  ]}
                >
                  <TextArea
                    placeholder="Briefly describe your item."
                    // value={description}
                    // onChange={(e) => setDescription(e.target.value)}
                    style={style.descrptionInput}
                    onPressEnter={handlePressEnter}
                  />
                </Form.Item>
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  marginBottom: "0rem",
                  marginTop: "-3px",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    width: "calc(55%)",
                  }}
                >
                  <p
                    style={{
                      color: blue9,
                      fontWeight: "400",
                      margin: "0 0 0.75rem 0",
                      fontSize: "12px",
                    }}
                  >
                    Item Labels
                  </p>
                  <Form.Item name="custom_labels" style={{ marginTop: "-8px" }}>
                    <Input
                      placeholder="Spicy, Halal, Kosher, ..."
                      maxLength={128}
                      onChange={handleCustomLabelChange}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault(); // Prevents the default action
                        }
                      }}
                      style={{
                        ...style.itemLabelInput,
                      }}
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  name="item_options"
                  label={
                    <p style={{ color: blue9, ...style.itemExtraLabel }}>
                      Add or Edit
                    </p>
                  }
                  rules={[{ validator: validateItemOptions }]}
                  style={{
                    display: "inline-block",
                    width: "calc(35%)",
                    marginLeft: "8px",
                  }}
                >
                  <Button
                    block
                    style={{
                      backgroundColor: "transparent",
                      border: `1px solid ${blue9}`,
                      height: "35px",
                      width: "156px",
                    }}
                    onClick={() => updateCurrentStep(true)}
                  >
                    Modifiers
                  </Button>
                </Form.Item>
              </div>
              <Form.Item
                name="labels"
                style={{ marginBottom: "0rem", marginTop: "-16px" }}
              >
                <Flex gap="small" wrap="wrap">
                  <Tooltip title="Vegetarian">
                    <Button
                      onClick={() => handleButtonClick("Vegetarian")}
                      style={{
                        marginBottom: "8px",
                        ...style.adjustableBtn,
                        border: selectedLabels["Vegetarian"]
                          ? `2px solid ${purple1}`
                          : `1px solid ${cyan2}`,
                      }}
                    >
                      <span style={{ ...style.adjustableBtnIcon }}>
                        <MdOutlineEco />
                      </span>

                      {selectedLabels["Vegetarian"] && (
                        <span style={{ ...style.adjustableBtnTxt }}>
                          Vegetarian
                        </span>
                      )}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Gluten Free">
                    <Button
                      onClick={() => handleButtonClick("GlutenFree")}
                      style={{
                        marginBottom: "8px",
                        ...style.adjustableBtn,
                        border: selectedLabels["GlutenFree"]
                          ? `2px solid ${purple1}`
                          : `1px solid ${cyan2}`,
                      }}
                    >
                      <span style={{ ...style.adjustableBtnIcon }}>
                        <BiSpa />
                      </span>

                      {selectedLabels["GlutenFree"] && (
                        <span style={{ ...style.adjustableBtnTxt }}>
                          Gluten Free
                        </span>
                      )}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Vegan">
                    <Button
                      onClick={() => handleButtonClick("Vegan")}
                      style={{
                        marginBottom: "8px",
                        ...style.adjustableBtn,
                        border: selectedLabels["Vegan"]
                          ? `2px solid ${purple1}`
                          : `1px solid ${cyan2}`,
                      }}
                    >
                      <span style={{ ...style.adjustableBtnIcon }}>
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <div
                            style={{
                              position: "relative",
                              top: 13,

                              left: 0,
                              zIndex: 1,

                              transform: "rotate(-80deg) scaleY(-1)",
                              clipPath:
                                "polygon(80% 0, 100% 70%, 160% 100%, -30% 10%)",
                            }}
                          >
                            <MdOutlineEco style={{ color: "white" }} />
                          </div>
                          <MdOutlineEco
                            style={{
                              position: "relative",
                              top: -10,
                              left: -3,
                              transform: "rotate(300deg)",
                              zIndex: 2,
                            }}
                          />
                        </div>
                        {selectedLabels["Vegan"] && (
                          <span
                            style={{
                              ...style.adjustableBtnTxt,
                              top: -15,
                              marginLeft: "0.5rem",
                              position: "relative",
                            }}
                          >
                            Vegan
                          </span>
                        )}
                      </span>
                    </Button>
                  </Tooltip>
                </Flex>
              </Form.Item>
              <Row gutter={16} style={{ marginTop: "22px" }}>
                <Col className="gutter-row" span={9}>
                  <Button
                    htmlType="button"
                    style={{
                      backgroundColor: "transparent",
                      border: `1px solid ${colorBgContainerDisabled}`,
                      color: `${red1}`,
                      height: "50px",
                      width: "161px",
                    }}
                    size="large"
                    block
                    onClick={action}
                    disabled={isLoading}
                    name="cancel-btn"
                  >
                    Cancel
                  </Button>
                </Col>
                <Col className="gutter-row" span={15}>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    style={{
                      backgroundColor: colorTextBase,
                      color: blue7,
                      height: "50px",
                      ...style.saveBtn,
                    }}
                    block
                    onClick={handleFormSubmit}
                    disabled={isLoading}
                    name="add-btn"
                  >
                    {/* {statusChange} */}
                    {clickedComponent
                      ? clickedComponent.includes("Add")
                        ? "Save Item"
                        : "Update"
                      : ""}
                    {isLoading && <Spin style={{ marginLeft: "0.5rem" }} />}
                  </Button>
                </Col>
              </Row>
            </Flex>
          </Form>
        </div>
      ) : selectedStep == 1 ? (
        <ItemOptionsList />
      ) : isExistingItem ? (
        <ExistingItemList />
      ) : isUpdatingItemOption ? (
        <UpdateItemOption />
      ) : (
        <NewItemOption />
      )}
    </Modal>
  );
}

export default AddItem;
