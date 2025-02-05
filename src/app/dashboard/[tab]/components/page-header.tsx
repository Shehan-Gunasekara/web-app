"use client";

import { Layout, Typography, Breadcrumb, theme } from "antd";
// import { BellOutlined } from "@ant-design/icons";
import style from "@/styles/components/page-header";
import FormattedDateTime from "@/app/components/formatted-time";

const { Header } = Layout;
const { Title } = Typography;

function PageHeader({ tab }: { tab: string }) {
  const {
    token: { colorBgBase, colorTextBase },
  } = theme.useToken();

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const capitalizedTab =
    tab === "profile" ? "Profile Settings" : capitalizeFirstLetter(tab);

  return (
    <Header style={{ ...style.headerContainer, backgroundColor: colorBgBase }}>
      <Breadcrumb
        items={[
          {
            title: (
              <Title level={3} style={{ color: colorTextBase }}>
                {capitalizedTab}
              </Title>
            ),
          },
        ]}
      />

      <div style={{ color: colorTextBase }}>
        <FormattedDateTime />
        {/* <span style={{ ...style.notificationSpan }}>
          <BellOutlined style={{ ...style.notificationIcon }} />
          <div
            style={{
              ...style.notificationIndicator,
              backgroundColor: colorError,
            }}
          />
        </span> */}
      </div>
    </Header>
  );
}

export default PageHeader;
