import style from "@/styles/menu/menu-modals";
import { Flex } from "antd";
import React from "react";
import { theme } from "antd";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

interface ItemCounterProps {
  handleDecrement: (index: number, id: number) => any;
  handleIncrement: (index: number, id: number) => any;
  count: number;
  choiceLimit?: boolean;
  index: number;
  id: number;
}
function ItemCounter({
  handleDecrement,
  handleIncrement,
  count,
  choiceLimit = true,
  index,
  id,
}: ItemCounterProps) {
  const {
    token: { geekblue8, colorWhite },
  } = theme.useToken();
  return (
    <Flex vertical={true} gap={"1rem"}>
      {choiceLimit && <span style={style.updateLabelF}>Choice limit</span>}
      <Flex justify="center" align="center" gap={"0.5rem"}>
        <CiCircleMinus
          style={{ cursor: "pointer", width: "14.45px", height: "14.45px" }}
          onClick={() => handleDecrement(index, id)}
        />
        <span
          style={{
            borderRadius: "6px",
            width: "24px",
            height: "20px",
            textAlign: "center",

            backgroundColor: geekblue8,
            ...style.updateLabel2,
            color: colorWhite,
          }}
        >
          {count}
        </span>
        <CiCirclePlus
          style={{ cursor: "pointer", width: "14.45px", height: "14.45px" }}
          onClick={() => handleIncrement(index, id)}
        />
      </Flex>
    </Flex>
  );
}

export default ItemCounter;
