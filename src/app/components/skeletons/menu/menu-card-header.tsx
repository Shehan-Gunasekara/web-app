import React from "react";
import { Skeleton } from "antd";

function MenuCardHeaderSkeleton() {
  return (
    <Skeleton.Button
      active
      style={{
        margin: "0.5rem",
        minWidth: "100px",
        minHeight: "50px",
        position: "relative",
      }}
    ></Skeleton.Button>
  );
}

export default MenuCardHeaderSkeleton;
