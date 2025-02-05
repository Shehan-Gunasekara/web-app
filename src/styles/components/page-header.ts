import { CSSProperties } from "react";
const style: { [key: string]: CSSProperties } = {
  headerContainer: {
    padding: "0 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "10vh",
  },
  dateSpan: { marginLeft: "1rem", marginRight: "1rem" },
  notificationSpan: { position: "relative", margin: "0 1.5rem" },
  notificationIcon: { fontSize: "1rem" },
  notificationIndicator: {
    position: "absolute",
    top: "0px",
    right: "-3px",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
};

export default style;
