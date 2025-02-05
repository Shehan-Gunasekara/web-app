import {
  Button,
  Col,
  Flex,
  Row,
  Switch,
  Modal,
  theme,
  Select,
  Form,
  Input,
  Spin,
} from "antd";
import Option from "antd/es/select";
import React, { useState } from "react";
import MenuItem from "./menu-item";
import style from "@/styles/menu/menu-modals";
import {
  FaAppleAlt,
  FaBreadSlice,
  FaCoffee,
  FaCookieBite,
  FaEgg,
} from "react-icons/fa";
import { MdBakeryDining, MdCake } from "react-icons/md";
import {
  GiApothecary,
  GiChickenOven,
  GiCoffeeBeans,
  GiCupcake,
  GiMeal,
  GiOakLeaf,
  GiOrangeSlice,
  GiWineBottle,
} from "react-icons/gi";
import { FaBottleWater, FaFishFins, FaGlassWater } from "react-icons/fa6";
import { LuPizza } from "react-icons/lu";
import { PiHamburgerFill } from "react-icons/pi";
import { BiSolidDrink } from "react-icons/bi";
import { LiaDrumstickBiteSolid } from "react-icons/lia";
import { TiTick } from "react-icons/ti";
import TextArea from "antd/es/input/TextArea";
import { useMutation, useQuery } from "@apollo/client";
import { IoCloseSharp } from "react-icons/io5";
import {
  // CREATE_MENU,
  // CREATE_CATEGORY,
  UPDATE_MENU,
  UPDATE_CATEGORY,
} from "@/lib/mutations/menu";
import LoaderLite from "@/app/components/loader-lite";
import { useMenuContext } from "@/app/providers/MenuProvider";
import { GET_ALL_MENUS, GET_ALL_CATEGORIES } from "@/lib/queries/menu";
import validation from "@/validations/menu-validation";
import { message } from "antd";
interface AddCategoryProps {
  action: () => any;
  itemType: string;
  modalTitle: string;
  modalVisibility: boolean;
  itemId?: number;
  clickedComponent?: string;
}

interface Menu {
  id: number;
}

function UpdateCategory({
  action,
  itemType,
  modalTitle,
  modalVisibility,
  itemId,
  clickedComponent,
}: AddCategoryProps) {
  const { updateMenuAdded, updateCategoryAdded } = useMenuContext();

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

  // const [createMenu] = useMutation<any>(CREATE_MENU);
  const [updateMenu] = useMutation<any>(UPDATE_MENU);
  // const [createCategory] = useMutation<any>(CREATE_CATEGORY);
  const [updateCategory] = useMutation<any>(UPDATE_CATEGORY);

  // const menuList =
  //   menusData &&
  //   menusData.getAllMenus &&
  //   menusData.getAllMenus.menus &&
  //   menusData.getAllMenus.menus.map((item: any) => {
  //     return { value: item.id, label: item.name };
  //   });

  const menuList =
    menusData &&
    menusData.getAllMenus &&
    menusData.getAllMenus.menus &&
    menusData.getAllMenus.menus
      .filter((item: any) => item.is_special === false)
      .map((item: any) => ({ value: item.id, label: item.name }));

  let updatedMenu: any = [];
  let updatedCategory: any = [];

  if (clickedComponent === "Update menu") {
    updatedMenu =
      menusData &&
      menusData.getAllMenus &&
      menusData.getAllMenus.menus &&
      menusData.getAllMenus.menus.filter((menu: Menu) => menu.id === itemId);
  } else {
    updatedCategory = categoriesData.getAllCategorys.filter(
      (category: Menu) => category.id === itemId
    );
  }

  const [itemName, setItemName] = useState(
    updatedMenu[0]?.name ?? updatedCategory[0]?.name ?? ""
  );
  const [menuStatus, setMenuStatus] = useState(
    updatedMenu[0]?.is_active ?? updatedCategory[0]?.is_active ?? false
  );

  const [language, setLanguage] = useState(updatedMenu[0]?.language ?? null);

  const [backgroundColor, setBackgroundColor] = useState(
    updatedMenu[0]?.color ?? updatedCategory[0]?.color ?? null
  );

  const [iconMenu, setIconMenu] = useState(
    updatedMenu[0]?.icon ?? updatedCategory[0]?.icon ?? null
  );

  const [menuDescription, setMenuDescription] = useState(
    updatedMenu[0]?.description ?? updatedCategory[0]?.description ?? ""
  );

  const [assignMenu, setAssignMenu] = useState(
    updatedCategory[0]?.menu.id ?? ""
  );

  const count =
    updatedMenu[0] && updatedMenu[0]?.categories
      ? updatedMenu[0]?.categories.length
      : updatedCategory[0] && updatedCategory[0]?.items
      ? updatedCategory[0]?.items.length
      : 0;

  const [isColourSelected, setIsColourSelected] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  // Execute DB Menu update
  const handleCreateMenu = async () => {
    const formValues = form.getFieldsValue();
    try {
      if (
        formValues.itemName &&
        formValues.colorBackgroundMenu &&
        formValues.iconMenu &&
        formValues.menuDescription
      ) {
        form.validateFields().then(async () => {
          setIsLoading(true);

          try {
            const response = await updateMenu({
              variables: {
                menuInput: {
                  id: updatedMenu[0].id,
                  name: formValues.itemName,
                  is_active: formValues.menuStatus,
                  item_count: 0,
                  color: formValues.colorBackgroundMenu,
                  language: formValues.language ?? null,
                  icon: formValues.iconMenu,
                  description: formValues.menuDescription,
                  restaurant_id: restaurant_id,
                },
              },
            });

            if (response) {
              setIsLoading(false);
              action();
              updateMenuAdded();
            }
          } catch (error: any) {
            setIsLoading(false);
            console.log(error);

            if (error.message.includes("A menu already exists")) {
              message.error("A menu with this name already exists.");
            } else {
              message.error(
                "An error occurred while creating the menu. Please try again."
              );
            }
          }
        });
      } else {
        setIsLoading(false);
      }
    } catch (_error) {
      setIsLoading(false);
    }
  };

  // Execute DB Category update
  const handleCreateCategory = async () => {
    const formValues = form.getFieldsValue();
    try {
      if (
        formValues.itemName &&
        formValues.colorBackgroundMenu &&
        formValues.iconMenu &&
        formValues.menuDescription &&
        formValues.assignMenu
      ) {
        form.validateFields().then(async () => {
          setIsLoading(true);
          try {
            const response = await updateCategory({
              variables: {
                categoryInput: {
                  id: updatedCategory[0].id,
                  name: formValues.itemName,
                  menu_id: assignMenu,
                  is_active: formValues.menuStatus,
                  item_count: 0,
                  color: formValues.colorBackgroundMenu,
                  icon: formValues.iconMenu,
                  description: formValues.menuDescription,
                  restaurant_id: restaurant_id,
                },
              },
            });

            if (response) {
              setIsLoading(false);
              action();
              updateCategoryAdded();
              updateMenuAdded();
            }
          } catch (error: any) {
            setIsLoading(false);
            console.log(error);

            if (error.message.includes("A category already exists")) {
              message.error("A category with this name already exists.");
            } else {
              message.error(
                "An error occurred while creating the menu. Please try again."
              );
            }
          }
        });
      } else {
        setIsLoading(false);
      }
    } catch (_error) {
      setIsLoading(false);
    }
  };

  const colours = [
    "#FFEDBE",
    "#FCDCC7",
    "#FAD4D3",
    "#C7B2D4",
    "#FDC47E",
    "#BCE5EF",
    "#B0DFDC",
    "#7ECBBE",
    "#E1EED5",
    "#DEE79E",
    "#8AD1D0",
    "#F7AA99",
    "#7FA8D7",
    "#FEDAA6",
  ];

  const {
    token: {
      colorBgBase,
      purple1,
      red1,
      blue9,
      colorBgContainerDisabled,
      colorBgContainer,
      colorFillSecondary,
      colorTextLightSolid,
      green4,
      colorTextDisabled,
      colorTextBase,
    },
  } = theme.useToken();

  const icons = [
    { bread: <FaBreadSlice /> },
    { cake: <MdCake /> },
    { pot: <GiApothecary /> },
    { leaf: <GiOakLeaf /> },
    { glass: <FaGlassWater /> },
    { bottle: <FaBottleWater /> },
    { pizza: <LuPizza /> },
    { vegitable: <GiCoffeeBeans /> },
    { cofee: <FaCoffee /> },
    { cookie: <FaCookieBite /> },
    { bun: <MdBakeryDining /> },
    { egg: <FaEgg /> },
    { drumstick: <LiaDrumstickBiteSolid /> },
    { meal: <PiHamburgerFill /> },
    { fish: <FaFishFins /> },
    { cupCake: <GiCupcake /> },
    { apple: <FaAppleAlt /> },
    { meals: <PiHamburgerFill /> },
    { dinner: <GiMeal /> },
    { chicken: <GiChickenOven /> },
    { wine: <GiWineBottle /> },
    { drink: <BiSolidDrink /> },
    { slice: <GiOrangeSlice /> },
  ];

  const handleChangeDropdown = (value: string) => {
    setAssignMenu(value);
  };

  const handlePressEnter = () => {
    const activeElement = document.activeElement as HTMLInputElement;
    activeElement?.blur();
  };

  const onCheckedChange = (e: any, checked: boolean) => {
    if (checked) {
      setMenuStatus(false);
    } else {
      setMenuStatus(true);
    }
  };

  const handleColourPickerClick = (color: string) => {
    setBackgroundColor(color);
    setIsColourSelected(true);
    form.setFieldsValue({
      colorBackgroundMenu: color,
    });
  };

  const handleChangeLanguage = (value: string) => {
    setLanguage(value ? value : "");
  };

  const handleIconClick = (key: string) => {
    setIconMenu(key);
    form.setFieldsValue({
      iconMenu: key,
    });
  };

  return (
    <Modal
      style={{
        ...style.modalContainer,
        top: 139,
        right: "23px",
        position: "absolute",
        border: `12px solid ${colorBgBase}`,
        borderRadius: "1.5rem",
        paddingBottom: 0,
      }}
      width={"fit-content"}
      open={modalVisibility}
      onCancel={action}
      footer={null}
      closable={false}
    >
      <div style={style.menuModals}>
        <Row>
          <Col span={23}>
            {" "}
            <div style={{ ...style.modalTitle }}>{modalTitle}</div>
          </Col>
          <Col span={1}>
            <div style={{ ...style.closeBtn }} onClick={action}>
              <IoCloseSharp />
            </div>
          </Col>
        </Row>
        <Flex vertical={true} gap={"2rem"}>
          {clickedComponent?.includes("Update") &&
          ((updatedMenu && updatedMenu.length > 0) ||
            (updatedCategory && updatedCategory.length > 0)) ? (
            <Form
              form={form}
              name="validateOnly"
              layout="vertical"
              autoComplete="off"
              initialValues={{
                itemName: itemName,
                menuStatus: menuStatus,
                colorBackgroundMenu: backgroundColor,
                language: language,
                iconMenu: iconMenu,
                menuDescription: menuDescription,
                assignMenu: assignMenu,
              }}
            >
              <Flex vertical={false} style={{ margin: 0, padding: 0 }}>
                <Flex vertical={true}>
                  <MenuItem
                    itemType={itemType}
                    title={clickedComponent?.includes("Update") ? itemName : ""}
                    count={count}
                    iconKey={iconMenu}
                    bgColour={backgroundColor}
                  />
                </Flex>

                <Flex vertical={true} style={{ marginLeft: "17px" }}>
                  <Flex vertical={true} style={style.fontStyle}>
                    <Form.Item
                      required={false}
                      style={{ marginTop: itemType === "menu" ? 0 : -25 }}
                      name="itemName"
                      label={
                        <p style={{ color: blue9, ...style.updateLabelNew }}>
                          {itemType.charAt(0).toUpperCase() + itemType.slice(1)}{" "}
                          name
                        </p>
                      }
                      rules={[
                        {
                          required: true,
                          message: `Please input a ${itemType} name!`,
                        },
                        validation.menuName,
                        validation.nameLength,
                      ]}
                    >
                      <Input
                        placeholder={
                          itemType === "menu" ? "e.g. Dinner" : "e.g. Pizzas"
                        }
                        style={{
                          ...style.inputBox,
                          fontSize: "18px",
                          fontWeight: 700,
                        }}
                        onChange={(e) => {
                          setItemName(e.target.value);
                        }}
                      />
                    </Form.Item>

                    <Row gutter={16}>
                      {/* First column */}
                      <Col span={12}>
                        <Form.Item
                          style={{
                            width: itemType === "menu" ? undefined : 120,
                          }}
                          name="menuStatus"
                          label={
                            <p
                              style={{ color: blue9, ...style.updateLabelNew }}
                            >
                              {itemType.charAt(0).toUpperCase() +
                                itemType.slice(1)}{" "}
                              status
                            </p>
                          }
                        >
                          <Switch
                            style={{
                              backgroundColor: menuStatus
                                ? green4
                                : colorTextDisabled,
                              ...style.switchBox,
                            }}
                            checkedChildren="active"
                            unCheckedChildren="inactive"
                            onChange={(e) => onCheckedChange(e, menuStatus)}
                            defaultChecked={true}
                          />
                        </Form.Item>
                      </Col>

                      {itemType == "menu" && (
                        <Col span={12}>
                          <Form.Item
                            name="language"
                            label={
                              <p
                                style={{
                                  color: blue9,
                                  ...style.updateLabelNew,
                                }}
                              >
                                Language
                              </p>
                            }
                          >
                            <Select
                              placeholder="Select a language"
                              onChange={(value) => handleChangeLanguage(value)}
                              allowClear
                            >
                              <Option value="en">EN</Option>
                              <Option value="fr">FR</Option>
                              <Option value="es">ES</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      )}
                    </Row>

                    {itemType.includes("category") && menuList ? (
                      <Form.Item
                        style={{ marginTop: -16, marginBottom: -8 }}
                        name="assignMenu"
                        label={
                          <p style={{ color: blue9, ...style.updateLabelNew }}>
                            Assign to menu
                          </p>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input a menu name!",
                          },
                        ]}
                      >
                        <Select
                          style={{
                            height: "35px",
                            width: "163px",
                            marginTop: -3,
                          }}
                          defaultValue="Select a value"
                          onChange={handleChangeDropdown}
                          allowClear={true}
                          options={menuList}
                        />
                      </Form.Item>
                    ) : null}
                  </Flex>
                </Flex>
              </Flex>

              <Flex
                vertical={false}
                wrap="wrap"
                style={{
                  margin: "8px 0 0 0",
                  padding: 0,
                  width: "384px",
                }}
              >
                <Form.Item
                  required={false}
                  name="colorBackgroundMenu"
                  label={
                    <p style={{ color: blue9, ...style.updateLabelNew }}>
                      Color backgroundd {itemType}
                    </p>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please select a color!",
                    },
                  ]}
                >
                  <Row gutter={[9, 8]}>
                    {colours.map((color, index) => (
                      <Col md={3} lg={3} xl={3} key={index}>
                        <div
                          style={{
                            backgroundColor: `${color}`,
                            border:
                              isColourSelected && backgroundColor === color
                                ? `3px solid ${purple1}`
                                : "",
                            ...style.colourPickerBox,
                          }}
                          onClick={() => handleColourPickerClick(color)}
                        >
                          {isColourSelected && backgroundColor === color ? (
                            <TiTick color={colorBgBase} />
                          ) : (
                            ""
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Form.Item>

                <Form.Item
                  style={{ marginTop: -10 }}
                  required={false}
                  name="iconMenu"
                  label={
                    <p style={{ color: blue9, ...style.updateLabelNew }}>
                      Icon {itemType}
                    </p>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please select an icon!",
                    },
                  ]}
                >
                  <Row gutter={[9, 8]}>
                    {icons.map((iconObj, index) => {
                      const [key, iconn] = Object.entries(iconObj)[0];

                      return (
                        <Col
                          md={3}
                          lg={3}
                          xl={3}
                          key={index}
                          style={{
                            border:
                              iconMenu === key
                                ? `2px solid ${colorTextBase}`
                                : "none",
                            ...style.iconStyle,
                          }}
                          onClick={() => handleIconClick(key)}
                        >
                          {iconn}
                        </Col>
                      );
                    })}
                  </Row>
                </Form.Item>
              </Flex>

              <Flex vertical={true} style={{ width: "414px", marginTop: -10 }}>
                <Form.Item
                  required={false}
                  name="menuDescription"
                  label={
                    <p style={{ color: blue9, ...style.updateLabelNew }}>
                      Description
                    </p>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please select a description!",
                    },
                    // validation.descriptionLength,
                  ]}
                >
                  <TextArea
                    placeholder={
                      itemType === "menu"
                        ? "Briefly describe your menu."
                        : "Describe your menu."
                    }
                    style={{
                      border: "none",
                      fontSize: "14px",
                      fontWeight: 500,
                      height: "52px",
                    }}
                    onChange={(e) => {
                      setMenuDescription(e.target.value);
                    }}
                    onPressEnter={handlePressEnter}
                  />
                </Form.Item>
              </Flex>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "414px",
                  marginTop: 10,
                  height: "50px",
                  padding: 0,
                }}
              >
                <Button
                  style={{
                    backgroundColor: colorBgContainer,
                    color: red1,
                    border: `2px solid ${colorBgContainerDisabled}`,
                    ...style.cancelButton,
                  }}
                  onClick={() => action()}
                  disabled={isLoading}
                  name="cancel-btn"
                >
                  Cancel
                </Button>

                <Form.Item name="btnAdd">
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: colorFillSecondary,
                      color: colorTextLightSolid,
                      fontWeight: 700,
                      fontSize: "16px",
                      width: 243,
                      height: 49,
                    }}
                    onClick={
                      itemType === "menu"
                        ? handleCreateMenu
                        : handleCreateCategory
                    }
                    disabled={isLoading}
                    name="save-btn"
                  >
                    {/* {statusChange} */}
                    {clickedComponent
                      ? clickedComponent.includes("Update")
                        ? "Update"
                        : "Add"
                      : ""}
                    {isLoading && <Spin style={{ marginLeft: "0.5rem" }} />}
                  </Button>
                </Form.Item>
                {/* <TableBtn minHeight={50} btnText='Update' action={()=>{}}/> */}
              </div>
            </Form>
          ) : (
            <LoaderLite />
          )}
        </Flex>
      </div>
    </Modal>
  );
}

export default UpdateCategory;
