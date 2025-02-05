import React from "react";
import { Skeleton } from "antd";

interface OrderItemProps {
  height?: number;
  width?: number;
}

const SkeletonTextMenuUpdateItem = ({ height, width }: OrderItemProps) => {
  return (
    <Skeleton.Button
      active={true}
      style={{ width: width, height: height, marginBottom: 0 }}
    />
  );
};

export default SkeletonTextMenuUpdateItem;
