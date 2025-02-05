import React from "react";
import { Layout, theme } from "antd";

const { Content } = Layout;

function AccountingPage() {
  const {
    token: { colorBgBase },
  } = theme.useToken();
  return (
    <Content style={{ background: colorBgBase }}>
      <div>AccountingPage</div>
    </Content>
  );
}

export default AccountingPage;
