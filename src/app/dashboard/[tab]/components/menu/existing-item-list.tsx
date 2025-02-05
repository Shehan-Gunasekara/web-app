import React, { useState } from "react";
import { useMenuContext } from "@/app/providers/MenuProvider";
import { Checkbox, Row, Flex, Button, theme, Col } from "antd";
import { useQuery } from "@apollo/client";
import style from "@/styles/menu/menu-modals";
import { GET_EXISTING_ITEM_OPTIONS } from "@/lib/queries/items";
import "@/styles/menu/custom/CustomCheckbox.css";
import ExistingItemsSkeleton from "@/app/components/skeletons/menu/item-existing-items";
import ExistingItemsBtnSkeleton from "@/app/components/skeletons/menu/item-existing-itemsBtn";
import { ItemOptionList } from "@/utils/interfaces";
import { modifierOptions } from "@/constants/lonovm-constants";

function ExistingItemList({ itemId }: { itemId?: number }) {
  console.log("itemId", itemId);
  const {
    token: {
      colorBgContainer,
      colorBgContainerDisabled,
      colorFillSecondary,
      colorTextLightSolid,
      colorTextBase,
      cyan8,
    },
  } = theme.useToken();

  const {
    updateCurrentStep,
    itemOptionGroups,
    selectedItemOptionList,
    setSelectedItemOptionList,
  } = useMenuContext();

  const [selectedIds, setSelectedIds] = useState<number[]>(
    selectedItemOptionList
      ? selectedItemOptionList.map((item: any) => item.id)
      : []
  );

  let restaurant_id: number | null = null;
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("lono_restaurant_id");
    if (storedId) {
      restaurant_id = parseInt(storedId, 10);
    }
  }

  const { data, loading } = useQuery<any>(GET_EXISTING_ITEM_OPTIONS, {
    variables: { restaurant_id: restaurant_id },
    fetchPolicy: "network-only",
  });

  const itemOptionsData = data && data.getItemOptionByRestaurantId;

  const addData = () => {
    const itemOptionsObj =
      itemOptionsData &&
      itemOptionsData.reduce((acc: any, item: any) => {
        const matchingItem = itemOptionGroups.find(
          (option: any) => option.type === item.type
        );
        acc[item.id] = {
          ...item,
          label: matchingItem.label,
          description: matchingItem.description,
        };
        return acc;
      }, {});

    const selectedElements = selectedIds.map((value) => itemOptionsObj[value]);
    setSelectedItemOptionList((prevList: any) => {
      const updatedList = [...prevList];

      selectedElements.forEach((item: any) => {
        const existingItemIndex = updatedList.findIndex(
          (selectedItem) => selectedItem.id === item.id
        );

        if (existingItemIndex !== -1) {
          item["index_no"] = updatedList.length;
          updatedList[existingItemIndex] = item;
        } else {
          item["index_no"] = updatedList.length;
          updatedList.push(item);
        }
      });

      return updatedList;
    });
    updateCurrentStep(false);
  };

  const onChange = (checkedValues: any) => {
    setSelectedIds(checkedValues);
  };

  const existingItemSkeleton = (count: number) => {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      skeletons.push(<ExistingItemsSkeleton key={i} />);
    }
    return skeletons;
  };

  if (loading) {
    return (
      <div>
        <div
          style={{
            width: "430px",
            height: "542px",
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {existingItemSkeleton(5)}
        </div>
        <ExistingItemsBtnSkeleton />
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "2rem",
        ...style.menuExistingOptionModals,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          width: "430px",
          marginLeft: "-9px",
          height: "34rem",
          overflowY: "scroll",
        }}
      >
        <Checkbox.Group
          style={{ display: "flex", flexDirection: "column" }}
          value={selectedIds}
          onChange={onChange}
        >
          {itemOptionsData && itemOptionsData.length > 0 ? (
            itemOptionsData.map((item: ItemOptionList) => {
              //most price you can shave off using this option
              const maxSubtraction = Math.min(
                0,
                item.choices
                  .filter((choice) => parseInt(choice.price) < 0)
                  .sort((a, b) => parseInt(a.price) - parseInt(b.price))
                  .slice(0, item.choice_limit)
                  .reduce((sum, choice) => sum + parseInt(choice.price), 0)
              );
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "0.3rem 0",
                    height: "78px",
                  }}
                  key={item.id}
                >
                  <Col flex="none">
                    <Checkbox
                      className="custom-checkbox"
                      style={{
                        color: "black",
                        fontSize: 50,
                        marginLeft: "-7px",
                      }}
                      value={item.id}
                    />
                  </Col>
                  <Col flex="auto">
                    <Flex
                      style={{
                        padding: "1rem",
                        borderRadius: "10px",
                        backgroundColor: cyan8,
                      }}
                      justify="space-between"
                    >
                      <Flex vertical={true} gap={4} align={"start"}>
                        <span style={style.updateLabel}>{item.title}</span>
                        <span style={{ color: colorTextBase, fontSize: 14 }}>
                          {item.type === modifierOptions.required.value
                            ? "Required "
                            : "Optional "}{" "}
                          &bull;&nbsp;
                          {item.choices?.length ?? 0} Options
                        </span>
                      </Flex>
                      <Flex
                        vertical={true}
                        gap={4}
                        align={"end"}
                        style={{ marginTop: "auto" }}
                      >
                        <span
                          style={{
                            ...style.updateLabelF,
                            color: colorTextBase,
                          }}
                        >
                          Choice Limit: {item.choice_limit}
                        </span>
                        {maxSubtraction !== 0 && (
                          <span
                            style={{
                              ...style.updateLabelF,
                              color: colorTextBase,
                            }}
                          >
                            Max Subtraction: ${maxSubtraction}
                          </span>
                        )}
                      </Flex>
                    </Flex>
                  </Col>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </Checkbox.Group>
      </div>
      <Row style={{ marginLeft: "-9px" }}>
        <Col sm={24} md={9}>
          <Button
            style={{
              backgroundColor: colorBgContainer,
              border: `2px solid ${colorBgContainerDisabled}`,
              ...style.cancelButton,
            }}
            onClick={() => updateCurrentStep(false)}
            name="back-btn"
          >
            Back
          </Button>
        </Col>
        <Col sm={24} md={13}>
          <Button
            style={{
              backgroundColor: colorFillSecondary,
              color: colorTextLightSolid,

              ...style.modalBtn,
            }}
            onClick={addData}
            name="add-btn"
          >
            Add
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ExistingItemList;
