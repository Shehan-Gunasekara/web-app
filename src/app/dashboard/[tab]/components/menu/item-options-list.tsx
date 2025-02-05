import React, { useState } from "react";
import { Flex, Button, Row, Col, theme } from "antd";
import style from "@/styles/menu/menu-modals";
import { useMenuContext } from "@/app/providers/MenuProvider";
import { ItemOptionList } from "@/utils/interfaces";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ItemOptionListItem from "./item-option-list-item";
import { BsExclamationCircle } from "react-icons/bs";

function ItemOptionsList() {
  const {
    token: {
      colorBgContainerDisabled,
      colorFillSecondary,
      colorTextLightSolid,
      colorBgContainer,
      colorTextDisabled,
      colorTextHeading,
      cyan4,
      geekblue7,
    },
  } = theme.useToken();

  const {
    updateCurrentStep,
    selectedItemOptionList,
    setSelectedItemOptionList,
    itemOptionGroups,
    setIsExistingItem,
  } = useMenuContext();

  const sortedSelectedOptions =
    selectedItemOptionList &&
    selectedItemOptionList.sort((a: any, b: any) => a.index_no - b.index_no);

  /*
  const handleMenuClick: MenuProps["onClick"] = (e: any) => {
    if (e.key === "new") {
      setIsExistingItem(false);
      updateCurrentStep(true);
      setIsUpdatingItemOption(false);
    } else if (e.key === "existing") {
      setIsExistingItem(true);
      updateCurrentStep(true);
    }
  };
  const items: MenuProps["items"] = [
    {
      label: (
        <div
          style={{
            color: colorTextLightSolid,
            textAlign: "center",
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          New Modifier
        </div>
      ),
      key: "new",
    },
    {
      label: (
        <div
          style={{
            color: colorTextLightSolid,
            textAlign: "center",
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          Existing Modifier
        </div>
      ),
      key: "existing",
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const menuStyle: React.CSSProperties = {
    borderRadius: "0.5rem",
    height: 100,
    backgroundColor: colorFillSecondary,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "8px",
  };*/

  // const handleUpdateClick = (type: any) => {
  //   updateCurrentStep(true, type);
  // };

  const handleDeleteClick = (id: any) => {
    setSelectedItemOptionList((prevList: any) =>
      prevList.filter((item: any) => item.id !== id)
    );
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id === over.id) return;

    setSelectedItemOptionList((prevList: any) => {
      const oldIndex = prevList.findIndex(
        (item: ItemOptionList) => item.id === active.id
      );
      const newIndex = prevList.findIndex(
        (item: ItemOptionList) => item.id === over.id
      );
      const newList = arrayMove(prevList, oldIndex, newIndex);

      newList.forEach((item: any, index) => {
        item.index_no = index;
      });

      return newList;
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ ...style.menuModals }}>
      <Flex
        vertical={true}
        gap={8}
        style={{ marginTop: "1rem", ...style.menuModals }}
      >
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          {sortedSelectedOptions && sortedSelectedOptions.length > 0 ? (
            <SortableContext
              items={sortedSelectedOptions}
              strategy={verticalListSortingStrategy}
            >
              {sortedSelectedOptions.map((item: ItemOptionList) => (
                <ItemOptionListItem
                  item={item}
                  handleDeleteClick={handleDeleteClick}
                  key={item.id}
                />
              ))}
            </SortableContext>
          ) : (
            <div>
              <div
                style={{
                  margin: "10px 0px 40px -34.5px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    color: cyan4,
                    fontSize: "16px",
                    fontWeight: 300,
                    lineHeight: "24px",
                  }}
                >
                  {"Currently, there are no Modifiers added to the term."}
                </span>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    lineHeight: "24px",
                    color: colorTextHeading,
                  }}
                >
                  {"Please start with adding a Modifier."}
                </div>
              </div>

              <div style={{ color: geekblue7, marginTop: "10px" }}>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    lineHeight: "20px",
                  }}
                >
                  {"Modifier Choices"}
                </span>
                {itemOptionGroups &&
                  itemOptionGroups.length > 0 &&
                  itemOptionGroups.map((item: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        lineHeight: "20px",
                        margin: "15px 0",
                        width: "401px",
                      }}
                    >
                      <span>
                        <b>
                          {item.label}
                          {": "}
                        </b>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 400,
                            lineHeight: "20px",
                          }}
                        >
                          {item.text}
                        </span>
                      </span>
                    </div>
                  ))}
                <div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      lineHeight: "20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "405px",
                    }}
                  >
                    <p>
                      <BsExclamationCircle
                        style={{
                          marginRight: "2px",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      />{" "}
                      WARNING - Negative price options can allow the item price
                      to be reduced below 0. To prevent this, make sure that the
                      sum of all the options&apos; Max Subtraction values allow
                      for a subtraction smaller than the base price.
                    </p>
                  </span>
                </div>
              </div>
            </div>
          )}
        </DndContext>
      </Flex>
      <Row style={{ marginTop: "73px", marginLeft: "-8px" }}>
        <Col sm={24} md={9}>
          <Button
            style={{
              backgroundColor: colorBgContainer,
              border: `2px solid ${colorBgContainerDisabled}`,
              ...style.cancelButton,
            }}
            onClick={() => updateCurrentStep(false)}
          >
            Back
          </Button>
        </Col>
        <Col
          sm={24}
          md={14}
          onMouseLeave={() => setIsHovered(false)}
          onMouseEnter={() => setIsHovered(true)}
        >
          {/*<Dropdown
            menu={menuProps}
            placement="top"
            dropdownRender={(menu) => (
              <div
                style={{
                  color: "black",
                }}
              >
                {React.cloneElement(menu as React.ReactElement, {
                  style: menuStyle,
                })}
              </div>
            )}
          >*/}
          <Button
            style={
              isHovered
                ? {
                    backgroundColor: colorTextDisabled,
                    color: colorTextLightSolid,
                    ...style.modalBtn,
                    transition: "background-color 0.3s, color 0.3s",
                  }
                : {
                    backgroundColor: colorFillSecondary,
                    color: colorTextLightSolid,
                    ...style.modalBtn,
                    transition: "background-color 0.3s, color 0.3s",
                  }
            }
            onMouseEnter={() => setIsHovered(true)}
            onClick={() => {
              setIsExistingItem(false);
              updateCurrentStep(true);
            }}
            name="add-item"
          >
            Add
          </Button>
          {/*</Dropdown>*/}
        </Col>
      </Row>
    </div>
  );
}

export default ItemOptionsList;
