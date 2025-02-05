import React from "react";
import { Skeleton } from "antd";

interface SkeletonButtonProps {
  height?: number;
  width?: number;
}

const SkeletonButtonCuztomizable = ({ height, width }: SkeletonButtonProps) => {
  return (
    <Skeleton.Button active={true} style={{ width: width, height: height }} />
  );
};

export default SkeletonButtonCuztomizable;
