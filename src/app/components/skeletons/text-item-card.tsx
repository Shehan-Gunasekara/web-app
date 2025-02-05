import React from "react";
import { Skeleton } from "antd";

interface OrderItemProps {
  height?: number;
  width?: number;
}

const SkeletonTextOrderCard = ({ height, width }: OrderItemProps) => {
  return (
    <Skeleton.Button active={true} style={{ width: width, height: height }} />
  );
};

export default SkeletonTextOrderCard;
