import React from "react";
import { Skeleton } from "antd";
import style from "@/styles/components/skeletons/header-time";

const SkeletonHeaderTime: any = () => {
  return (
    <>
      <Skeleton.Button active={true} style={style.timeContainer} />

      <span style={{ ...style.dateSpan }}>
        <Skeleton.Button active={true} style={style.dateContainer} />
      </span>
    </>
  );
};

export default SkeletonHeaderTime;
