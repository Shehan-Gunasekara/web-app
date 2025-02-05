import { CSSProperties } from "react";
const style: { [key: string]: CSSProperties } = {
  container: {
    // backgroundColor: "#202225",
    display: "flex",
    margin: "auto",
  },

  toaster: {
    font: "Inter",
    // background: colorPrimaryBg,
    // color: colorTextLightSolid,
    fontSize: 16,
  },

  leftContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },

  middleContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    flexDirection: "column" as "column",
  },

  rightContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    minHeight: "100vh",
    flexDirection: "column" as "column",
    width: "100%",
  },

  verticalLine: {
    borderRight: "2px solid #484848",
    height: "25%",
  },

  arrowIcon: {
    position: "absolute",
    alignItems: "center",
    // color: "#ffffff",
    fontSize: "40px",
  },

  rowCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  columnCenter: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column" as "column",
    width: "32rem",
  },

  rowJustify: {
    justifyContent: "space-between",
  },

  headingText: {
    // color: "#e7e7e7",
    fontSize: "2.178vw",
    fontWeight: 500,
    marginBottom: "1px",
    lineHeight: 0.1,
    marginLeft: "auto",
    marginRight: "auto",
  },

  headingTextThin: {
    // color: "#e7e7e7",
    fontSize: "40px",
    fontWeight: 300,
    lineHeight: 0.1,
    marginLeft: "12px",
    marginRight: "auto",
  },

  socialButton: {
    backgroundColor: "transparent",
    border: "#828697 1px solid",
    fontSize: "22px",
    height: "48px",
    width: "107px",
    // color: "#ffffff",
    marginTop: "20px",
    marginBottom: "20px",
  },

  inputField: {
    // backgroundColor: "#2f3135",
    // color: "#e7e7e7",
    fontSize: "14px",
    height: "50px",
    width: "100%",
    border: "transparent",
    marginBottom: "22px",
  },

  rightCol: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },

  horizontalOrLine: {
    marginBottom: "10px",
  },

  horizontalOrLineLeft: {
    borderTop: "#484848 2px solid",
    width: "44%",
    marginRight: "10px",
  },

  horizontalOrLineRight: {
    borderTop: "#484848 2px solid",
    width: "44%",
    marginLeft: "10px",
  },

  inputsLarge: {
    marginTop: "18px",
  },

  inputContainer: {
    position: "relative" as "relative",
  },

  inputIcons: {
    position: "absolute" as "absolute",
    // color: "#ffffff",
    fontSize: "20px",
    cursor: "pointer",
    top: "35%",
    right: "5%",
    transform: "translateY(-50%)",
  },

  inputIconsNonClick: {
    position: "absolute" as "absolute",
    // color: "#ffffff",
    fontSize: "20px",
    // cursor: "pointer",
    top: "35%",
    right: "5%",
    transform: "translateY(-50%)",
  },

  enterBtn: {
    height: "50px",
    width: "100%",
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "22px",
    borderRadius: "20px",
    // backgroundColor: "#ffffff",
    // color: "#202225",
  },

  secondaryTexts: {
    // color: "#e7e7e7",
    fontWeight: 400,
    fontSize: "14px",
    fontFamily: "Inter",
    textAlign: "center" as "center",
    marginTop: "50px",
  },

  passwordTexts: {
    // color: "#e7e7e7",
    fontWeight: 300,
    fontSize: "14px",
    fontFamily: "Inter",
    textAlign: "center" as "center",
  },

  linkText: {
    marginLeft: "6px",
    // color: "#6679d6",
    fontWeight: 500,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "Inter",
  },

  helpText: {
    marginLeft: "6px",
    // color: "#6679d6",
    fontWeight: 500,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "Inter",
  },
};

export default style;
