import React from "react";
import { theme } from "antd";
import SkeletonButtonCuztomizable from "../button-customize";
import SkeletonTableBtnCuztomizable from "./order-table-btn-cuz";

const SkeletonOrderTableModal = () => {
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
          margin: "30px 10px",
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
    <div style={{ height: "773px", width: "40rem" }}>
      {/* title row */}
      <div
        style={{
          display: "flex",
          margin: 10,
          justifyContent: "space-between",
        }}
      >
        <div>
          <SkeletonButtonCuztomizable height={10} width={150} />
        </div>
        <div
          style={{
            display: "flex",
            marginRight: 70,
          }}
        >
          <SkeletonButtonCuztomizable height={35} width={120} />
          <SkeletonButtonCuztomizable height={35} width={140} />
        </div>
      </div>

      {/* table row */}
      <div
        style={{
          display: "flex",
          margin: "60px 10px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SkeletonTableBtnCuztomizable height={80} width={80} />
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
      </div>

      {/* order row */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index}>{orderBtnSkeleton()}</div>
      ))}

      {/* last row */}
      <div
        style={{
          display: "flex",
          margin: "190px 10px 10px 10px",
          justifyContent: "space-between",
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
    </div>
  );
};

export default SkeletonOrderTableModal;
