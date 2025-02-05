import { CSSProperties } from "react";
const style: { [key: string]: CSSProperties } = {
  mainDiv: {
    maxWidth: "32rem",
    minHeight: "32rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: 700,
    margin: "1rem 6rem",
    textAlign: "center",
  },
  resetDiv: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    justifyContent: "center",
    flex: 1,
  },
  resetText: {
    fontSize: 14,
    fontWeight: 500,
    textAlign: "center",
    margin: "0 4rem",
  },
  resetCheckmark: {
    margin: "1rem",
  },
  resetDividerDiv: {
    marginTop: "4rem",
    marginBottom: "1rem",
  },
  resetDivider: {
    margin: "0 50px",
    padding: 0,
  },
  resetInfoText: {
    margin: "4rem 2rem",

    padding: "1rem",
    borderRadius: "1rem",
  },
  resetInfoSpan: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: "left",
  },
  form: {
    width: "24rem",
  },
  passwordItem: {
    margin: "2rem 0 1rem 0",
  },
  passwordInput: {
    border: "none",
    height: "2.5rem",
    margin: 0,
  },
  forgotLabel: {
    fontSize: 16,
    cursor: "pointer",
    marginBottom: "0.5rem",
  },
  forgetText: {
    borderRadius: "1rem",
    padding: "0.5rem 1.5rem",
    marginBottom: "1rem",
  },
};

export default style;
