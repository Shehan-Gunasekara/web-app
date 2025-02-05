import React from "react";

import style from "@/styles/handwaves/handwave-raw-item";
import { RequestList } from "@/utils/interfaces";
import { theme } from "antd";

function HandwaveRawItem({ rawData }: { rawData: RequestList }) {
  const {
    token: { colorInfoText, purple6, colorTextBase },
  } = theme.useToken();

  const formatTime = (inputDate: string | number | Date) => {
    const date = new Date(inputDate);

    // Get hours and minutes
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();

    // Convert hours and minutes to two-digit format
    let formattedHours = String(hours).padStart(2, "0");
    let formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}m`;
  };

  return (
    <div
      style={{
        color: colorTextBase,
        backgroundColor: colorInfoText,
        ...style.container,
      }}
    >
      <div>
        <span
          style={{
            color: purple6,
            ...style.customerNameStyles,
          }}
        >
          {rawData.customer_name}
        </span>
      </div>
      <div
        style={{
          ...style.bodyContainer,
        }}
      >
        <span
          style={{
            ...style.messageStyles,
          }}
        >
          {rawData.message}
        </span>
        <span
          style={{
            ...style.messageTimeStyles,
          }}
        >
          {formatTime(rawData.created_at)}
        </span>
      </div>
    </div>
  );
}

export default HandwaveRawItem;
