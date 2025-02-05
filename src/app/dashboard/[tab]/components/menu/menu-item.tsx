import { theme } from "antd";
import React from "react";
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
// import { MdLocalPizza } from "react-icons/md";
interface MenuItemProps {
  bgColour: string;
  title: string;
  count: number;
  itemType: string;
  iconKey?: string;
}
function MenuItem({
  itemType,
  bgColour = "#FFEDBE",
  title,
  count,
  iconKey,
}: // icon,
MenuItemProps) {
  const {
    token: { colorBgBase },
  } = theme.useToken();

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

  const icon = iconKey && icons[iconKey!];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "10px",
        aspectRatio: "1 / 1",
        cursor: "pointer",
        backgroundColor: bgColour ? bgColour : "#FFEDBE",
        width: "173px",
        // width: itemType === "menu" ? "173px" : "200px",
        marginTop: itemType === "menu" ? "0" : "6px",
      }}
    >
      <div
        style={{
          margin: "46.98px 0 0 18.1px",
          padding: 0,
        }}
      >
        <div
          style={{
            color: colorBgBase,
            fontSize: "2rem",
            padding: 0,
          }}
        >
          {icon ?? <LuPizza />}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          color: colorBgBase,
          margin: "0 0 0 22px",
        }}
      >
        <span
          style={{ fontSize: "18px", fontWeight: 700, lineHeight: "21.78px" }}
        >
          {title}
        </span>
        <span
          style={{
            margin: "6.74px 0 20.79px 0",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "16.94px",
          }}
        >
          {itemType.includes("category")
            ? `${count} items`
            : `${count} categories`}
        </span>
      </div>
    </div>
  );
}

export default MenuItem;
