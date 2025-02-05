import React from "react";
import { Skeleton } from "antd";

const SkeletonDropdownMenu = () => {
  return (
    <div style={{ width: 140 }}>
      <Skeleton.Button active block={true} />
    </div>
  );
};

export default SkeletonDropdownMenu;
