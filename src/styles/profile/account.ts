import { CSSProperties } from "react";
const style: { [key: string]: CSSProperties } = {
  baseContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "1rem 1.5rem",
    borderRadius: "1rem",
    width: "100%",
    height: "90vh",
    overflowY: "scroll",
    overflowX: "hidden",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    margin: "1rem 0",
  },
  divider: {
    margin: 0,
    padding: 0,
  },
  nameItem: { margin: "2rem 0 1.5rem 0", flex: 3, width: "80%" },
  phoneNumItem: { margin: "2rem 0 1.5rem 0", flex: 2, width: "20%" },
  nameInput: {
    border: "none",
    height: "2.5rem",
    margin: 0,
    width: "100%",
  },
  phoneInput: {
    border: "none",
    height: "2.5rem",
    margin: 0,
    width: "100%",
  },
  countryDiv: { display: "flex", gap: "1rem", margin: "0rem 0 0.5rem 0" },
  countryItem: { flex: 1 },
  countryDropdown: { height: "2.5rem", borderRadius: 10 },
  addressItem: { flex: 3 },
  addressInput: {
    border: "none",
    height: "2.5rem",
    margin: 0,
  },
  stateDiv: { display: "flex", gap: "1rem", margin: "0.5rem 0" },
  stateItem: { flex: 1 },
  stateDropdown: { height: "2.5rem", borderRadius: 10 },
  taxItem: { flex: 3 },
  taxInput: {
    border: "none",
    height: "2.5rem",
    margin: 0,
  },
  loginTitle: { fontSize: 18, fontWeight: "bold", margin: "2.5rem 0 1rem 0" },
  loginDivider: { margin: 0, padding: 0 },
  emailDiv: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
    alignItems: "center",
  },
  emailItem: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  emailInput: {
    border: "none",
    height: "2.5rem",
    margin: 0,
  },
  emailEditIcon: {
    fontSize: 18,
    position: "absolute",
    right: 8,
  },
  emailVerifyDiv: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  emailVerifyIcon: { fontSize: 18 },
  passwordDiv: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  passwordItem: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    border: "none",
    height: "2.5rem",
    margin: 0,
  },
  passwordEditIcon: {
    fontSize: 18,
    position: "absolute",
    right: 8,
  },
  btnEditPwdDiv: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  btnEditPwd: {
    backgroundColor: "transparent",
    border: "1px solid #484848",
    fontSize: 14,
    height: "2.5rem",
  },
  btnSaveDiv: {
    marginTop: "1.5vh",
    display: "flex",
    justifyContent: "end",
    marginBottom: "2rem",
  },
  btnSave: {
    width: "20rem",
    height: "2.8rem",
    fontWeight: "bold",
  },
  modal: {
    minWidth: "32rem",
    minHeight: "32rem",
  },
};

export default style;
