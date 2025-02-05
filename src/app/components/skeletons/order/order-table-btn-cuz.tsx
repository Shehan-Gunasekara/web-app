import React from "react";
import { Skeleton } from "antd";

interface SkeletonButtonProps {
  height?: number;
  width?: number;
}

const SkeletonTableBtnCuztomizable = ({
  height,
  width,
}: SkeletonButtonProps) => {
  return (
    <Skeleton.Button
      active={true}
      style={{ width: width, height: height, borderRadius: 15 }}
    />
  );
};

export default SkeletonTableBtnCuztomizable;
