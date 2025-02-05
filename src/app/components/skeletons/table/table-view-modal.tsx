import React from "react";
import { Skeleton, theme } from "antd";
import SkeletonButtonCuztomizable from "../button-customize";
import SkeletonTableBtnCuztomizable from "../order/order-table-btn-cuz";

const SkeletonTableViewModal = () => {
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
          margin: "10px 0px",
          alignItems: "center",
          border: `1px solid ${colorTextDisabled}`,
          borderRadius: 15,
          padding: "10px 20px",
          justifyContent: "space-between",
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>{tableHeaderRowSkeleton()}</div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ height: "36rem", width: "28rem" }}>
      {/* table row */}
      <div
        style={{
          display: "flex",
          margin: "10px 0",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SkeletonTableBtnCuztomizable height={80} width={80} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            margin: "0 90px 0 50px",
            width: "100%",
            gap: 25,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 80,
            }}
          >
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index}>{tableHeaderRowSkeleton()}</div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 25,
            }}
          >
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index}>{tableHeaderRowSkeleton()}</div>
            ))}
          </div>
        </div>
      </div>

      {/* order row */}
      <div style={{ margin: "20px 0px" }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index}>{orderBtnSkeleton()}</div>
        ))}
      </div>

      {/* last row */}
      <Skeleton.Button
        active={true}
        style={{ height: 40, width: 448, borderRadius: 10 }}
      />
    </div>
  );
};

export default SkeletonTableViewModal;
