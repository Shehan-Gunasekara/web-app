import React from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { Typography, theme } from "antd";

const { Text } = Typography;

interface LoadingErrorHandlerProps {
  handleRetryClick: () => any;
  text: string;
}

function LoadingErrorHandler({
  handleRetryClick,
  text,
}: LoadingErrorHandlerProps) {
  const {
    token: { colorTextBase, geekblue7, colorBgContainer },
  } = theme.useToken();

  return (
    <div
      style={{
        backgroundColor: colorBgContainer,
        color: geekblue7,
        borderRadius: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        gap: 10,
        fontSize: 14,
        padding: "15px 0",
        marginBottom: 20,
      }}
    >
      <FaCircleExclamation
        style={{
          fontSize: 20,
        }}
      />
      {`Error while loading ${text}.`}
      <Text
        onClick={handleRetryClick}
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          color: colorTextBase,
          fontSize: 14,
        }}
      >
        {" "}
        Click here to retry.
      </Text>
    </div>
  );
}

export default LoadingErrorHandler;
