"use client";
import { Button, Col, Layout, theme } from "antd";
import { FaExclamationTriangle } from "react-icons/fa";
import React, { useState } from "react";
import style from "@/styles/error/not-found";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const {
    token: {
      colorBgBase,
      colorTextBase,
      colorTextDisabled,
      colorBgContainerDisabled,
    },
  } = theme.useToken();

  const [isLoading, setIsLoading] = useState(false);

  const refreshBtnClicked = () => {
    setIsLoading(true);
    reset();
  };

  return (
    <Layout style={{ backgroundColor: colorBgBase, ...style.container }}>
      <Col>
        <div style={style.rightContent}>
          <div style={style.columnCenter}>
            <p
              style={{
                color: colorTextBase,
                ...style.heading,
              }}
            >
              Something went wrong!
            </p>

            <div>
              <FaExclamationTriangle
                size={200}
                style={{ color: colorBgContainerDisabled, marginBottom: 40 }}
              />
            </div>

            <p
              style={{
                color: colorTextBase,
                ...style.text,
              }}
            >
              Error while loading the content.
              <br /> Would you like to retry?
            </p>

            <Button
              style={{
                background: isLoading ? colorTextDisabled : colorTextBase,
                color: colorBgBase,
                ...style.button,
              }}
              onClick={refreshBtnClicked}
              disabled={isLoading}
              name="retry-button"
            >
              {isLoading ? "Retrying..." : "Retry"}
            </Button>
          </div>
        </div>
      </Col>
    </Layout>
  );
}
