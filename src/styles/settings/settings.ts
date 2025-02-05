const style = {
  containerRow: {
    marginTop: 10,
  },
  containerRowTwo: {
    marginTop: 25,
  },
  topRow: {
    width: "100%",
    marginBottom: -10,
  },

  topRowTwo: {
    width: "100%",
    // marginTop: 30,
    marginBottom: -15,
  },

  insideRow: {
    width: "100%",
    marginTop: -10,
  },

  topRowText: {
    fontSize: 18,
    fontWeight: 700,
    height: 30,
  },

  smallText: {
    fontSize: 12,
    fontWeight: 400,
  },

  topRowButton: {
    fontSize: 14,
    fontWeight: 700,
    borderRadius: 15,
    width: 88,
    height: 30,
  },

  colInside: {
    width: "80%",
  },

  colInsideTax: {
    marginTop: 20,
    width: "80%",
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "flex-start",
  },

  select: {
    height: "2.4rem",
  },

  paragraphText: {
    marginTop: 40,
    fontSize: 12,
    fontWeight: 400,
  },

  buttons: {
    borderRadius: 10,
    width: "50%",
    maxWidth: 200,
    height: 55,
    fontSize: 16,
    fontWeight: 600,
  },

  topInput: {
    width: "5.5rem",
    height: "2.5rem",
  },
  switchStyle: {
    position: "relative",
    "& .ant-switch-inner::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      right: "4px", // Adjust this value for positioning
      transform: "translate(-50%, -50%)",
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      backgroundColor: "#fff", // Change this to the color you want
      boxShadow: "0 0 1px rgba(0, 0, 0, 0.25)",
      transition: "background-color 0.3s, box-shadow 0.3s",
    },
  },
  orderSettingFontHead: {
    fontSize: "20px",
    display: "inline",
    margin: "0 7px 5px 0",
  },
  orderSettingFontHeadActive: {
    fontSize: "20px",
    display: "inline",
    margin: "0 7px 5px 0",
    fontWeight: 700,
    color: "#7ADCAD",
  },

  orderSettingFontHeadInactive: {
    fontSize: "20px",
    display: "inline",
    margin: "0 7px 5px 0",
    fontWeight: 700,
  },
  orderSettingFontContent: {
    fontSize: "14px",
    color: "#CCCCCC",
  },
};
export default style;
