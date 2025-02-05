import React from "react";
import { Skeleton } from "antd";

function ItemCardSkeleton() {
  return (
    <Skeleton.Button
      active
      style={{
        width: "280px",
        height: "340px",
        margin: "0.7rem",
        borderRadius: "10px",
      }}
    ></Skeleton.Button>
  );
}

export default ItemCardSkeleton;
