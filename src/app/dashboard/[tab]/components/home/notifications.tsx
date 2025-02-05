import { Col, theme } from "antd";
import style from "@/styles/home/home";
import Feed from "./Feed";
import MenuManagement from "./NewOrders";

interface NotificationProps {
  menuData: any;
}

function Notification({ menuData }: NotificationProps) {
  const {
    token: { colorTextBase },
  } = theme.useToken();

  const feedbackData = {
    count: 3,
    title: "Awesome Service!",
    message:
      "Lono VM's mobile-friendly design means managers can keep tabs on their business from anywhere, at any time.",
    author: "Jhon Grayce",
    stars: 5,
  };

  return (
    <Col xs={24} sm={24} md={24} lg={6} style={style.generalContainer}>
      <div
        style={{
          color: colorTextBase,
          ...style.rowThreeHeading,
        }}
      >
        Notification
      </div>

      <div style={{ marginTop: 20 }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          width: "246px",
          height: "162px",
          borderRadius: "20px",
          backgroundColor: "#2f3135",
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            width: "100%",
            textAlign: "right",
            paddingTop: "10px",
            paddingRight: "160px",
          }}
        >
          New Orders
        </div>
        {menuData.map((item: any, index: any) => (
          <MenuManagement key={index} data={item} />
        ))}
      </div>

      <div style={{ marginTop: 20 }} />
      <div>
        <Feed feedback={feedbackData} />
      </div>
    </Col>
  );
}

export default Notification;
