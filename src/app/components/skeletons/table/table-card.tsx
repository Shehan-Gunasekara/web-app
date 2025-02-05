import React from "react";
import style from "@/styles/table/table-components";
import SkeletonTableHeaderBtn from "./table-btn-header";
import { Skeleton, theme } from "antd";

function TableCardSkeleton() {
  const {
    token: { colorBgContainerDisabled },
  } = theme.useToken();

  return (
    <div
      style={{
        backgroundColor: colorBgContainerDisabled,
        borderRadius: "10px",
        padding: "14px",
        minWidth: "132px",
        aspectRatio: "1 / 1",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <SkeletonTableHeaderBtn width={50} />
      </div>
      <div style={style.tableContent}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <Skeleton.Button active={true} style={{ width: 20, height: 60 }} />
          <Skeleton.Button active={true} style={{ width: 20, height: 60 }} />
        </div>
      </div>
    </div>
  );
}

export default TableCardSkeleton;
