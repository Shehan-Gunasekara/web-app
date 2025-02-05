import { theme } from "antd";
import React, { useState, useEffect } from "react";

const Loader = () => {
  const {
    token: { colorTextBase, colorTextDisabled },
  } = theme.useToken();

  const [activeSquare, setActiveSquare] = useState<number>(1); // Specify the type explicitly

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSquare((prevSquare: number) => {
        // Cycle through squares 1, 2, 4, 3
        if (prevSquare === 1) return 2;
        if (prevSquare === 2) return 3;
        if (prevSquare === 3) return 4;
        if (prevSquare === 4) return 1;
        return 1; // Ensure a default return value to satisfy TypeScript
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ margin: 0, padding: 0 }}>
        <div
          style={{
            width: 10,
            height: 10,
            border: `3px solid ${
              activeSquare === 1 ? colorTextBase : colorTextDisabled
            }`,
            borderRadius: 2,
            // margin: 5,
            margin: "5px 0 5px 5px",
          }}
        ></div>
        <div
          style={{
            width: 10,
            height: 10,
            border: `3px solid ${
              activeSquare === 2 ? colorTextBase : colorTextDisabled
            }`,
            borderRadius: 2,
            // margin: 5,
            margin: "5px 0 5px 5px",
          }}
        ></div>
      </div>
      <div style={{ margin: 0, padding: 0 }}>
        <div
          style={{
            width: 10,
            height: 10,
            border: `3px solid ${
              activeSquare === 4 ? colorTextBase : colorTextDisabled
            }`,
            borderRadius: 2,
            margin: 5,
          }}
        ></div>
        <div
          style={{
            width: 10,
            height: 10,
            border: `3px solid ${
              activeSquare === 3 ? colorTextBase : colorTextDisabled
            }`,
            borderRadius: 2,
            margin: 5,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;
