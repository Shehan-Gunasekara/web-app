import React from "react";
import ItemUpdateImageSkeleton from "./item-update-image";
import SkeletonButtonCuztomizable from "./button-update";
import { Row } from "antd";
import style from "@/styles/components/skeletons/menu";
import SkeletonTextMenuUpdateItem from "./item-text";

function ItemUpdateSkeleton() {
  return (
    <div style={{ marginLeft: "-8px", height: "646px", marginTop: "13px" }}>
      <Row>
        <ItemUpdateImageSkeleton />
        <div style={{ ...style.updateItemBtnContainer }}>
          <SkeletonTextMenuUpdateItem height={17} width={32} />
          <SkeletonButtonCuztomizable height={35} width={150} />

          <SkeletonTextMenuUpdateItem height={17} width={53} />
          <SkeletonButtonCuztomizable height={35} width={150} />

          <SkeletonTextMenuUpdateItem height={17} width={65} />
          <SkeletonButtonCuztomizable height={25} width={80} />
        </div>
      </Row>
      <Row>
        <div style={style.updateItemColContainerOne}>
          <SkeletonTextMenuUpdateItem height={17} width={69} />
          <SkeletonButtonCuztomizable height={42} width={302} />
        </div>
        <div style={style.updateItemColContainerOneB}>
          <SkeletonTextMenuUpdateItem height={17} width={35} />
          <SkeletonButtonCuztomizable height={42} width={104} />
        </div>
      </Row>
      <Row>
        <div style={style.updateItemColContainerTwo}>
          <SkeletonTextMenuUpdateItem height={17} width={77} />
          <SkeletonButtonCuztomizable height={131} width={415} />
        </div>
      </Row>
      <Row>
        <div style={style.updateItemColContainerThree}>
          <SkeletonTextMenuUpdateItem height={17} width={78} />

          <SkeletonButtonCuztomizable height={34} width={226} />
        </div>
        <div style={style.updateItemColContainerThreeB}>
          <SkeletonTextMenuUpdateItem height={17} width={148} />
          <SkeletonButtonCuztomizable height={41} width={156} />
        </div>
      </Row>
      <Row>
        <div style={style.ColContainerThree}>
          <div style={style.rowOne}>
            <SkeletonButtonCuztomizable height={41} width={41} />
            <SkeletonButtonCuztomizable height={41} width={41} />
            <SkeletonButtonCuztomizable height={41} width={41} />
          </div>
        </div>
      </Row>

      <div style={style.updateItemColContainerBtn}>
        <SkeletonButtonCuztomizable height={50} width={161} />
        <SkeletonButtonCuztomizable height={50} width={243} />
      </div>
    </div>
  );
}

export default ItemUpdateSkeleton;
