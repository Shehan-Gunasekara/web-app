import React, { useEffect, useState } from "react";
import { Col, Row, theme } from "antd";
import HandwaveRequestSkeleton from "./handwave-card";
import SkeletonHandWaveHeader from "./handwave-header";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { useWindowWidth } from "@react-hook/window-size/throttled";

const SkeletonHandwave = () => {
  const {
    token: {},
  } = theme.useToken();

  const [ordersPerPage, setOrdersPerPage] = useState(6);
  // const { lg } = useBreakpoint();
  const { sidebarCollapsed } = useThemeContext();
  const deviceWidth = useWindowWidth();

  useEffect(() => {
    if (!sidebarCollapsed && deviceWidth < 825) {
      setOrdersPerPage(1);
    } else if (deviceWidth < 825 && sidebarCollapsed) {
      setOrdersPerPage(2);
    } else if (deviceWidth <= 1050) {
      setOrdersPerPage(2);
    } else if (deviceWidth < 1200 && !sidebarCollapsed) {
      setOrdersPerPage(2);
    } else {
      setOrdersPerPage(3);
    }
  }, [deviceWidth, sidebarCollapsed]);

  const itemCardSkeleton = (count: number) => {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      skeletons.push(
        <Col
          xs={12}
          sm={12}
          md={!sidebarCollapsed && deviceWidth < 825 ? 24 : 12}
          lg={!sidebarCollapsed ? 12 : deviceWidth < 1050 ? 12 : 8}
          xl={8}
          key={i}
        >
          <HandwaveRequestSkeleton />
        </Col>
      );
    }
    return skeletons;
  };

  return (
    <div style={{ height: "90vh", overflowY: "scroll", overflowX: "hidden" }}>
      <SkeletonHandWaveHeader />

      <div style={{ padding: "1rem" }}>
        <Row gutter={[16, 16]}>
          <>{itemCardSkeleton(ordersPerPage)}</>
        </Row>
      </div>
    </div>
  );
};

export default SkeletonHandwave;
