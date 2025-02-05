import React from "react";
import { Col, Layout, Row, Skeleton, Space, theme } from "antd";
import styles from "@/styles/orders/order-header";
import style from "@/styles/components/skeletons/order-header-latest";

const SkeletonHandWaveHeader = () => {
  const {
    token: { colorBgBase },
  } = theme.useToken();

  const headerBtnSkeleton = (count: number) => {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      skeletons.push(
        <Skeleton.Button
          active={true}
          style={{
            minWidth: "120px",
            ...style.headerBtn,
          }}
          key={i}
        />
      );
    }
    return skeletons;
  };

  return (
    <Layout
      style={{ background: colorBgBase, padding: "1rem 1rem", marginBottom: 0 }}
    >
      <Row>
        {/* status */}
        <Col md={14} lg={14} xl={14}>
          <div
            style={{
              ...style.menuLeft,
            }}
          >
            <Space size={30}>
              <>{headerBtnSkeleton(3)}</>
            </Space>
          </div>
        </Col>

        {/* view */}
        <Col md={9} lg={9} xl={9}></Col>

        {/* search */}
        <Col md={1} lg={1} xl={1}>
          <div
            style={{
              ...styles.menuHeaderLeftStatus,
            }}
          >
            <Space size={20}>
              <Skeleton.Button active={true} style={style.settingsContainer} />
            </Space>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default SkeletonHandWaveHeader;
