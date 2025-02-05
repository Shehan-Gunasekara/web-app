import React from "react";
import { Skeleton } from "antd";

interface SkeletonButtonProps {
  height?: number;
  width?: any;
}

const SkeletonButtonCuztomizable = ({ height, width }: SkeletonButtonProps) => {
  return (
    <Skeleton.Button
      active={true}
      style={{
        width: width ? width : "100%",
        marginTop: "-5rem",
        height: height,
      }}
    />
  );
};

export default SkeletonButtonCuztomizable;
