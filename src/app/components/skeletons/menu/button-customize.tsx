import React from "react";
import { Skeleton } from "antd";

const SkeletonButtonSettings = () => {
  return (
    <div>
      <Skeleton.Button active block={true} />
    </div>
  );
};

export default SkeletonButtonSettings;
