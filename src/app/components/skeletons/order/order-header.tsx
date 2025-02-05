import React, { useEffect, useState } from "react";
import { Col, Layout, Row, Skeleton, Space, theme } from "antd";
import styles from "@/styles/orders/order-header";
import style from "@/styles/components/skeletons/order-header-latest";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { useWindowWidth } from "@react-hook/window-size/throttled";

const SkeletonOrderHeader = () => {
  const {
    token: { colorBgBase, colorBgContainer },
  } = theme.useToken();

  const { lg, xl } = useBreakpoint();
  const deviceWidth = useWindowWidth();

  const [isLargerScreen, setisLargerScreen] = useState(false);

  const headerBtnSkeleton = (count: number) => {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      skeletons.push(
        <Skeleton.Button
          active={true}
          style={{
            minWidth: xl ? "90px" : lg ? "70px" : "65px",
            ...style.headerBtn,
          }}
          key={i}
        />
      );
    }
    return skeletons;
  };

  useEffect(() => {
    if (deviceWidth >= 890) {
      setisLargerScreen(true);
    } else if (deviceWidth < 890) {
      setisLargerScreen(false);
    }
  }, [deviceWidth]);

  return (
    <Layout
      style={{ background: colorBgBase, padding: "1rem 1rem", marginBottom: 0 }}
    >
      <Row>
        {/* status */}
        <Col md={isLargerScreen ? 14 : 18} lg={14} xl={14}>
          <div
            style={{
              ...style.menuLeft,
            }}
          >
            <Space size={20}>
              <>{headerBtnSkeleton(5)}</>
            </Space>
          </div>
        </Col>

        {/* view */}
        <Col md={isLargerScreen ? 5 : 6} lg={5} xl={5}>
          <div
            style={{
              ...styles.menuHeaderLeftStatus,
            }}
          >
            <Space size={20}>
              <Skeleton.Button active={true} style={style.headerBtn} />
              <Skeleton.Button active={true} style={style.settingsContainer} />
            </Space>
          </div>
        </Col>

        {/* search */}
        <Col md={isLargerScreen ? 5 : 24} lg={5} xl={5}>
          <Row>
            <div
              style={{
                background: colorBgContainer,
                ...styles.menuHeaderRight,
              }}
            >
              <div style={styles.inputContainer}>
                <Skeleton.Input active={true} style={style.searchBar} />
              </div>
              {/* <div style={styles.inputContainer}>
                <Skeleton.Input active={true} style={style.searchBar} />
              </div> */}
            </div>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};

export default SkeletonOrderHeader;
