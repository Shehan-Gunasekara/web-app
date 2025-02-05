import style from "@/styles/orders/order-item";
import { theme } from "antd";
import React from "react";

// interface OrderItemProps {
//   orderDetails: {
//     id: string;
//     table: {
//       id: string;
//       table_number: string;
//     };
//     customer: {
//       name: string;
//     };
//     order_no: number;
//     status: string;
//     // orderStatusChange: string;
//     orderDate: string;
//     orderTime: string;
//     is_bumped: boolean;
//     items: {
//       id: string;
//       name: string;
//       quantity: number;
//       price: number;
//     }[];
//     orderDetails: {
//       item_id: string;
//       quantity: number;
//     }[];
//     amount: number;
//   };
// }

interface ViewOrderMiddleProps {
  orderDetails: any;
  timeFunction: (time: string) => any;
}

function ViewOrderMiddle({ orderDetails, timeFunction }: ViewOrderMiddleProps) {
  // function ViewOrderMiddle({ orderDetails }: OrderItemProps) {
  // const { customer, order_no, status, items } = orderDetails;

  const {
    token: {
      colorTextBase,
      colorInfoText,
      green3,
      yellow1,
      blue2,
      red3,
      green5,
      purple5,
      colorTextQuaternary,
    },
  } = theme.useToken();

  let orderStatusColor = green3;
  switch (orderDetails.status.toLowerCase()) {
    case "new":
      //   orderStatusColor = green3;
      //   break;
      // case "cooking":
      orderStatusColor = yellow1;
      break;
    case "in progress":
      orderStatusColor = blue2;
      break;
    case "fulfilled":
      orderStatusColor = green5;
      break;
    case "cancelled":
      orderStatusColor = red3;
      break;
    case "closed":
      orderStatusColor = purple5;
      break;
    default:
      orderStatusColor = "red";
  }

  // returns the total item count
  const totalItems = (order: any) => {
    return order.orderDetails?.reduce(
      (total: number, detail: any) => total + detail.quantity, 0
    )
  }

  console.log(orderDetails);

  return (
    <div
      style={{
        color: colorTextBase,
        backgroundColor: colorInfoText,
        fontSize: 14,
        display: "flex",
        gap: "1rem",
        padding: "8px 16px",
        alignItems: "center",
        borderRadius: "15px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column" as "column",
          flex: 1,
        }}
      >
        <p style={{ ...style.tableText, color: colorTextQuaternary }}>Placed</p>
        <p
          style={{
            margin: 0,
            paddingTop: "4px",
            paddingBottom: "2px",
            fontWeight: 600,
          }}
        >
          {timeFunction(orderDetails.date)}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column" as "column",
          flex: 1,
        }}
      >
        <p style={{ ...style.tableText, color: colorTextQuaternary }}>Name</p>
        <p
          style={{
            margin: 0,
            paddingTop: "4px",
            paddingBottom: "2px",
            fontWeight: 600,
          }}
        >
          {orderDetails.customer.name}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column" as "column",
          flex: 1,
        }}
      >
        <p style={{ ...style.tableText, color: colorTextQuaternary }}>Order</p>
        <p
          style={{
            margin: 0,
            paddingTop: "4px",
            paddingBottom: "2px",
            fontWeight: 600,
          }}
        >
          #{orderDetails.order_no}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          paddingRight: "1rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <div
            style={{
              backgroundColor: orderStatusColor,
              width: "0.438rem",
              height: "0.438rem",
              borderRadius: "50%",
            }}
          />
        </div>
        <p style={{ ...style.tableText, color: colorTextQuaternary }}>Items</p>
        <p
          style={{
            margin: 0,
            paddingTop: "4px",
            paddingBottom: "2px",
            fontWeight: 600,
          }}
        >
          {totalItems(orderDetails)}
        </p>
      </div>
    </div>
  );
}

export default ViewOrderMiddle;
