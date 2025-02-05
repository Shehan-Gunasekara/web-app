// import React from "react";
// import { Line } from "@ant-design/charts";
// import { useThemeContext } from "../../../../providers/ThemeProvider"; // Import the useThemeContext

// interface LineChartProps {
//   chartData: any;
// }

// function LineChart({ chartData }: LineChartProps) {
//   const { isDarkMode } = useThemeContext();

//   const config = {
//     data: chartData,
//     xField: "month",
//     yField: "value",
//     label: {},
//     point: {
//       size: 5,
//       shape: "diamond",
//       style: {
//         fill: "white",
//         stroke: isDarkMode ? "#000000" : "#2593fc", // Use isDarkMode to conditionally set the stroke color
//         lineWidth: 2,
//       },
//     },
//     tooltip: { showMarkers: false },
//     state: {
//       active: {
//         style: {
//           shadowColor: "yellow",
//           shadowBlur: 4,
//           stroke: "transparent",
//           fill: "red",
//         },
//       },
//     },
//     theme: {
//       geometries: {
//         point: {
//           diamond: {
//             active: {
//               style: {
//                 shadowColor: "#FCEBB9",
//                 shadowBlur: 2,
//                 stroke: "#F6BD16",
//               },
//             },
//           },
//         },
//       },
//     },
//     interactions: [{ type: "marker-active" }],
//   };

//   return (
//     <div style={{ height: "200px", color: isDarkMode ? "#FFFFFF" : "#000000" }}>
//       {" "}
//       {/* Adjust this value to change the chart height */}
//       <Line {...config} />
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           fontSize: "16px",
//         }}
//       >
//         <span>
//           1 <br></br>Jan
//         </span>
//         <hr
//           style={{
//             borderTop: "1px solid",
//             width: "85%",
//             height: "1px",
//             backgroundColor: isDarkMode ? "#FFFFFF" : "#000000",
//           }}
//         />{" "}
//         {/* Adjusted height and background color */}
//         <span>
//           31<br></br> Jan
//         </span>
//       </div>
//     </div>
//   );
// }

// export default LineChart;
