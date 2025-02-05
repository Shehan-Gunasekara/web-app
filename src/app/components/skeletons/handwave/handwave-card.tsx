import React from "react";
import { Flex, theme } from "antd";
import style from "@/styles/components/skeletons/order-header";
import SkeletonTextOrderCard from "./text-item-card";
import SkeletonOrderStatus from "./order-status";
import SkeletonButtonCuztomizable from "./button-customize";

function HandwaveRequestSkeleton() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Flex
      vertical={true}
      justify="space-between"
      align="stretch"
      style={{
        background: colorBgContainer,
        ...style.orderItemContainer,
        height: "250px",
        width: "100%",
        // marginLeft: "1rem",
      }}
    >
      <Flex vertical={true} gap={"1rem"} style={{ width: "100%" }}>
        <div style={style.orderItemHeader}>
          {/* order name */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem",
            }}
          >
            <SkeletonTextOrderCard height={25} width={30} />
            <SkeletonTextOrderCard height={10} width={120} />
          </div>

          {/* order status */}
          <SkeletonOrderStatus />
        </div>
      </Flex>{" "}
      <SkeletonButtonCuztomizable height={72} width={"100%"} />
    </Flex>
  );
}

export default HandwaveRequestSkeleton;
