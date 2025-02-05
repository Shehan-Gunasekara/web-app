import React from "react";
import { Skeleton } from "antd";

function MenuCardSkeleton() {
  return (
    <Skeleton.Button
      active
      style={{
        margin: "0.7rem",
        borderRadius: "10px",
        width: "170px",
        height: "121px",
        position: "relative",
      }}
    ></Skeleton.Button>
  );
}

export default MenuCardSkeleton;
