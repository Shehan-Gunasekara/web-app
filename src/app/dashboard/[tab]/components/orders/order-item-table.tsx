import style from "@/styles/orders/order-item";
import React, { useState } from "react";
import { theme } from "antd";

// import { IoMdArrowForward } from "react-icons/io";

import OrderItemTableMiddle from "./order-item-table-middle";

import { useOrderContext } from "@/app/providers/OrderProvider";
// interface OrderItemProps {
//   orderDetails: {
//     tableNo: string;
//     orderName: string;
//     orderId: number;
//     orderStatus: string;
//     orderStatusChange: string;
//     orderDate: string;
//     orderTime: string;
//     orderItems: {
//       item: string;
//       quantity: number;
//       price: number;
//     }[];
//   };
//   action?: (table: any) => any;
// }

interface OrderItemProps {
  orderDetailsTable: {
    tableId: number;
    tableNo: number;
    orders: any[];
  };
  // action?: (table: any) => any;
}

// interface Order {
//   orderName: string;
//   orderId: number;
//   orderStatus: string;
//   orderStatusChange: string;
//   orderDate: string;
//   orderTime: string;
//   orderItems: OrderItem[];
// }

// interface OrderItem {
//   item: string;
//   quantity: number;
//   price: number;
// }

function OrderItemTable({ orderDetailsTable }: OrderItemProps) {
  const [isExpandClicked, setIsExpandClicked] = useState(false);
  const { tableId, tableNo, orders } = orderDetailsTable;
  const {
    handleUpdateOrderClick,

    setOrderIndividual,

    setCloseModalTrigger,
    handleSelectNameCard,
    previousSelectedTable,
    handlePreviousSelectedTable,
  } = useOrderContext();

  // const [IsUpdateOrderModalVisible, setIsUpdateOrderModalVisible] =
  //   useState(false);

  // const handleUpdateOrderClick = () => {
  //   setIsUpdateOrderModalVisible(!IsUpdateOrderModalVisible);
  // };
  const handleOrderTableClick = (event: any) => {
    event.stopPropagation();

    handleUpdateOrderClick(tableId);
    if (previousSelectedTable != tableId || previousSelectedTable == 0) {
      handlePreviousSelectedTable(tableId);
    } else {
      handleSelectNameCard();
    }
  };

  const dateObject = new Date(orders[0].table.session_start_time);
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0"); // Convert to 12-hour format with leading zero

  const formattedMinutes = minutes.toString().padStart(2, "0"); // Add leading zero to minutes if needed

  const formattedTime = `${formattedHours}:${formattedMinutes} ${amPm}`;

  const {
    token: {
      colorBgContainer,
      colorTextBase,
      colorTextDisabled,
      colorInfoText,
      purple3,
      colorTextLightSolid,
    },
  } = theme.useToken();

  const handleExpandClick = (event: any) => {
    event.stopPropagation();
    setIsExpandClicked(true);

    setTimeout(() => {
      setIsExpandClicked(false);
    }, 20000);
  };
  const handleIndividual: any = (order: any, event: any) => {
    event.stopPropagation();

    setCloseModalTrigger(true);
    setOrderIndividual(order.customer_id);
    handleUpdateOrderClick(tableId);
    if (previousSelectedTable != tableId || previousSelectedTable == 0) {
      handlePreviousSelectedTable(tableId);
    } else {
      handleSelectNameCard();
    }
  };
  return (
    <>
      <div
        style={{
          background: colorBgContainer,
          ...style.container,
        }}
        onClick={handleOrderTableClick}
        id="order-table"
      >
        <div style={style.orderItemHeader}>
          <div
            style={{
              margin: 0,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                minWidth: "64px",
                height: "64px",

                color: colorTextBase,
                backgroundColor: colorInfoText,
                ...style.orderItemNo,
              }}
            >
              <p style={style.tableHeaderText}>table</p>
              {tableNo.toString().length > 1 ? tableNo : `0${tableNo}`}
            </div>

            <div
              style={{
                fontSize: "16px",
                color: colorTextBase,
                ...style.orderItemHeaderRest,
              }}
            >
              <p
                style={{
                  color: colorTextDisabled,
                  marginBottom: "4px",
                  ...style.disabledText,
                }}
              >
                Started
              </p>
              {formattedTime}
            </div>
          </div>
          <div
            style={{
              color: colorTextBase,
              ...style.orderItemHeaderActiveRest,
            }}
          >
            <p
              style={{
                color: colorTextDisabled,
                marginBottom: "4px",
                ...style.disabledText,
              }}
            >
              Active Orders
            </p>

            {(
              orders &&
              orders.filter(
                (order: any) =>
                  order.status == "New" || order.status == "Preparing"
              ).length
            ).toString().length > 1
              ? orders &&
                orders.filter(
                  (order: any) =>
                    order.status == "New" || order.status == "Preparing"
                ).length
              : `0${
                  orders &&
                  orders.filter(
                    (order: any) =>
                      order.status == "New" || order.status == "Preparing"
                  ).length
                }`}

            {/* {orders.length} */}
          </div>
        </div>

        {orderDetailsTable.orders.length > 4 ? (
          <>
            {isExpandClicked ? (
              <>
                {" "}
                {orders.map((order, index) => (
                  <div
                    key={index}
                    onClick={(event) => handleIndividual(order, event)}
                  >
                    <OrderItemTableMiddle orderDetails={order} />
                  </div>
                ))}
              </>
            ) : (
              <>
                {" "}
                {orders.slice(0, 4).map((order, index) => (
                  <div
                    key={index}
                    onClick={(event) => handleIndividual(order, event)}
                  >
                    <OrderItemTableMiddle orderDetails={order} />
                  </div>
                ))}
              </>
            )}

            <div
              style={{ color: colorTextBase, ...style.orderBottomSectionTable }}
            >
              {!isExpandClicked && (
                <div
                  style={{
                    color: colorTextLightSolid,
                    background: purple3,
                    ...style.tableExpandButton,
                  }}
                  onClick={handleExpandClick}
                >
                  {orders.length - 4} MORE ORDERS
                </div>
              )}
            </div>
          </>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              onClick={(event) => handleIndividual(order, event)}
            >
              <OrderItemTableMiddle orderDetails={order} />
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default OrderItemTable;
