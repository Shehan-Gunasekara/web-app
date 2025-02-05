"use client";
import { Button, Col, Layout, theme } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import style from "@/styles/error/not-found";
import Lottie from "lottie-react";
import animationData from "../../public/assets/404-animation.json";

function NotFound() {
  const {
    token: {
      colorBgBase,
      colorTextSecondary,
      colorTextBase,
      colorTextDisabled,
    },
  } = theme.useToken();

  const [isLoading, setIsLoading] = useState(false);

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
              Page Not Found
            </p>

            <div style={{ width: 500 }}>
              <Lottie
                animationData={animationData}
                className="flex justify-center items-center"
                loop={true}
              />
            </div>

            <p
              style={{
                color: colorTextSecondary,
                ...style.text,
              }}
            >
              Requested page not found.
              <br /> Would you like to return to dashboard?
            </p>

            <Link href={"/dashboard/orders"}>
              <Button
                style={{
                  background: isLoading ? colorTextDisabled : colorTextBase,
                  color: colorBgBase,
                  ...style.button,
                }}
                onClick={() => {
                  setIsLoading(true);
                }}
                disabled={isLoading}
                name="go-to-dashboard-btn"
              >
                {isLoading ? "Please wait..." : "Go to Dashboard"}
              </Button>
            </Link>
          </div>
        </div>
      </Col>
    </Layout>
  );
}

export default NotFound;
