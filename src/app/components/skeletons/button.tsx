import React from "react";
import { Skeleton } from "antd";
import style from "@/styles/components/skeletons/order-header";

const SkeletonButton = () => {
  return <Skeleton.Button active={true} style={style.headerBtn} />;
};

export default SkeletonButton;
