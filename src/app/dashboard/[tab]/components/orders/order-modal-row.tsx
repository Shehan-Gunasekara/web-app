import React from "react";
import { Flex, theme } from "antd";
import style from "@/styles/orders/order-details";
import { Order } from "@/utils/interfaces";

interface RowModalOrderProps {
  order: Order;
}

function RowModalOrder({ order }: RowModalOrderProps) {
  //function RowOrder({ orderDetails }: OrderItemProps) {

  const {
    token: {
      // colorTextDescription,
      colorTextDisabled,
      colorBgBase,
      green3,
      colorInfoText,
      yellow1,
      blue2,
      green5,
      red3,
    },
  } = theme.useToken();
  const { customer, order_no, status, date, items, amount } = order;
  // const { orderName, orderId, orderStatus, orderItems } = orderDetails;

  const dateObject = new Date(date);
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0"); // Convert to 12-hour format with leading zero

  const formattedMinutes = minutes.toString().padStart(2, "0"); // Add leading zero to minutes if needed

  const formattedTime = `${formattedHours}:${formattedMinutes} ${amPm}`;

  let orderStatusColor = green3;
  switch (status.toLowerCase()) {
    case "new":
      orderStatusColor = yellow1;
      break;
    case "preparing":
      orderStatusColor = blue2;
      break;
    case "fulfilled":
      orderStatusColor = green5;
      break;
    case "cancelled":
      orderStatusColor = red3;
      break;
    default:
      orderStatusColor = "red";
  }
  return (
    <Flex
      align="center"
      gap="1rem"
      style={{ background: colorInfoText, ...style.rowTwoStyle }}
    >
      <div
        style={{
          ...style.secondRowTile,
          width: "48px",
          height: "44px",
          flex: 1,
        }}
      >
        <span
          style={{
            color: colorTextDisabled,
            ...style.textOne,
          }}
        >
          Order
        </span>
        <span style={{ ...style.textTwoRowMiddle }}>#{order_no}</span>
      </div>
      <div
        style={{
          ...style.secondRowTile,
          width: "86px",
          height: "44px",
          flex: 1.8,
        }}
      >
        <span
          style={{
            color: colorTextDisabled,
            ...style.textOne,
          }}
        >
          Placed
        </span>
        <span style={{ ...style.textTwoRowMiddle, width: "86px" }}>
          {formattedTime}
        </span>
      </div>

      <div
        style={{
          ...style.secondRowTile,
          width: "45px",
          height: "44px",
          flex: 1,
        }}
      >
        <span
          style={{
            color: colorTextDisabled,
            ...style.textOne,
            width: "45px",
            textAlign: "center",
          }}
        >
          Seat
        </span>
        <span
          style={{
            ...style.textTwoRowMiddle,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: "45px",
            textAlign: "center",
          }}
        >
          {customer.index}
        </span>
      </div>

      <div
        style={{
          ...style.secondRowTile,
          width: "140px",
          height: "44px",
          flex: 1,
        }}
      >
        <span
          style={{
            color: colorTextDisabled,
            ...style.textOne,
          }}
        >
          Name
        </span>
        <span
          style={{
            ...style.textTwoRowMiddle,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: "140px",
          }}
        >
          {customer.name}
        </span>
      </div>

      <div
        style={{
          ...style.secondRowTile,
          width: "37px",
          height: "44px",
          flex: 1,
        }}
      >
        <span
          style={{
            color: colorTextDisabled,

            ...style.textOne,
          }}
        >
          Items
        </span>
        <span style={{ ...style.textTwoRowMiddle }}>{items.length}</span>
      </div>

      <div
        style={{
          ...style.secondRowTile,
          width: "53px",
          height: "44px",
          flex: 1,
        }}
      >
        <span
          style={{
            color: colorTextDisabled,
            ...style.textOne,
          }}
        >
          Total
        </span>
        <span style={{ ...style.textTwoRowMiddle }}>
          {amount && amount.toFixed(2)}
        </span>
      </div>
      {/* 
      <div style={style.secondRowTile}>
        <span
          style={{
            color: colorTextDisabled,
            ...style.textOne,
          }}
        >
          Status
        </span>
        <div
          style={{
            background: green3,
            color: colorBgBase,
            ...style.textTwoRowStatus,
          }}
        >
          Received
        </div>
      </div> */}

      <div style={style.secondRowTile}>
        <div
          style={{
            background: orderStatusColor,
            color: colorBgBase,
            ...style.textTwoRowStatusMiddle,
          }}
        >
          {status == "preparing"
            ? "Preparing"
            : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </div>
      </div>
      {/* <div style={style.secondRowTile}>
        <Button
          style={{
            border: `2px solid ${colorTextDisabled}`,
            color: colorTextDisabled,
            ...style.btnClose,
          }}
        >
          Close
        </Button>
      </div> */}
    </Flex>
  );
}

export default RowModalOrder;
