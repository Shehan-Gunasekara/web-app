import React from "react";
import { theme } from "antd";

import { IoIosCheckmarkCircle } from "react-icons/io";
import style from "@/styles/profile/successPrompt";

function SuccessPrompt({ successType }: { successType: String }) {
  const {
    token: {
      colorBgContainer,
      geekblue6,

      colorTextDisabled,
    },
  } = theme.useToken();

  return (
    <div
      style={{
        ...style.mainDiv,
        background: colorBgContainer,
      }}
    >
      <div style={{ ...style.resetDiv }}>
        <p style={{ ...style.headerTitle }}>
          {successType} changed successfully
        </p>

        <div style={{ ...style.resetCheckmark }}>
          <IoIosCheckmarkCircle size={"33px"} />
        </div>

        <div
          style={{
            ...style.resetText,
            color: colorTextDisabled,
          }}
        >
          {`We are pleased to confirm that your request for an ${successType} update has been efficiently processed to completion`}
        </div>

        <div
          style={{ ...style.resetInfoText, border: `1px solid ${geekblue6}` }}
        >
          <span
            style={{
              ...style.resetInfoSpan,
            }}
          >
            <p style={{ margin: 0, padding: 0 }}>
              Please use the new {successType} to log back into your other
              active devices
            </p>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SuccessPrompt;
