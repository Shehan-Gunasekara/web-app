import React from "react";
import { Skeleton } from "antd";

function TableCardSkeleton() {
  return <Skeleton.Button active={true} style={{ width: 132, height: 132 }} />;
}

export default TableCardSkeleton;
