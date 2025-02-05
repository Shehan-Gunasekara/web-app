import style from "@/styles/table/table-components";
import { theme } from "antd";
import React, { ReactNode } from "react";

interface TableBtnProps {
  btnText: string;
  btnIcon?: ReactNode;
  action: () => any;
  minWidth?: string;
  minHeight?: number;
  fontSize?: string;
  padding?: string;
}
function TableBtn({
  btnText,
  btnIcon,
  action,
  minWidth,
  minHeight,
  fontSize,
  padding,
}: TableBtnProps) {
  const {
    token: { colorFillSecondary, colorTextLightSolid },
  } = theme.useToken();

  return (
    <div
      style={{
        fontSize: fontSize != null ? fontSize : "16px",
        minHeight: minHeight != null ? minHeight : "",
        minWidth: minWidth === null ? "100%" : minWidth,
        padding: padding != null ? padding : "0.5rem",
        backgroundColor: colorFillSecondary,
        color: colorTextLightSolid,
        ...style.tabelButton,
      }}
      onClick={() => action()}
      id="referenceThing"
    >
      <span>{btnText}</span>
      {btnIcon}
    </div>
  );
}

export default TableBtn;
