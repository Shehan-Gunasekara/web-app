import style from "@/styles/orders/order-item";
import { theme, Row, Col } from "antd";
import React from "react";

interface OrderItemProps {
  orderDetails: {
    id: number;
    table: {
      id: number;
      table_number: string;
    };
    customer: {
      name: string;
    };
    order_no: number;
    status: string;
    // orderStatusChange: string;
    orderDate: string;
    orderTime: string;
    is_bumped: boolean;
    items: {
      id: number;
      name: string;
      quantity: number;
      price: number;
    }[];
    orderDetails: {
      item_id: number;
      quantity: number;
    }[];
    amount: number;
  };
}
function OrderItemTableMiddle({ orderDetails }: OrderItemProps) {
  const { customer, order_no, status, items } = orderDetails;

  const {
    token: {
      colorTextBase,
      colorInfoText,
      colorBgBase,
      green3,
      yellow1,
      blue2,
      green5,
      red3,
      colorTextDisabled,
    },
  } = theme.useToken();

  let orderStatusColor = green3;

  switch (status.toLowerCase()) {
    case "new":
      //   orderStatusColor = green3;
      //   break;
      // case "cooking":
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
    <div
      style={{
        // fontSize: xl ? "1.125rem" : md ? "0.7rem" : "0.9rem",
        // gap: md ? "0.2rem" : "1rem",
        // padding: "0.5rem 1rem",
        height: "65px",

        color: colorTextBase,
        backgroundColor: colorInfoText,
        ...style.middleRow,
        marginBottom: "-10px",
      }}
    >
      <Row>
        {/* cus name */}
        <Col
          span={9}
          style={{
            ...style.middleRowContent,
            // border: "1px solid red",
          }}
        >
          <p
            style={{
              ...style.tableText,

              color: colorTextDisabled,
              marginRight: 5,
            }}
          >
            Customer
          </p>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,

              textOverflow: "ellipsis",
              overflow: "hidden",
              width: "86px",
              whiteSpace: "nowrap",
            }}
          >
            {customer.name}
          </span>
        </Col>

        {/* order no */}
        <Col span={6} style={{ ...style.middleRowContent }}>
          <p
            style={{
              ...style.tableText,

              color: colorTextDisabled,
            }}
          >
            Order
          </p>
          <p style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
            #{order_no}
          </p>
        </Col>

        {/* items */}
        <Col span={3} style={{ ...style.middleRowContent, flex: 1 }}>
          <p
            style={{
              ...style.tableText,
              color: colorTextDisabled,
            }}
          >
            Items
          </p>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
            {/* {orderItems.reduce((total, item) => total + item.quantity, 0)} */}
            {items.length}
          </p>
        </Col>

        {/* status */}
        <Col
          span={6}
          style={{
            display: "flex",
            alignItems: "right",
            justifyContent: "flex-end",
            marginBottom: "5.44px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              background: orderStatusColor,
              color: colorBgBase,

              ...style.textTwoRowStatus,
            }}
          >
            {status == "preparing"
              ? "Preparing"
              : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default OrderItemTableMiddle;
