"use client";
import { useState } from "react";
import { theme } from "antd";
import { FaTimes } from "react-icons/fa";

function MobileNotice() {
  const {
    token: { colorBgBase, colorBgContainer, colorTextBase, purple1 },
  } = theme.useToken();
  const [isMobile, setIsMobile] = useState(true);

  const handleClose = () => {
    setIsMobile(false);
  };

  return (
    <div style={{ backgroundColor: colorBgBase, minHeight: "100%" }}>
      {isMobile && (
        <div
          style={{
            margin: "1rem",
            padding: "1rem 1rem 0.5rem 1rem",
            background: colorBgContainer,
            color: colorTextBase,
            border: `1px solid ${purple1}`,
            borderRadius: "0.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Notice:</strong>
            <FaTimes onClick={handleClose} style={{ cursor: "pointer" }} />
          </div>
          <p>
            Currently, our application does not support mobile devices/small
            screen sizes. We apologize for any inconvenience and appreciate your
            understanding.
          </p>
        </div>
      )}
    </div>
  );
}

export default MobileNotice;
