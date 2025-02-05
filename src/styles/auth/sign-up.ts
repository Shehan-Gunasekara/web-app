import { CSSProperties } from "react";
const style: { [key: string]: CSSProperties } = {
  container: {
    // backgroundColor: "#202225",
    display: "flex",
    margin: "auto",
    minHeight: "100vh",
  },

  leftContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },

  otpResend: {
    marginLeft: "5px",
    marginRight: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "12px",
    marginTop: "10px",

    textAlign: "center" as "center",
  },

  middleContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    flexDirection: "column" as "column",
  },

  otpContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
    marginBottom: "40px",

    marginRight: "10px",
  },

  flexContainer: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
  },

  rightContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    minHeight: "100vh",
    flexDirection: "column" as "column",
  },

  verticalLine: {
    borderRight: "2px solid #484848",
    height: "16%",
  },
  initialeVerticalLine: {
    borderRight: "2px solid #484848",
    height: "3%",
  },

  verticalLineMiddle: {
    borderRight: "2px solid #484848",
    height: "40px",
  },

  verticalLineMiddleGreen: {
    borderRight: "2px solid #484848",
    height: "40px",
  },

  arrowIcon: {
    position: "absolute",
    alignItems: "center",
    color: "#ffffff",
    fontSize: "40px",
  },

  tickIcon: {
    position: "absolute",
    // color: "#68ffb7",
    fontSize: "45px",
  },

  attachIcon: {
    position: "absolute" as "absolute",
    top: "35%",
    right: "0.1%",
    padding: "25px",
    transform: "translateY(-50%)",
    borderRadius: "20px",
    // backgroundColor: "#3b7ff2",
  },

  checkIcon: {
    position: "absolute" as "absolute",
    display: "flex",
    alignItems: "center" as "center",
    // color: "#68ffb7",
    fontSize: "120px",
  },

  rowCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },

  otpTextContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  columnCenter: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column" as "column",
  },

  headingText: {
    // color: "#e7e7e7",
    fontSize: "2.178vw",
    fontWeight: 500,
    marginRight: "auto",
    marginLeft: "auto",
    lineHeight: 0.5,
    display: "flex",
    justifyContent: "center",
  },

  headingTextThin: {
    // color: "#e7e7e7",
    fontSize: "40px",
    fontWeight: 300,
    display: "flex",
    justifyContent: "center",
    textAlign: "center" as "center",
    marginTop: 1,
    marginBottom: 1,
  },

  eclipseContainer: {
    marginTop: "45px",
  },

  paragraphTexts: {
    // color: "#e7e7e7",
    fontSize: "14px",
    fontWeight: "300",
    marginTop: "15px",
    marginBottom: "30px",
    textAlign: "center" as "center",
    fontFamily: "Inter",
    width: "420px",
  },

  paragraphTextsFormFive: {
    // color: "#e7e7e7",
    fontWeight: 400,
    fontSize: "14px",
    marginTop: "30px",
    marginBottom: "25px",
    width: "52%",
    textAlign: "center" as "center",
  },

  policyText: {
    // color: "#e7e7e7",
    fontSize: "14px",
    fontWeight: "300",
    textAlign: "justify" as "justify",
    fontFamily: "Inter",
    marginBottom: "20px",
  },

  policyContainer: {
    width: "80%",
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "center",
    alignItems: "center",
  },

  paragraphTextsTwo: {
    color: "#e7e7e7",
    fontSize: "14px",
    fontWeight: "300",
    textAlign: "center" as "center",
    fontFamily: "Inter",
    width: "420px",
  },

  termsText: {
    // color: "white",
    fontSize: "14px",
    fontWeight: 300,
    marginBottom: "20px",
    marginLeft: "10px",
    fontFamily: "Inter",
  },

  inputField: {
    // backgroundColor: "#2f3135",
    // color: "#e7e7e7",
    fontSize: "14px",
    height: "50px",
    width: "100%",
    border: "transparent",
    marginBottom: "22px",
    borderRadius: "20px",
  },

  checkboxContainer: {
    // display: "flex",
    // flexDirection: "row" as "row",
    marginBottom: "3px",
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
    borderTop: "#5c5c5c 2px solid",
    width: "44%",
    marginRight: "10px",
  },

  horizontalOrLineRight: {
    borderTop: "#5c5c5c 2px solid",
    width: "44%",
    marginLeft: "10px",
  },

  inputsLarge: {
    marginTop: "18px",
  },

  inputContainer: {
    position: "relative" as "relative",
    width: "85%",
  },

  inputContainerTwo: {
    position: "relative" as "relative",
  },

  inputIcons: {
    position: "absolute" as "absolute",
    // color: "#ffffff",
    fontSize: "20px",
    // cursor: "pointer",
    top: "48%",
    right: "5%",
    transform: "translateY(-50%)",
  },

  fileInputIcon: {
    position: "absolute" as "absolute",
    // color: "#ffffff",
    fontSize: "20px",
    cursor: "pointer",
    top: "48%",
    right: "15%",
    transform: "translateY(-50%)",
    marginRight: "10px",
  },
  inputIconsClick: {
    position: "absolute" as "absolute",
    // color: "#ffffff",
    fontSize: "20px",
    cursor: "pointer",
    top: "48%",
    right: "5%",
    transform: "translateY(-50%)",
  },

  nextBtn: {
    height: "50px",
    width: "61%",
    fontWeight: "bold",
    fontSize: "16px",
    borderRadius: "20px",
    // backgroundColor: "#ffffff",
    // color: "#202225",
  },

  backBtn: {
    border: "#484848 2px solid",
    height: "50px",
    width: "32%",
    fontWeight: 700,
    fontSize: "16px",
    backgroundColor: "transparent",
    borderRadius: "20px",
    // color: "#484848",
  },

  loginBtn: {
    height: "50px",
    width: "330px",
    fontWeight: "bold",
    fontSize: "16px",
    marginTop: "10px",
    marginBottom: "20px",
    borderRadius: "20px",
    // backgroundColor: "#ffffff",
    // color: "#202225",
  },

  exclamationIcon: {
    // color: "#3b7ff2",
    fontSize: "16px",
    marginRight: "10px",
    marginBottom: "15px",
  },

  noteParagraph: {
    // color: " #8f8f8f",
    fontSize: "12px",
    marginTop: "10px",
    textAlign: "center" as "center",
  },

  btnContainer: {
    marginTop: "10px",
    width: "85%",
    textAlign: "center" as "center",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  btnContainerFour: {
    marginTop: "10px",
    marginBottom: "30px",
    width: "43%",
    textAlign: "center" as "center",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  secondaryTextsOne: {
    // color: "#e7e7e7",
    fontWeight: 300,
    fontSize: "14px",
    fontFamily: "Inter",
    textAlign: "center" as "center",
    lineHeight: 0.1,
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
  },

  secondaryTexts: {
    // color: "#e7e7e7",
    fontWeight: 300,
    fontSize: "14px",
    fontFamily: "Inter",
    textAlign: "center" as "center",
    lineHeight: 0.1,
    marginTop: "5px",
    marginBottom: "20px",
  },

  helpText: {
    marginLeft: "6px",
    color: "#6679d6",
    fontWeight: 500,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "Inter",
  },

  linkTextOne: {
    // color: "#6A83F4",
    fontWeight: 500,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "Inter",
    marginLeft: "5px",
    marginRight: "5px",
    lineHeight: 0.1,
    marginTop: "20px",
  },

  linkText: {
    // color: "#6A83F4",
    fontWeight: 500,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "Inter",
    marginLeft: "5px",
    marginRight: "5px",
    lineHeight: 0.1,
    marginTop: "5px",
    marginBottom: "20px",
  },

  verticleIcons: {
    position: "absolute" as "absolute",
    // color: "#484848",
    fontSize: 35,
  },

  circleIcon: {
    // position: "absolute" as "absolute",
    // color: "#484848",
    fontSize: 80,
  },
};

export default style;
