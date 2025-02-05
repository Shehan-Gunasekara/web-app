import React, { useEffect, useState } from "react";
import { MdTableRestaurant } from "react-icons/md";
import { GrDocumentText } from "react-icons/gr";
import style from "@/styles/table/table-components";
import Link from "next/link";
import { Card, Flex, theme } from "antd";
import { useTableContext } from "@/app/providers/TableProvider";
import { IoIosCheckmarkCircle } from "react-icons/io";
interface TableItemProps {
  tableNumber?: number;
  // status?: boolean;
  tableDetails: {
    id: number;
    restaurant_id?: number;
    table_number?: number;
    seating_capacity?: number;
    status: string;
    qr_code?: string;
    session_id?: string;
    session_start_time?: string;
    session_elapsed_time?: string;
    is_available: boolean;
  };
  allTableDetails?: any;
  action?: (table: any) => any;
  updateAction?: (table: any) => any;
  setIsDeleteTableCliked: React.Dispatch<React.SetStateAction<boolean>>;
}
function TableItem({
  tableNumber,
  // status,
  tableDetails,
  action,
  updateAction,
  setIsDeleteTableCliked,
}: TableItemProps) {
  const {
    token: {
      colorTextDisabled,
      colorBgContainerDisabled,
      green6,
      green7,
      blue7,
      geekblue7,
      colorWhite,
      colorInfoBg,
    },
  } = theme.useToken();
  // function formatWithLeadingZeros(number: number): string {
  //   return number.toString().padStart(2, "0");
  // }

  const {
    isEditBlurred,
    isTableEditClicked,
    addItemToSelectedList,
    removeItemFromSelectedList,
    selectedTableList,
  } = useTableContext();
  const { is_available, status, seating_capacity } = tableDetails;

  const [isTableSelected, setIsTableSelected] = useState(false);

  const handleSelectClick = () => {
    setIsTableSelected(!isTableSelected);
    if (isTableSelected) {
      removeItemFromSelectedList(tableDetails?.id);
    } else {
      addItemToSelectedList(tableDetails?.id);
    }
  };

  const handleTableClick = () => {
    setIsDeleteTableCliked(false);
    if (isTableEditClicked && status === "free") {
      handleSelectClick();
    }
    if (tableDetails && !isTableEditClicked)
      if (updateAction) {
        updateAction(tableDetails);
      }
  };

  const handleOrdersClick = (e: any) => {
    e.stopPropagation();
    if (tableDetails)
      if (action) {
        action(tableDetails);
      }
  };
  useEffect(() => {
    if (selectedTableList.length == 0) {
      setIsTableSelected(false);
    }
  }, [selectedTableList]);

  return (
    <Card
      bordered={false}
      hoverable={true}
      size="small"
      onClick={() => handleTableClick()}
      style={{
        backgroundColor: is_available
          ? status === "occupied"
            ? isEditBlurred
              ? green7
              : green6
            : colorBgContainerDisabled
          : blue7,
        ...style.container,
      }}
      actions={[
        <div
          key={"table-card"}
          style={{
            opacity:
              is_available && isEditBlurred
                ? status === "occupied"
                  ? "8%"
                  : "100%"
                : "100%",
            ...style.tableContent,
          }}
        >
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
                color: is_available
                  ? status === "occupied"
                    ? "black"
                    : isTableEditClicked
                    ? geekblue7
                    : colorInfoBg
                  : colorTextDisabled,
                ...style.tableText,
              }}
            >
              Table
            </span>

            {is_available && status === "occupied" ? (
              <span
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "400",
                  color: is_available
                    ? status === "occupied"
                      ? "black"
                      : isTableEditClicked
                      ? geekblue7
                      : colorInfoBg
                    : colorTextDisabled,
                }}
              >
                Orders
              </span>
            ) : (
              <span
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "400",
                  marginTop: "auto",
                  color: is_available
                    ? status === "occupied"
                      ? "black"
                      : isTableEditClicked
                      ? geekblue7
                      : colorInfoBg
                    : colorTextDisabled,
                }}
              >
                Seats
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
                color: is_available
                  ? status === "occupied"
                    ? "black"
                    : isTableEditClicked
                    ? geekblue7
                    : colorInfoBg
                  : colorTextDisabled,
                ...style.tableNo,
              }}
            >
              {tableNumber && tableNumber < 10
                ? `0${tableNumber}`
                : tableNumber}
            </span>

            {is_available && status === "occupied" ? (
              <Link href={"#"}>
                <div
                  style={{
                    ...style.tableDetailsIcon,
                    backgroundColor: blue7,
                  }}
                  onClick={handleOrdersClick}
                >
                  <GrDocumentText height="14px" width="16px" color={green6} />
                </div>
              </Link>
            ) : (
              <span
                style={{
                  color: is_available
                    ? status === "occupied"
                      ? "black"
                      : isTableEditClicked
                      ? geekblue7
                      : colorInfoBg
                    : colorTextDisabled,
                  ...style.tableNo,
                  fontSize: "20px",
                }}
              >
                {seating_capacity && seating_capacity < 10
                  ? `0${seating_capacity}`
                  : seating_capacity}
              </span>
            )}
          </div>
        </div>,
      ]}
    >
      <Flex
        vertical={false}
        align="center"
        justify={"space-between"}
        style={{ marginBottom: "0.15rem" }}
      >
        <MdTableRestaurant
          color={
            is_available
              ? status === "occupied"
                ? "black"
                : isTableEditClicked
                ? geekblue7
                : colorInfoBg
              : colorTextDisabled
          }
          fontSize="2.5rem"
          style={{
            opacity:
              is_available && isEditBlurred
                ? status === "occupied"
                  ? "40%"
                  : "100%"
                : "100%",
          }}
        />
        {isTableEditClicked && status === "free" && (
          <Flex
            align="center"
            justify="center"
            style={{
              border: `2px solid ${colorWhite}`,
              width: "1.8em",
              height: "1.8em",
              borderRadius: "50%",
              padding: 0,
            }}
          >
            {" "}
            {isTableSelected && (
              <IoIosCheckmarkCircle color={colorWhite} size={"1.8em"} />
            )}
          </Flex>
        )}
      </Flex>
    </Card>
  );
}

export default TableItem;
