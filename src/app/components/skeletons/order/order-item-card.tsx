import React from "react";
import { Flex, theme } from "antd";
import style from "@/styles/components/skeletons/order-header";
import SkeletonTableNumber from "../table-number";
import SkeletonTextOrderCard from "../text-item-card";
import SkeletonOrderStatus from "./order-status";
import SkeletonButtonCuztomizable from "../button-customize";

function OrderItemSkeleton() {
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
        height: "100%",
        width: "32%",
        marginLeft: "1rem",
      }}
    >
      <Flex vertical={true} gap={"1rem"}>
        <div style={style.orderItemHeader}>
          {/* tablle no */}
          <SkeletonTableNumber />

          {/* order name */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            <SkeletonTextOrderCard height={20} width={30} />
            <SkeletonTextOrderCard height={20} width={30} />
          </div>

          {/* order status */}
          <SkeletonOrderStatus />
        </div>

        <br />

        {/* order items heading */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <SkeletonTextOrderCard height={10} width={15} />
          <div style={{ marginLeft: 50 }}>
            <SkeletonTextOrderCard height={10} width={15} />
          </div>
          <SkeletonTextOrderCard height={10} width={15} />
        </div>

        {/* order items */}
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <SkeletonTextOrderCard height={10} width={15} />
            <div style={{ marginLeft: 50 }}>
              <SkeletonTextOrderCard height={10} width={15} />
            </div>
            <SkeletonTextOrderCard height={10} width={15} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <SkeletonTextOrderCard height={10} width={15} />
            <div style={{ marginLeft: 50 }}>
              <SkeletonTextOrderCard height={10} width={15} />
            </div>
            <SkeletonTextOrderCard height={10} width={15} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <SkeletonTextOrderCard height={10} width={15} />
            <div style={{ marginLeft: 50 }}>
              <SkeletonTextOrderCard height={10} width={15} />
            </div>
            <SkeletonTextOrderCard height={10} width={15} />
          </div>
        </>

        <br />

        {/* empty space */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 150,
          }}
        />
        {/* order total */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <SkeletonTextOrderCard height={10} width={15} />
          <SkeletonTextOrderCard height={10} width={15} />
        </div>

        {/* order action row */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <SkeletonButtonCuztomizable height={20} width={20} />
          <SkeletonButtonCuztomizable height={20} width={50} />
        </div>
      </Flex>
    </Flex>
  );
}

export default OrderItemSkeleton;
