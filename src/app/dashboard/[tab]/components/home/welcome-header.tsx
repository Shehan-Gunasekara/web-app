import React from "react";
import { Row, Col, Button, theme } from "antd";
import Image from "next/image";
import style from "@/styles/home/header";
function WelcomeHeader() {
  const {
    token: { colorWhite, colorTextTertiary, colorTextHeading, purple2 },
  } = theme.useToken();
  return (
    <Row align="middle" justify="space-between" style={style.container}>
      <Col>
        <Image
          src="/assets/images/hello.png"
          alt="Hello Image"
          width={70}
          height={70}
        />
      </Col>
      <Col
        xs={10}
        sm={12}
        md={14}
        lg={16}
        xl={18}
        style={style.welcomeTextContainer}
      >
        <h2
          style={{
            color: colorTextHeading,
            ...style.welcomeText,
          }}
        >
          {'Welcome "Chef Restaurant"'}
        </h2>
        <p
          style={{
            color: colorTextTertiary,
            ...style.welcomeParagraph,
          }}
        >
          {"Lono VM is the all-in-one solution for restaurant success."}
        </p>
      </Col>
      <Col xs={12} sm={6} md={5} lg={4} xl={3} style={style.editBtnContainer}>
        <Button
          style={{ color: colorWhite, background: purple2, ...style.editBtn }}
        >
          edit profile
        </Button>
      </Col>
    </Row>
  );
}

export default WelcomeHeader;
