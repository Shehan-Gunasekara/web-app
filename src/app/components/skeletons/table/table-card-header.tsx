import React from "react";
import { Skeleton } from "antd";

function TableCardHeaderSkeleton() {
  return (
    <Skeleton.Button
      active
      style={{
        minWidth: "90px",
        minHeight: "50px",
        position: "relative",
      }}
    ></Skeleton.Button>
  );
}

export default TableCardHeaderSkeleton;
