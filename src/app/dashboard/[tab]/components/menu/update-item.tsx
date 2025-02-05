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
import { UPDATE_ITEM } from "@/lib/mutations/item";
import { GET_ITEM_BY_ID } from "@/lib/queries/items";
import toast from "react-hot-toast";
// import Image from "next/image";
import ItemUpdateSkeleton from "@/app/components/skeletons/menu/item-update";
import ExistingItemList from "./existing-item-list";
import { v4 as uuidv4 } from "uuid";
import validation from "@/validations/menu-validation";
import { IoCloseSharp } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdOutlineEco } from "react-icons/md";
import { BiSpa } from "react-icons/bi";
import { LuRefreshCcw } from "react-icons/lu";
import { ItemOptionList } from "@/utils/interfaces";
import UpdateItemOption from "./update-item-option";
import { modifierOptions } from "@/constants/lonovm-constants";
//import { modifierOptions } from "@/constants/lonovm-constants";
interface Category {
  id: string;
  name: string;
  menu: any;
}

interface LabelsState {
  Vegan: boolean;
  Vegetarian: boolean;
  GlutenFree: boolean;
}

function UpdateItem({
  action,
  modalTitle,
  modalVisibility,
  clickedComponent,
  itemId,
}: {
  action: (_?: any) => any;
  modalTitle: string;
  modalVisibility: boolean;
  clickedComponent: string;
  itemId?: number;
  selectedLabel?: string;
}) {
  const {
    token: {
      colorBgBase,
      blue9,
      colorBgContainer,
      colorBgContainerDisabled,
      colorTextBase,
      blue7,
      red1,
      purple1,
      cyan2,
    },
  } = theme.useToken();

  const {
    form,
    selectedStep,
    setSelectedStep,
    updateCurrentStep,
    updateItemAdded,
    itemFileUrls,
    handleFileUpload,
    setItemFileUrls,
    isImageUploading,
    itemOptionGroups,
    isExistingItem,
    isUpdatingItemOption,
    setIsUpdatingItemOption,
    selectedItemOptionList,
    setSelectedItemOptionList,
    selectedLabel,
    planOption,
    updateCategoryAdded,
  } = useMenuContext();

  // const { lg, xl } = useBreakpoint();

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
  // const [selectedMenuId, setSelectedMenuId] = useState("");
  const [filteredCategoryList, setFilteredCategoryList] = useState<Category[]>(
    []
  );

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

  const categoryList =
    categoriesData &&
    categoriesData.getAllCategorys.map((item: any) => {
      return { value: item.id, label: item.name, menu: item.menu };
    });

  const filterCategoryList = (menuId: string) => {
    return (
      categoryList &&
      menuId &&
      categoryList.filter((category: Category) => category.menu.id === menuId)
    );
  };

  const { loading: itemLoading } = useQuery(GET_ITEM_BY_ID, {
    variables: {
      id: itemId,
    },
    fetchPolicy: "network-only",
    onCompleted: async (data) => {
      if (data && data.getItem) {
        const customLabelsData =
          data.getItem.custom_labels && data.getItem.custom_labels.length > 0
            ? data.getItem.custom_labels
            : undefined;

        const menuId =
          categoriesData &&
          categoriesData.getAllCategorys.find(
            (category: any) => category.id === data.getItem.category_id
          )?.menu.id;

        const categoryListFiltered = await filterCategoryList(menuId);

        setFilteredCategoryList(categoryListFiltered);

        form.setFieldsValue({
          name: data.getItem.name,
          price: data.getItem.price,
          description: data.getItem.description,
          menu_id: menuId,
          category_id: data.getItem.category_id,
          is_active: data.getItem.is_active,
          labels: data.getItem.labels,
          custom_labels: customLabelsData,
        });
        // setSelectedMenuId(data.getItem.menu_id);
        setItemFileUrls(data.getItem.img_urls);
        const itemOptions = data.getItem.item_options;

        const updateSelectedLabels = (labelArray: string[]) => {
          const updatedLabels: LabelsState = { ...selectedLabels };
          labelArray.forEach((label) => {
            if (Object.prototype.hasOwnProperty.call(updatedLabels, label)) {
              updatedLabels[label as keyof LabelsState] = true;
            }
          });
          setSelectedLabels(updatedLabels);
        };
        updateSelectedLabels(data.getItem.labels ?? []);

        const updatedList = itemOptions.map((item: any) => {
          const matchingItem = itemOptionGroups.find(
            (option: any) => option.type === item.type
          );
          if (matchingItem) {
            return {
              ...item,
              label: matchingItem.label,
              description: matchingItem.description,
              choices: item.choices.map((choice: any) => {
                return { ...choice, id: uuidv4() };
              }),
            };
          } else {
            return item;
          }
        });
        setSelectedItemOptionList(updatedList);
      }
    },
  });

  const menuList =
    menusData &&
    menusData.getAllMenus &&
    menusData.getAllMenus.menus &&
    menusData.getAllMenus.menus.map((item: any) => {
      return { value: item.id, label: item.name };
    });

  const menuListNormal =
    menusData &&
    menusData.getAllMenus &&
    menusData.getAllMenus.menus &&
    menusData.getAllMenus.menus
      .filter((item: any) => item.is_special === false)
      .map((item: any) => ({ value: item.id, label: item.name }));

  const menuListSpecial =
    menusData &&
    menusData.getAllMenus &&
    menusData.getAllMenus.menus &&
    menusData.getAllMenus.menus
      .filter((item: any) => item.is_special === true)
      .map((item: any) => ({ value: item.id, label: item.name }));

  // let filteredCategoryList =
  //   categoryList &&
  //   selectedMenuId &&
  //   categoryList.filter(
  //     (category: Category) => category.menu.id === selectedMenuId
  //   );

  const [updateItem] = useMutation<any>(UPDATE_ITEM);

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
      }*/

      return {
        ...prevLabels,
        [label]: true,
      };
    });
  };

  const validateItemOptions = async () => {
    let itemPrice = parseFloat(form.getFieldValue("price"));

    selectedItemOptionList.forEach((item: ItemOptionList) => {
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
        new Error(`ERROR: The current item price, with its modifier's respective negative 
            choice prices and choice limits, allows the final total to go below 0. 
            This can be abused to artificially lower the final bill. 
            Please ensure that any modifier price subtractions are set up in such 
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
        const price = parseFloat(formValues["price"]);
        formValues["price"] = price;
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
            item_id: itemId,
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
        formValues["id"] = itemId;

        if (clickedComponent) {
          try {
            const { data: _data } = await updateItem({
              variables: {
                itemInput: formValues,
              },
            });
            if (_data) {
              setIsLoading(false);
              toast.success("Item updated successfully");
              updateItemAdded();
              updateCategoryAdded();
              action();
            }
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
      })
      .catch((_error: any) => {
        toast.error("Please fill all the required fields");
      });
  };

  const handleMenuChange = () => {
    // setSelectedMenuId(value);
    if (form) {
      form.setFieldsValue({
        category_id: "Select a category",
      });
    }
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

  const uploadRef = useRef<HTMLInputElement>(null);

  const handlePressEnter = () => {
    const activeElement = document.activeElement as HTMLInputElement;
    activeElement?.blur();
  };

  const handleMenuClick: MenuProps["onClick"] = (e: any) => {
    if (e.key === "replace") {
      setItemFileUrls([]);
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

  const onCloseModal = () => {
    action();
    setSelectedStep(0);
    setIsUpdatingItemOption(false);
  };

  return (
    <Modal
      style={{
        top: "169px",
        right: "23px", // Position 23px from the right edge
        position: "absolute",
        minHeight: "570px",
        height: "740px",
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
      <>
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
                        selectedStep == 2 &&
                        (isExistingItem || isUpdatingItemOption)
                          ? "97px"
                          : "138px",
                    }}
                  >
                    {selectedStep == 2
                      ? isUpdatingItemOption
                        ? "Update-"
                        : isExistingItem
                        ? "Add Existing Modifiers"
                        : "New Modifier"
                      : "Modifiers"}
                  </b>
                  {isUpdatingItemOption &&
                    (planOption === modifierOptions.required.value ? (
                      <span style={{ ...style.updateOptionModalTitle }}>
                        Required Modifier
                      </span>
                    ) : (
                      <span style={{ ...style.updateOptionModalTitle }}>
                        Optional Modifier
                      </span>
                    ))}
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
            {itemLoading ? (
              <ItemUpdateSkeleton />
            ) : (
              <Form
                form={form}
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
                          src={
                            process.env.NEXT_PUBLIC_IMAGES_URL + itemFileUrls[0]
                          }
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
                            <p
                              style={{ color: blue9, ...style.updateLabelNew }}
                            >
                              Menu
                            </p>
                          }
                          name="menu_id"
                          style={{ marginBottom: "16px", lineHeight: "0.8rem" }}
                          rules={[{ required: true }]}
                        >
                          <Select
                            // value={menu}
                            style={{ ...style.dropDownSelect }}
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
                          rules={[{ required: true }]}
                        >
                          <Select
                            style={{ ...style.dropDownSelect }}
                            // defaultValue="Select a category"
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
                          // className="switch-right-mark"
                          // onChange={(e) => onCheckedChange(e, menuStatus)}
                        />
                      </Form.Item>
                    </Flex>
                  </Flex>
                  <Form.Item
                    style={{ marginTop: "1rem", marginBottom: "0rem" }}
                  >
                    <Form.Item
                      name="name"
                      label={
                        <p style={{ color: blue9, ...style.updateLabelNew }}>
                          Item Name
                        </p>
                      }
                      rules={[
                        { required: true },
                        validation.menuName,
                        validation.nameLength,
                      ]}
                      style={style.itemNameLabel}
                    >
                      <Input
                        placeholder="e.g. Pepperoni Pizza"
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
                  </Form.Item>
                  <Form.Item
                    label={
                      <p
                        style={{
                          color: blue9,
                          ...style.updateLabelNew,
                          fontSize: "14px",
                        }}
                      >
                        Description
                      </p>
                    }
                    name="description"
                    style={style.descriptionBox}
                    rules={[
                      { required: true },
                      // validation.descriptionLength
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
                      <Form.Item
                        name="custom_labels"
                        style={{ marginTop: "-8px" }}
                      >
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
                        Modifiers &nbsp;&nbsp;&nbsp; (
                        {`${selectedItemOptionList.length}`})
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
                        name="save-btn"
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
            )}
          </div>
        ) : selectedStep == 1 ? (
          <ItemOptionsList />
        ) : isExistingItem ? (
          <ExistingItemList itemId={itemId} />
        ) : isUpdatingItemOption ? (
          <UpdateItemOption />
        ) : (
          <NewItemOption />
        )}
      </>
    </Modal>
  );
}

export default UpdateItem;
