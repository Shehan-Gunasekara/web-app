import React from "react";
import { Flex, theme } from "antd";
import style from "@/styles/menu/menu-modals";
import SkeletonButtonCuztomizable from "../button-customize";

function ExistingItemsSkeleton() {
  const {
    token: { cyan8 },
  } = theme.useToken();
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "right",
          width: "400px",
          height: "fit-content",
          backgroundColor: cyan8,
          borderRadius: 15,
          marginLeft: "12px",
        }}
      >
        <div
          style={{
            padding: "2rem 1.5rem 1rem 1.5rem",
            borderRadius: 15,
            height: 40,
            width: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Flex vertical={true} gap={4} align={"start"}>
            <span style={style.updateLabel}>
              <SkeletonButtonCuztomizable height={10} width={10} />
            </span>
            <span style={{ fontSize: 14 }}>
              <SkeletonButtonCuztomizable height={10} width={10} />
            </span>
          </Flex>
          <Flex
            vertical={true}
            gap={4}
            align={"end"}
            style={{ marginTop: "auto" }}
          >
            <span style={{ ...style.updateLabelF }}>
              <SkeletonButtonCuztomizable height={10} width={10} />
            </span>
          </Flex>
        </div>
      </div>
    </>
  );
}

export default ExistingItemsSkeleton;
