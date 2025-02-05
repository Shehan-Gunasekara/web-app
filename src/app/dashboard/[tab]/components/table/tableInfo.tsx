import React from "react";
import { MdTableRestaurant } from "react-icons/md";
import { GrDocumentText } from "react-icons/gr";
import style from "@/styles/table/table-components";
import Link from "next/link";
import { theme } from "antd";

interface TableItemProps {
  tableNumber?: number;
  status?: boolean;
}
function TableInfo({ tableNumber, status }: TableItemProps) {
  const {
    token: { colorTextDisabled, colorBgContainerDisabled },
  } = theme.useToken();
  // function formatWithLeadingZeros(number: number): string {
  //   return number.toString().padStart(2, "0");
  // }

  const bgColorTableItem = "#C3E9DD";

  return (
    <div
      style={{
        backgroundColor: status ? bgColorTableItem : colorBgContainerDisabled,
        ...style.container,
      }}
    >
      <div>
        <MdTableRestaurant
          color={status ? "#202225" : "white"}
          fontSize="2.5rem"
        />
      </div>
      <div style={style.tableContent}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <span
            style={{
              color: status ? "black" : colorTextDisabled,
              ...style.tableText,
            }}
          >
            Table
          </span>

          {status && (
            <span
              style={{
                textAlign: "center",
                fontSize: "9px",
                fontWeight: "400",
                marginRight: "0.5rem",
              }}
            >
              view <br />
              orders
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: status ? "black" : colorTextDisabled,
              ...style.tableNo,
            }}
          >
            {tableNumber}
          </span>

          {status && (
            <Link href={"#"}>
              <div style={style.tableDetailsIcon}>
                <GrDocumentText fontSize="1.2rem" color="#000" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default TableInfo;
