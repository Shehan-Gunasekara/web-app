import React from "react";
import SkeletonButtonCuztomizable from "../button-customize";
import SkeletonTableBtnCuztomizable from "./order-table-btn-cuz";
import { theme } from "antd";

const SkeletonIndividualOrderRow = () => {
  const {
    token: { colorTextDisabled },
  } = theme.useToken();

  const tableHeaderRowSkeleton = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SkeletonTableBtnCuztomizable height={10} width={80} />
        <SkeletonButtonCuztomizable height={20} width={80} />
      </div>
    );
  };

  const orderBtnSkeleton = () => {
    return (
      <div
        style={{
          display: "flex",
          marginTop: "16px",
          justifyContent: "space-between",
          alignItems: "center",
          border: `1px solid ${colorTextDisabled}`,
          borderRadius: 15,
          padding: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 25,
          }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>{tableHeaderRowSkeleton()}</div>
          ))}
        </div>
        <SkeletonTableBtnCuztomizable height={20} width={80} />
      </div>
    );
  };

  return (
    <>
      {/* order row */}
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index}>{orderBtnSkeleton()}</div>
      ))}
    </>
  );
};

export default SkeletonIndividualOrderRow;
