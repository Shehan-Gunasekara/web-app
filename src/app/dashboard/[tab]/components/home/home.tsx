import React from "react";
import { Layout, Divider, theme, Row } from "antd";
import WelcomeHeader from "./welcome-header";
import style from "@/styles/home/home";
import OverviewRow from "./overview-row";
import OverviewGeneral from "./overview-general";
import Notification from "./notifications";

const { Content } = Layout;

function HomePage() {
  const {
    token: { colorBgBase, colorBgContainerDisabled },
  } = theme.useToken();

  const overviewData = [
    { icon: "order", status: "new", text: "New orders", number: 34 },
    { icon: "order", status: "occupied", text: "Active orders", number: 45 },
    { icon: "table", text: "Tables unoccupied", number: 20 },
    { icon: "table", text: "Tables available", number: 25 },
  ];

  const generalData = [
    { icon: "order", status: "new", text: "Total Orders", number: 3567 },
    {
      icon: "order",
      status: "occupied",
      text: "Average time delivered",
      number: 18,
    },
    { icon: "table", text: "Average tables active", number: 24 },
    { icon: "table", text: "Inactive tables", number: 32 },
  ];

  const chartData = [
    { month: "1", value: 1 },
    { month: "2", value: 1.3 },
    { month: "3", value: 2 },
    { month: "4", value: 1 },
    { month: "5", value: 1.3 },
    { month: "6", value: 2.5 },
    { month: "7", value: 1.2 },
    { month: "8", value: 1.3 },
    { month: "9", value: 1.1 },
    { month: "10", value: 1.5 },
    { month: "11", value: 1.2 },
  ];

  const menuData = [
    {
      tableNumber: "04",
      minutes: "2",
    },
    {
      tableNumber: "12",
      minutes: "4",
    },
    {
      tableNumber: "22",
      minutes: "6",
    },
    {
      tableNumber: "13",
      minutes: "6",
    },
  ];

  return (
    <Content
      style={{
        background: colorBgBase,
      }}
    >
      <div style={style.container}>
        <WelcomeHeader />
        <Divider
          style={{ borderTop: `1px solid ${colorBgContainerDisabled}` }}
        />
        <OverviewRow overviewData={overviewData} />
        <Divider
          style={{ borderTop: `1px solid ${colorBgContainerDisabled}` }}
        />
        <Row>
          <OverviewGeneral generalData={generalData} chartData={chartData} />
          <Notification menuData={menuData} />
        </Row>

        {/* <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div style={{ width: "30%", margin: "-60px 0px 0px 10px" }}>
          <DonutChart />
        </div> 
        </div> */}
      </div>
    </Content>
  );
}

export default HomePage;
