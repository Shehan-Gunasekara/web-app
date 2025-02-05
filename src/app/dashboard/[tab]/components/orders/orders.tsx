"use client";
import React from "react";
import { Layout, theme } from "antd";
import OrdersContent from "./orders-content";

const { Content } = Layout;

function OrdersPage() {
  const {
    token: { colorBgBase },
  } = theme.useToken();

  return (
    <Content style={{ background: colorBgBase }}>
      <OrdersContent />
    </Content>
  );
}

export default OrdersPage;
