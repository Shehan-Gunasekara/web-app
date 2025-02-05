import { Card, Dropdown, MenuProps, theme, Flex } from "antd";
import React from "react";
import {
  FaAppleAlt,
  FaBreadSlice,
  FaCoffee,
  FaCookieBite,
  FaEgg,
} from "react-icons/fa";
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
import { MdMoreHoriz, MdEdit, MdBakeryDining, MdCake } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { useMenuContext } from "@/app/providers/MenuProvider";
import style from "@/styles/menu/menu-item";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import fireIcon from "../../../../../../public/assets/fire_icon.svg";
import Image from "next/image";

interface MenuItemProps {
  id: number;
  color: string;
  language: string;
  name: string;
  item_count: number;
  itemType: string;
  icon: string;
  action: (clickedItem: string, itemId: number) => any;
  clickedComponent: string;
  itemId: number;
  selectedLabel?: string;
}

// const DragHandle = sortableHandle(({ active }) => (
//   <MenuOutlined style={{ cursor: "grab", color: active ? "blue" : "#999" }} />
// ));

// const SortableItem = sortableElement((props) => <tr {...props} />);
// const SortableContainer = sortableContainer((props) => <tbody {...props} />);

function MenuListItem({
  id,
  itemType,
  color,
  name,
  item_count,
  language,
  icon,
  action,
  clickedComponent,
}: // selectedLabel,
  // itemId,
  MenuItemProps) {
  const {
    token: { colorBgBase, colorPrimaryBg },
  } = theme.useToken();

  const {
    clickedMenuCardId,
    setClickedMenuCardId,
    clickedCategoryCardId,
    setClickedCategoryCardId,
    selectedLabel,
  } = useMenuContext();

  const icons: { [key: string]: JSX.Element } = {
    bread: <FaBreadSlice />,
    cake: <MdCake />,
    pot: <GiApothecary />,
    leaf: <GiOakLeaf />,
    glass: <FaGlassWater />,
    bottle: <FaBottleWater />,
    pizza: <LuPizza />,
    vegitable: <GiCoffeeBeans />,
    cofee: <FaCoffee />,
    cookie: <FaCookieBite />,
    bun: <MdBakeryDining />,
    egg: <FaEgg />,
    drumstick: <LiaDrumstickBiteSolid />,
    meal: <PiHamburgerFill />,
    fish: <FaFishFins />,
    cupCake: <GiCupcake />,
    apple: <FaAppleAlt />,
    meals: <PiHamburgerFill />,
    dinner: <GiMeal />,
    chicken: <GiChickenOven />,
    wine: <GiWineBottle />,
    drink: <BiSolidDrink />,
    slice: <GiOrangeSlice />,
  };

  const actualIcon = icons[icon];

  const handleClick = (componentType: string, itemID: number) => {
    clickedComponent = componentType;
    action(clickedComponent, itemID);
  };

  const handleMenuClick: MenuProps["onClick"] = (e: any) => {
    if (e.key === "update") {
      if (itemType === "menu") {
        handleClick("Update menu", id);
      } else if (itemType === "category") {
        handleClick("Update category", id);
      }
    } else if (e.key === "delete") {
      if (itemType === "menu") {
        handleClick("Delete menu", id);
      } else if (itemType === "category") {
        handleClick("Delete category", id);
      }
    }
  };

  const handleCardClick = () => {
    if (itemType === "menu") {
      setClickedCategoryCardId(null);
      setClickedMenuCardId(id);
    } else if (itemType === "category") {
      setClickedCategoryCardId(id);
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Update",
      key: "update",
      icon: <MdEdit />,
    },
    {
      label: "Delete",
      key: "delete",
      icon: <RiDeleteBinLine />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      {...attributes}
      {...listeners}
    >
      {/* <div
        style={{
          position: "absolute",
          left: 10,
          top: 10,
          zIndex: 1,
        }}
      >
        <MdDragIndicator fontSize={20} />
      </div> */}
      <div
        style={{
          borderBottom:
            (itemType === "menu" &&
              clickedMenuCardId &&
              clickedMenuCardId === id) ||
              (itemType === "category" &&
                clickedCategoryCardId &&
                clickedCategoryCardId === id)
              ? `3px solid ${colorPrimaryBg}`
              : "3px solid transparent",
          ...style.cardContainer,
        }}
      >
        <Card
          onClick={handleCardClick}
          hoverable
          bodyStyle={style.bodyStyle}
          style={{
            backgroundColor: color ? color : "#FFEDBE",
            ...style.card,
          }}
        >
          {selectedLabel != "Archived" && (
            <>
              {selectedLabel === "Menu" ? (
                <>
                  <Dropdown menu={menuProps} placement="bottomRight">
                    <div style={style.cardOptions}>
                      <MdMoreHoriz color={colorBgBase} fontSize="1rem" />
                    </div>
                  </Dropdown>
                  {language && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "16px",
                        right: "21px",
                        color: colorBgBase,
                        ...style.cardText,
                      }}
                    >
                      {language.toUpperCase()}
                    </div>
                  )}
                </>
              ) : (
                <div style={style.cardOptions}>
                  <MdMoreHoriz color={colorBgBase} fontSize="1rem" />
                </div>
              )}
            </>
          )}
          <Flex
            vertical={true}
            gap={4}
            justify={"space-between "}
            align="stretch"
            style={{
              height: "100%",
              marginLeft: "7px",
              width: "160px",
            }}
          >
            <div
              style={{
                color: colorBgBase,
                ...style.cardIcon,
              }}
            >
              {selectedLabel != "Specials" ? (
                icon === "special" ? (
                  <Image alt="fire icon" src={fireIcon} />
                ) : (
                  actualIcon ?? <MdBakeryDining />
                )
              ) : (
                <Image alt="fire icon" src={fireIcon} />
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "60px",
                justifyContent: "flex-end",
                gap: "0.3rem",
              }}
            >
              <span
                style={{
                  color: colorBgBase,
                  ...style.cardTitle,
                }}
              >
                {/* {name.length > 24 ? `${name.slice(0, 23)}...` : name} */}
                {name}
              </span>
              <span
                style={{
                  color: colorBgBase,
                  ...style.cardText,
                }}
              >
                {itemType.includes("category")
                  ? `${item_count} items`
                  : `${item_count} categories`}
              </span>
            </div>
          </Flex>
        </Card>
      </div>
    </div>
  );
}

export default MenuListItem;
