import React from "react";
// import { useThemeContext } from "../providers/ThemeProvider";

function LoaderLite() {
  // const theme = useThemeContext();

  const loaderStyle: React.CSSProperties = {
    border: `6px solid rgb(214 219 223)`,
    borderTop: `6px solid rgb(136 136 136)`,
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    animation: "spin 1s linear infinite",
    margin: "auto",
  };

  const keyframesStyle = `
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

  return (
    <div className="flex justify-center">
      <style>{keyframesStyle}</style>
      <div className="loader " style={loaderStyle}></div>
    </div>
  );
}

export default LoaderLite;
