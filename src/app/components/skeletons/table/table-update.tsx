import React from "react";
import { Row, Skeleton } from "antd";
import style from "@/styles/components/skeletons/menu";
import SkeletonTextMenuUpdateItem from "../menu/item-text";

function TableUpdateSkeleton() {
  return (
    <>
      <Row>
        <Skeleton.Button
          active
          style={{ margin: 10, height: 180, width: 180, borderRadius: 15 }}
        />
        <div style={style.btnContainer}>
          <SkeletonTextMenuUpdateItem height={8} width={30} />
          <Skeleton.Button
            active
            style={{ marginTop: -6, height: 25, width: 90, borderRadius: 40 }}
          />

          <Skeleton.Button
            active
            style={{ height: 8, width: 30, marginTop: 20 }}
          />
          <Skeleton.Button
            active
            style={{ marginTop: 10, height: 25, width: 180 }}
          />

          <Skeleton.Button
            active
            style={{ height: 8, width: 30, marginTop: 20 }}
          />
          <Skeleton.Button
            active
            style={{ marginTop: 10, height: 25, width: 180 }}
          />
        </div>
      </Row>

      <Skeleton.Button
        active
        style={{ height: 8, width: 30, marginTop: 20, marginLeft: 10 }}
      />

      <Row>
        <Skeleton.Button
          active
          style={{
            margin: 10,

            height: 160,
            width: 160,
            borderRadius: 15,
          }}
        />
        <div style={style.btnContainer}>
          <Skeleton.Button
            active
            style={{ marginTop: 10, height: 25, width: 200 }}
          />
          <Skeleton.Button
            active
            style={{ marginTop: 10, height: 25, width: 200 }}
          />
        </div>
      </Row>

      <div style={style.ColContainerBtn}>
        <Skeleton.Button
          active
          style={{ marginTop: 10, height: 40, width: 410 }}
        />
      </div>
    </>
  );
}

export default TableUpdateSkeleton;
