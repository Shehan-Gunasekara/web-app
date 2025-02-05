import style from "@/styles/table/table-components";
import { theme } from "antd";
import React from "react";
import { MdTableRestaurant } from "react-icons/md";

interface TableHeaderInfoProps {
  title: string;
  no: number;
}
function TableHeaderInfo({ title, no }: TableHeaderInfoProps) {
  const {
    token: {
      colorTextBase,
      colorFillSecondary,
      colorBgContainerDisabled,
      colorTextLabel,
      green6,
    },
  } = theme.useToken();
  return (
    <div style={style.tableHeaderInfo}>
      <div style={style.tableHeaderInfoContent}>
        <span
          style={{
            color: colorTextLabel,
            fontSize: "12px",
            fontWeight: "400",
            marginLeft: 5,
          }}
        >
          {title}
        </span>
        {title === "Free" && (
          <div
            style={{
              backgroundColor: colorTextBase,
              ...style.tableHeaderInforCircle,
            }}
          />
        )}
        {title === "Occupied" && (
          <div
            style={{
              backgroundColor: green6,
              ...style.tableHeaderInforCircle,
            }}
          />
        )}
      </div>
      <div style={style.tableHeaderInfoContent}>
        <MdTableRestaurant
          fontSize="2.5rem"
          color={
            title === "Occupied"
              ? green6
              : title === "Free"
              ? colorTextBase
              : colorBgContainerDisabled
          }
        />
        <span
          style={{
            color: colorFillSecondary,
            fontSize: "24px",
            fontWeight: "700",
          }}
        >
          {no}
        </span>
      </div>
    </div>
  );
}

export default TableHeaderInfo;
