import React from "react";
import SkeletonButtonCuztomizable from "../button-customize";
import SkeletonTableBtnCuztomizable from "./order-table-btn-cuz";

const SkeletonIndividualLastRow = () => {
  const lastRowSkeleton = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
          }}
        >
          <SkeletonButtonCuztomizable height={10} width={80} />
          <SkeletonButtonCuztomizable height={10} width={80} />
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        margin: "70px 10px 10px 0px",
        justifyContent: "space-between",
        width: "640px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SkeletonTableBtnCuztomizable height={10} width={80} />
        <SkeletonButtonCuztomizable height={20} width={80} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>{lastRowSkeleton()}</div>
        ))}
      </div>
      <SkeletonButtonCuztomizable height={50} width={170} />
    </div>
  );
};

export default SkeletonIndividualLastRow;
