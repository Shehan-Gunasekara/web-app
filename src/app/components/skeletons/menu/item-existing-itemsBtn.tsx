import React from "react";
import SkeletonButtonCuztomizable from "../button-customize";

function ExistingItemsBtnSkeleton() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        marginLeft: "auto",
        marginRight: "auto",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          marginTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ marginLeft: "-8px", marginRight: "11px" }}>
          <SkeletonButtonCuztomizable height={50} width={161} />
        </div>
        <div>
          <SkeletonButtonCuztomizable height={50} width={243} />
        </div>
      </div>
    </div>
  );
}

export default ExistingItemsBtnSkeleton;
