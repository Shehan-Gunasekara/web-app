import React from "react";
import { theme } from "antd";
//import { Button, Row, theme, Layout } from "antd";
import style from "@/styles/orders/order-details";

interface OrderItemProps {
  orderDetails: {
    orderName: string;
    orderId: number;
    orderStatus: string;
    orderStatusChange: string;
    orderTime: string;
    orderDate: string;
    orderItems: {
      item: string;
      price: number;
      quantity: number;
    }[];
  };
}

// interface OrderDetails {
//   orderDetails: { orders: Order[] };
// }

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

function RowOrder({}: OrderItemProps) {
  //function RowOrder({ orderDetails }: OrderItemProps) {
  const {
    token: {
      colorBgBase,
      colorTextDescription,
      //  colorInfoText,
      //  colorTextDisabled,
      //  blue2,
      yellow1,
    },
  } = theme.useToken();

  // const { orderName, orderId, orderStatus, orderItems } = orderDetails;

  return (
    <>
      <div style={style.secondRowTile}>
        <p
          style={{
            color: colorTextDescription,
            ...style.textOne,
          }}
        >
          Order
        </p>
        <p style={style.textTwoRow}>#345</p>
      </div>

      <div style={style.secondRowTile}>
        <p
          style={{
            color: colorTextDescription,
            ...style.textOne,
          }}
        >
          Name
        </p>
        <p style={style.textTwoRow}>Alex Meraz</p>
      </div>

      <div style={style.secondRowTile}>
        <p
          style={{
            color: colorTextDescription,
            ...style.textOne,
          }}
        >
          Items
        </p>
        <p style={style.textTwoRow}>04</p>
      </div>

      <div style={style.secondRowTile}>
        <p
          style={{
            color: colorTextDescription,
            ...style.textOne,
          }}
        >
          Total
        </p>
        <p style={style.textTwoRow}>$92.42</p>
      </div>

      <div style={style.secondRowTile}>
        <p
          style={{
            color: colorTextDescription,
            ...style.textOne,
          }}
        >
          Status
        </p>
        <div
          style={{
            background: yellow1,
            color: colorBgBase,
            ...style.textTwoRowStatus,
          }}
        >
          Cooking
        </div>
      </div>
    </>
  );
}

export default RowOrder;
