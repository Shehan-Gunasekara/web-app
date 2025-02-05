import { CSSProperties } from "react";
const style: { [key: string]: CSSProperties } = {
  baseContainer: {
    display: "flex",
    margin: "0.5rem 1.5rem 0 1.5rem",
    gap: "1.5rem",
  },
  logoContainer: {
    width: "20vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  logoInnerContainer: {
    padding: "1rem",
    borderRadius: "1rem",
    width: "100%",
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: "1rem 0",
  },
  logoDivider: { margin: "0.5rem 1rem" },
  logoDividerMargin: {
    margin: 0,
    padding: 0,
  },
  logoImage: { objectFit: "cover", margin: "1.5rem 0" },
  logoUpdateButton: {
    backgroundColor: "transparent",
    border: "1px solid #484848",
    fontSize: 14,
    height: "3rem",
    margin: "1rem 0",
  },
};

export default style;
