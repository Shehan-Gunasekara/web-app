// import style from "@/styles/orders/order-components";
// import { Button, theme } from "antd";
// import React from "react";

// interface OrderTableProps {
//   orderDetails: {
//     orderNo: string;
//     orderName: string;
//     orderId: number;
//     orderStatus: string;
//     orderDate: string;
//     orderTime: string;
//     orderTables: {
//       item: string;
//       quantity: number;
//       price: number;
//     }[];
//   };
//   action?: (table: any) => any;
// }
// function OrderTable({ orderDetails, action }: OrderTableProps) {
//   const {
//     orderNo,
//     orderName,
//     orderId,
//     orderStatus,
//     orderDate,
//     orderTime,
//     orderTables,
//   } = orderDetails;

//   const {
//     token: {
//       colorBgContainer,
//       colorTextBase,
//       colorText,
//       colorTextDescription,
//       colorFillContent,
//       colorFillSecondary,
//       colorFillAlter,
//     },
//   } = theme.useToken();
//   return (
//     <div
//       style={{
//         borderRadius: "15px",
//         background: colorBgContainer,
//         display: "flex",
//         flexDirection: "column" as "column",
//         gap: "1rem",
//         padding: "12px 9px",
//       }}
//     >
//       <div style={style.orderItemHeader}>
//         <div style={style.orderItemNo}>{orderNo}</div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             width: "100%",
//           }}
//         >
//           <div
//             style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}
//           >
//             <span
//               style={{ color: colorText, fontSize: "16px", fontWeight: "700" }}
//             >
//               {orderName}
//             </span>
//             <span
//               style={{
//                 color: colorTextDescription,
//                 fontSize: "16px",
//                 fontWeight: "700",
//               }}
//             >
//               Order #{orderId}
//             </span>
//           </div>
//           <div style={style.orderStatus}>{orderStatus}</div>
//         </div>
//       </div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           width: "100%",
//         }}
//       >
//         <span style={style.orderDate}>{orderDate} </span>
//         <span style={style.orderDate}>{orderTime}</span>
//       </div>
//       <div
//         style={{
//           height: "1px",
//           width: "100%",
//           backgroundColor: colorFillAlter,
//         }}
//       />
//       <div>
//         <table style={style.orderTable}>
//           <tbody style={{ width: "100%" }}>
//             <tr style={style.orderTableHeadingsRow}>
//               <th style={{ textAlign: "start", fontWeight: "400" }}>Table</th>
//               <th style={{ textAlign: "start", fontWeight: "400" }}>Qty</th>
//               <th style={{ textAlign: "right", fontWeight: "400" }}>Price</th>
//             </tr>
//             {orderTables.map((item, index) => (
//               <tr key={index} style={style.orderTableRow}>
//                 <td style={{ color: colorTextBase }}>{item.item}</td>
//                 <td style={{ color: colorTextBase }}>{item.quantity}</td>
//                 <td
//                   style={{
//                     textAlign: "right",
//                     direction: "rtl",
//                     color: colorTextBase,
//                   }}
//                 >
//                   {item.price.toFixed(2)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div
//         style={{
//           height: "1px",
//           width: "100%",
//           backgroundColor: colorFillAlter,
//         }}
//       />
//       <div style={style.orderBottomSection}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             width: "100%",
//           }}
//         >
//           <span
//             style={{
//               fontSize: "12px",
//               fontWeight: "700",
//               color: colorFillSecondary,
//             }}
//           >
//             Total
//           </span>
//           <span
//             style={{
//               fontSize: "12px",
//               fontWeight: "700",
//               color: colorFillSecondary,
//             }}
//           >
//             $92.42
//           </span>
//         </div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             width: "100%",
//           }}
//         >
//           <Button style={style.orderSeeDetailsBtn} onClick={action}>
//             See Deails
//           </Button>
//           <Button
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               borderRadius: "10px",
//               background: colorFillContent,
//               color: colorBgContainer,
//               fontSize: "12px",
//               width: "6.125rem",
//               fontWeight: "700",
//               outline: "none",
//             }}
//           >
//             Pay Bills
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrderTable;
