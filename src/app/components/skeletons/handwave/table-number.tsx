import React from "react";
import { Skeleton } from "antd";
import style from "@/styles/components/skeletons/order-header";

const SkeletonTableNumber = () => {
  return <Skeleton.Button active={true} style={style.orderItemNo} />;
};

export default SkeletonTableNumber;
