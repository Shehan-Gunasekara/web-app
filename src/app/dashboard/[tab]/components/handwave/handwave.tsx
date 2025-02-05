"use client";
import React from "react";
import { Layout, theme } from "antd";
import HandwaveContent from "./handwave-content";

const { Content } = Layout;

function HandwavePage() {
  const {
    token: { colorBgBase },
  } = theme.useToken();

  return (
    <Content style={{ background: colorBgBase }}>
      <HandwaveContent />
    </Content>
  );
}

export default HandwavePage;
