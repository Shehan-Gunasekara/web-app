import { CSSProperties } from "react";
const style: { [key: string]: CSSProperties } = {
  topRowTileOne: {
    width: "100px",
    height: "96px",
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "center",
    alignItems: "Center",

    borderRadius: "15px",
  },
  topRowTile: {
    width: 70,
    height: 70,
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "center",
    // marginLeft: "auto",
    // marginRight: "auto",
    paddingTop: "1rem",
    paddingLeft: "0.6rem",
    paddingRight: "0.6rem",
    borderRadius: "18%",
  },
  topStatusRowTile: {
    width: 80,
    height: 70,
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "center",
    // marginLeft: "auto",
    // marginRight: "auto",
    paddingTop: "1rem",
    paddingLeft: "0.6rem",
    paddingRight: "0.6rem",
    borderRadius: "18%",
  },
  topRowTileTime: {
    width: 70,
    height: 70,
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    paddingTop: "1rem",
    // paddingLeft: "0.3rem",
    paddingRight: "0.6rem",
    borderRadius: "18%",
  },
  textTwo: {
    // marginTop: 20,
    fontSize: "20px",
    fontWeight: "600",
  },
  textTableNo2: {
    fontSize: 30,
    fontWeight: 700,
  },
  textTableNo: {
    fontSize: 16,
    fontWeight: 400,
    marginTop: 3.5,
  },
  textOne: {
    // position: "absolute" as "absolute",
    // marginTop: 0,
    fontSize: 14,
    width: "fit-content",
  },
  textOneLastRow: {
    // position: "absolute" as "absolute",
    // marginTop: 0,
    fontSize: 14,
    width: 100,
  },
  secondRow: {
    width: "90%",
    height: 70,
    display: "flex",
    justifyContent: "center",
    borderRadius: "18%",
  },
  rowStyle: {
    display: "flex",
    marginBottom: 0,
    width: "653px",
  },
  rowStyleLast: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  rowTwoStyle: {
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    height: "91px",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: "24.5px",
    paddingRight: "21.5px",
    borderRadius: "15px",
  },
  secondRowTile: {
    display: "flex",
    flexDirection: "column" as "column",
    margin: "0rem",
    // margin: "0.5rem",
    // width: "fit-content",
    // justifyContent: "space-between",
    // gap: "0.2rem",
    // width: "fit-content",
    // height: 25,
    // alignItems: "left",
    // margin: "0.5rem",
    // marginLeft: "auto",
    // marginRight: "auto",
  },
  thirdRowTile: {
    width: "fit-content",
    height: 55,
    display: "flex",
    justifyContent: "center",
    alignItems: "left",
    margin: "1rem",
  },
  textTwoRow: {
    // marginTop: 25,
    fontSize: 16,
    fontWeight: "bold",
    width: "fit-content",
    height: "fit-content",
  },
  textTwoRowMiddle: {
    // marginTop: 25,
    fontSize: 18,
    fontWeight: "bold",
    height: "fit-content",
  },
  textTwoThree: {
    // marginTop: 25,
    fontSize: 16,
    fontWeight: 300,
    width: "fit-content",
    height: "fit-content",
  },

  textBottomRow: {
    fontSize: 14,
    fontWeight: 400,
  },
  textTwoRowStatus: {
    // marginTop: 25,
    // fontSize: 14,
    fontWeight: "bold",
    width: 60,
    textAlign: "center" as "center",
    height: "fit-content",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    borderRadius: "10px",
  },
  textTwoRowStatusMiddle: {
    // marginTop: 25,
    // fontSize: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 700,
    width: 86,
    textAlign: "center" as "center",
    height: "29px",
    padding: "0.2rem 0.5rem",
    borderRadius: "15px",
    fontSize: 13,
  },
  btnClose: {
    marginTop: 17,
    fontSize: 16,
    fontWeight: "bold",
    width: "fit-content",
    height: "fit-content",
    background: "transparent",
    borderRadius: "10px",
  },
  btnCloseTable: {
    fontSize: 16,
    fontWeight: "bold",
    width: 251,
    height: 54,
    borderRadius: "10px",
  },
  paragraph: {
    textAlign: "center" as "center",
    fontStyle: "italic",
    marginTop: 0,
    marginBottom: 10,
  },
  orderTabs: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center" as "center",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
  },
  orderIndividual: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    width: "90px",
    height: "30px",
    textAlign: "center" as "center",
    fontWeight: 700,
    position: "relative" as "relative",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    fontSize: "14px",
  },

  ////////////////////////
  //   container: {
  //     borderRadius: "15px",
  //     background: "#FFF",
  //     display: "flex",
  //     flexDirection: "column" as "column",
  //     gap: "1rem",
  //     padding: "12px 9px",
  //   },
  //   orderItemHeader: {
  //     display: "flex",
  //     flexDirection: "row" as "row",
  //     gap: "1rem",
  //     alignItems: "center",
  //   },
  //   orderItemNo: {
  //     color: "#FFF",
  //     fontSize: "1.125rem",
  //     minWidth: "3.938rem",
  //     height: "3.938rem",
  //     display: "flex",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     fontWeight: "400",
  //     borderRadius: "15px",
  //     backgroundColor: "#277D54",
  //   },
  //   orderItemName: {
  //     color: "#000",
  //     fontSize: "16px",
  //     fontWeight: "700",
  //   },
  //   orderNo: {
  //     color: "#464646",
  //     fontSize: "12px",
  //     fontWeight: "400",
  //     flex: "none",
  //   },
  //   orderStatus: {
  //     display: "flex",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     width: "5.5rem",
  //     height: "1.5rem",
  //     borderRadius: "10px",
  //     backgroundColor: "#FAD194",
  //     fontSize: "12px",
  //     fontWeight: "400",
  //   },
  //   orderDate: {
  //     color: "#737373",
  //     fontSize: "14px",
  //     fontWeight: "400",
  //   },
  //   hrLine: {
  //     height: "1px",
  //     width: "100%",
  //     backgroundColor: "rgba(215, 215, 215, 1)",
  //   },
  //   orderTable: {
  //     height: "100%",
  //     width: "100%",
  //     borderSpacing: "10px",
  //   },
  //   orderTableHeadingsRow: {
  //     color: "#737373",
  //     fontSize: "12px",
  //     fontWeight: "400",
  //     marginTop: "0.5rem",
  //     marginBottom: "0.5rem",
  //   },
  //   orderTableRow: {
  //     color: "#1A1A1A",
  //     fontSize: "12px",
  //     fontWeight: "400",
  //     marginTop: "0.5rem",
  //     marginBottom: "0.5rem",
  //   },
  //   orderTableHeading: {
  //     textlign: "start",
  //     fontWeight: "400",
  //   },
  //   orderBottomSection: {
  //     display: "flex",
  //     flexDirection: "column" as "column",
  //     gap: "1rem",
  //   },
  //   orderItemBody: {
  //     display: "flex",
  //     flexDirection: "row" as "row",
  //     gap: "1rem",
  //   },
  //   orderTotalText: {
  //     fontSize: "12px",
  //     fontWeight: "700",
  //   },
  //   orderSeeDetailsBtn: {
  //     display: "flex",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     borderRadius: "10px",
  //     background: "#E4EFFF",
  //     outline: "none",
  //     color: "#2F2F2F",
  //     fontSize: "12px",
  //     fontWeight: "400",
  //     width: "6.125rem",
  //   },
  //   orderPayBillsBtn: {
  //     display: "flex",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     borderRadius: "10px",
  //     background: "#000",
  //     color: "#FFF",
  //     fontSize: "12px",
  //     fontWeight: "700",
  //   },
};
export default style;
