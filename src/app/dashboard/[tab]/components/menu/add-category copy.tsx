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
  FormInstance,
} from "antd";
import Option from "antd/es/select";
import React, { useEffect, useState, useRef } from "react";
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
import { CREATE_MENU, CREATE_CATEGORY } from "@/lib/mutations/menu";
import { useMenuContext } from "@/app/providers/MenuProvider";
import { GET_ALL_MENUS } from "@/lib/queries/menu";
import validation from "@/validations/menu-validation";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { IoCloseSharp } from "react-icons/io5";
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
  label: string;
  value: string;
}

function AddCategory({
  action,
  itemType,
  modalTitle,
  modalVisibility,
  itemId,
  clickedComponent,
}: AddCategoryProps) {
  const { updateMenuAdded, updateCategoryAdded, clickedMenuCardId } =
    useMenuContext();
  const [itemName, setItemName] = useState("");
  const [menuStatus, setMenuStatus] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("");
  const [isColourSelected, setIsColourSelected] = useState(false);
  const [iconMenu, setIconMenu] = useState("");
  const [assignMenu, setAssignMenu] = useState("");
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetForm, setIsResetForm] = useState(false);

  useEffect(() => {
    setItemName("");
    setMenuStatus(true);
    setBackgroundColor("");
    setIsColourSelected(false);
    setIconMenu("");
    setAssignMenu("");
  }, [action]);

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

  const [createMenu] = useMutation<any>(CREATE_MENU);
  const [createCategory] = useMutation<any>(CREATE_CATEGORY);

  const menuList: any[] =
    menusData &&
    menusData.getAllMenus &&
    menusData.getAllMenus.menus &&
    menusData.getAllMenus.menus
      .filter((item: any) => item.is_special === false)
      .map((item: any) => ({ value: item.id, label: item.name }));
  const formUseRef = useRef<FormInstance>(null);
  const _updatedMenu =
    menusData &&
    menusData.getAllMenus &&
    menusData.getAllMenus.menus &&
    menusData.getAllMenus.menus.filter((menu: Menu) => menu.id === itemId);

  // Execute DB Menu create
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
          const response = await createMenu({
            variables: {
              menuInput: {
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
        });
      } else {
        setIsLoading(false);
      }
    } catch (_error) {
      setIsLoading(false);
    }
  };

  // Execute DB Category create
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
          const response = await createCategory({
            variables: {
              categoryInput: {
                name: formValues.itemName,
                is_active: formValues.menuStatus,
                item_count: 0,
                color: formValues.colorBackgroundMenu,
                icon: formValues.iconMenu,
                description: formValues.menuDescription,
                menu_id: assignMenu,
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

  const handleIconClick = (key: string) => {
    setIconMenu(key);
    form.setFieldsValue({
      iconMenu: key,
    });
  };

  const { lg, xl } = useBreakpoint();

  useEffect(() => {
    const selectedMenu = menuList.filter(
      (obj) => obj.value === clickedMenuCardId
    )[0];

    form.setFieldsValue({ assignMenu: selectedMenu.value, menuStatus: true });
  }, [clickedMenuCardId, isResetForm]);
  const handleCloseModal = () => {
    if (formUseRef.current) {
      formUseRef.current.resetFields();
    }
    setIsResetForm(!isResetForm);
    action();
  };

  return (
    <Modal
      style={{
        ...style.modalContainer,
        top: 143,
        right: xl ? "-28%" : lg ? "-23%" : "-15%",
        border: `12px solid ${colorBgBase}`,
        borderRadius: "1.5rem",
        paddingBottom: 0,
      }}
      width={"fit-content"}
      open={modalVisibility}
      onCancel={handleCloseModal}
      footer={null}
      closable={false}
    >
      <div style={style.menuModals}>
        <Row>
          <Col span={23}>
            <div style={style.modalTitle}>{modalTitle}</div>
          </Col>
          <Col span={1}>
            <div style={style.closeBtn} onClick={action}>
              <IoCloseSharp />
            </div>
          </Col>
        </Row>
        <Flex vertical={true} gap={"2rem"}>
          <Form
            ref={formUseRef}
            form={form}
            name="validateOnly"
            layout="vertical"
            autoComplete="off"
            initialValues={{
              itemName: "",
              menuStatus: true,
              iconMenu: "",
              colorBackgroundMenu: "",
              menuDescription: "",
            }}
          >
            <Flex vertical={false} style={{ margin: 0, padding: 0 }}>
              <Flex vertical={true}>
                <MenuItem
                  itemType={itemType}
                  title={itemName}
                  count={0}
                  iconKey={iconMenu}
                  bgColour={backgroundColor}
                />
              </Flex>

              <Flex vertical={true} style={{ marginLeft: "17px" }}>
                <Flex vertical={true} style={style.fontStyle}>
                  <Form.Item
                    required={false}
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

                  {/* <Flex vertical={true} gap={"0.2rem"}> 
                  <Form.Item
                    style={{ marginTop: -6 }}
                    name="menuStatus"
                    label={
                      <p style={{ color: blue9, ...style.updateLabelNew }}>
                        {itemType.charAt(0).toUpperCase() + itemType.slice(1)}{" "}
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
                    // className="switch-right-mark"
                    />
                  </Form.Item>*/}
                  <Row gutter={16}>
                    {/* First column */}
                    <Col span={12}>
                      <Form.Item
                        style={{
                          width: itemType === "menu" ? undefined : 120,
                        }}
                        name="menuStatus"
                        label={
                          <p style={{ color: blue9, ...style.updateLabelNew }}>
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
                              style={{ color: blue9, ...style.updateLabelNew }}
                            >
                              Language
                            </p>
                          }
                        >
                          <Select placeholder="Select a language" allowClear>
                            <Option value="en">EN</Option>
                            <Option value="fr">FR</Option>
                            <Option value="es">ES</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    )}
                  </Row>

                  {itemType.includes("category") && menuList && (
                    <Form.Item
                      required={false}
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
                        onChange={handleChangeDropdown}
                        allowClear={true}
                        options={menuList}
                      />
                    </Form.Item>
                  )}
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
                  placeholder="Briefly describe your menu."
                  style={{
                    border: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    height: "52px",
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
                margin: 0,
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
              >
                Cancel
              </Button>

              <Form.Item name="btnAdd">
                <Button
                  style={{
                    backgroundColor: colorFillSecondary,
                    color: colorTextLightSolid,
                    fontWeight: 700,
                    fontSize: "16px",
                    width: 243,
                    height: 49,
                  }}
                  type="primary"
                  htmlType="submit"
                  onClick={
                    itemType === "menu"
                      ? handleCreateMenu
                      : handleCreateCategory
                  }
                  disabled={isLoading}
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
            </div>
          </Form>
        </Flex>
      </div>
    </Modal>
  );
}

export default AddCategory;
