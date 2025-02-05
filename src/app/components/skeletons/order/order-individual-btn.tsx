import React from "react";
import SkeletonButtonCuztomizable from "../button-customize";

const SkeletonOrderIndividualBtn = () => {
  return (
    <div style={{ display: "flex", gap: 25, marginLeft: "10px" }}>
      <SkeletonButtonCuztomizable height={30} width={120} />
      <SkeletonButtonCuztomizable height={30} width={120} />
      <SkeletonButtonCuztomizable height={30} width={120} />
    </div>
  );
};

export default SkeletonOrderIndividualBtn;
