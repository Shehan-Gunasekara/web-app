import { CSSProperties } from "react";
const style: { [key: string]: CSSProperties } = {
  modal: {
    minWidth: "28rem",
    minHeight: "32rem",
  },
  modalDiv: {
    maxWidth: "28rem",
    minHeight: "32rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  resetDiv: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    justifyContent: "center",
    flex: 1,
  },
  resetText: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
    margin: "0 8rem",
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
    fontSize: 18,
    fontWeight: 700,
    margin: "0 40px",
  },
  form: {
    width: "24rem",
  },
  formTitle: {
    textAlign: "center",
  },
  otpMessage: {
    padding: "0 2rem",
  },
  otpItem: {
    margin: "0.5rem 2rem",
  },
  otpInput: {
    border: "none",
    height: "2.5rem",
    margin: 0,
  },
  newPasswordItem: {
    margin: "0.5rem 2rem",
  },
  newPasswordInput: {
    border: "none",
    height: "2.5rem",
    margin: 0,
  },
  confirmPasswordItem: {
    margin: "0.5rem 2rem 1rem 2rem",
  },
  confirmPasswordInput: {
    border: "none",
    height: "2.5rem",
    margin: 0,
  },
  buttonDiv: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1.5rem",
  },
  button: {
    width: "8rem",
    height: "2.8rem",
  },
};

export default style;
