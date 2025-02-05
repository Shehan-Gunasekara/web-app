import React from "react";
import { Skeleton } from "antd";

function ItemUpdateImageSkeleton() {
  return (
    <Skeleton.Image
      active
      style={{
        width: "260px",
        height: "180px",
        marginLeft: "-12px",
        marginTop: "0px",
      }}
    ></Skeleton.Image>
  );
}

export default ItemUpdateImageSkeleton;
