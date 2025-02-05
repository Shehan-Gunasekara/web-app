import React from "react";
import { Skeleton } from "antd";

interface SkeletonTableHeaderBtnProps {
  width: number;
}

const SkeletonTableHeaderBtn = ({ width }: SkeletonTableHeaderBtnProps) => {
  return (
    <div style={{ width: width }}>
      <Skeleton.Button active block={true} />
    </div>
  );
};

export default SkeletonTableHeaderBtn;
