import React from "react";
import { Skeleton } from "antd";

const MenuSearchSkeleton = () => {
  return (
    <Skeleton.Input
      active={true}
      style={{ width: "fit-content", margin: "0 0.5rem", borderRadius: "10px" }}
    />
  );
};

export default MenuSearchSkeleton;
