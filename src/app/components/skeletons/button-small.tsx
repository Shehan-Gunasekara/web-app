import React from "react";
import { Skeleton } from "antd";
import style from "@/styles/components/skeletons/order-header";

const SkeletonBtnSmall = () => {
  return <Skeleton.Button active={true} style={style.settingsContainer} />;
};

export default SkeletonBtnSmall;
