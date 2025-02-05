import React from "react";
import { Skeleton } from "antd";
import style from "@/styles/components/skeletons/order-header";

const SkeletonOrderStatus = () => {
  return <Skeleton.Button active={true} style={style.orderStatus} />;
};

export default SkeletonOrderStatus;
