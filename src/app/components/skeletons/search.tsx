import React from "react";
import { Flex, Skeleton } from "antd";
import style from "@/styles/components/skeletons/order-header";

const SkeletonSearch = () => {
  return (
    <Flex>
      <Skeleton.Input active={true} style={style.searchBar} />
    </Flex>
  );
};

export default SkeletonSearch;
