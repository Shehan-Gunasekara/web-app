// import style from "@/styles/menu/menu-modals";
import { Flex } from "antd";
import React from "react";
import { theme } from "antd";
// import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import style from "@/styles/menu/item-option";

interface ItemChoiceCounterProps {
  handleDecrement: () => void;
  handleIncrement: () => void;
  count: number;
  choiceLimit?: boolean;
  label?: string;
}
function ItemChoiceCounter({
  handleDecrement,
  handleIncrement,
  count,
}: ItemChoiceCounterProps) {
  const {
    token: { colorTextBase, colorBgBase, cyan4 },
  } = theme.useToken();

  return (
    <Flex
      vertical={true}
      align="center"
      style={{ marginTop: "0.8rem", marginRight: "0.8rem" }}
    >
      <span
        style={{
          ...style.textChoiceLimit,
          color: cyan4,
        }}
      >
        Choice limit
      </span>
      <Flex justify="center" align="center" gap={"0.5rem"}>
        <div
          style={{
            borderRadius: 10,
            height: "24px",
            width: "24px",
            border: `1px solid ${colorTextBase}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={handleDecrement}
          id="decrementBtn"
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: 300,
              color: colorTextBase,
              marginTop: "-3px",
            }}
          >
            -
          </div>
        </div>
        <span
          style={{
            ...style.updateLabel,
            color: colorTextBase,
            background: colorBgBase,
          }}
          id="choiceCount"
        >
          {count > 0 ? count : "\u221E" /*infinity character*/}
        </span>
        <div
          style={{
            borderRadius: 10,
            height: "24px",
            width: "24px",
            border: `1px solid ${colorTextBase}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={handleIncrement}
          id="incrementBtn"
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: 300,
              color: colorTextBase,
              marginTop: "-3px",
            }}
          >
            +
          </div>
        </div>
      </Flex>
    </Flex>
  );
}

export default ItemChoiceCounter;
