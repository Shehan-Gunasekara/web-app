import React from "react";
import { Skeleton } from "antd";

const SkeletonSelectSettings = () => {
  return (
    <Skeleton.Button active={true} style={{ width: "300px", height: "32px" }} />
  );
};

export default SkeletonSelectSettings;
