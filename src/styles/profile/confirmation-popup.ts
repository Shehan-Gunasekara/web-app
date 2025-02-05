import { CSSProperties } from "react";
const style: { [key: string]: CSSProperties } = {
  mainDiv: {
    maxWidth: "32rem",
    minHeight: "20rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 2rem 0rem 2rem",
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: 700,
    margin: "1rem 6rem",
    textAlign: "center",
  },
  contentText: {
    fontSize: "14px",
    fontWeight: 400,
    margin: "1rem 1rem 4rem 1rem",
    textAlign: "center",
  },
};

export default style;
