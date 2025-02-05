import React, { useEffect, useState } from "react";
import { Row, Col, theme } from "antd";
import AddComponent from "./add-component";
import ElementListItem from "./menu-list-item";
import ItemListItem from "./item-list-item";
import {
  DndContext,
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation } from "@apollo/client";
import { UPDATE_CATEGORY_ORDER, UPDATE_MENU_ORDER } from "@/lib/mutations/menu";
import { UPDATE_ITEM_ORDER } from "@/lib/mutations/item";
import MenuCardSkeleton from "@/app/components/skeletons/menu/menu-card";
import { useMenuContext } from "@/app/providers/MenuProvider";

function ListContent({
  itemType,
  itemList,
  addItemText,
  action,
  clickedComponent,
  modalVisibility,
  modalTitle,
  itemId,
}: {
  itemType: string;
  itemList: any[];
  addItemText: string;
  action: (clickedItem: string, itemId: number) => any;
  clickedComponent: string;
  modalVisibility: boolean;
  modalTitle?: string;
  itemId: number;
}) {
  const {
    token: { },
  } = theme.useToken();

  const [elements, setElements] = useState(itemList);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMenuFloatingPoint] = useMutation<any>(UPDATE_MENU_ORDER);
  const [updateCategoryFloatingPoint] = useMutation<any>(UPDATE_CATEGORY_ORDER);
  const [updateItemFloatingPoint] = useMutation<any>(UPDATE_ITEM_ORDER);

  const getElementPosition = (id: number) => {
    return elements.findIndex((item) => item.id === id);
  };

  const {
    updatedCategoryOrder,
    updatedItemOrder,
    updatingCategoryOrder,
    updatingItemOrder,
    isUpdatingCategoryOrder,
    isUpdatingItemOrder,
    selectedLabel,
  } = useMenuContext();

  const calculateItems = (parentArray: any[]) => {
    let count = 0;

    if (selectedLabel == "Archived") {
      parentArray.forEach((item) => {
        if (item.is_items_deleted || item.is_deleted) {
          count++;
        }
      });
    } else {
      parentArray.forEach((item) => {
        if (!item.is_deleted) {
          count++;
        }
      });
    }

    return count;
  };
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    const originalPosition = getElementPosition(active.id);
    const newPosition = getElementPosition(over.id);
    const activeId = active.id;
    let previousId = null;
    let nextId = null;
    if (originalPosition > newPosition) {
      nextId = elements[newPosition - 1] ? elements[newPosition - 1]?.id : null;
      previousId = elements[newPosition]?.id;
    } else {
      nextId = elements[newPosition]?.id;
      previousId = elements[newPosition + 1]
        ? elements[newPosition + 1]?.id
        : null;
    }

    if (itemType === "menu") {
      setIsUpdating(true);
      await updateMenuFloatingPoint({
        variables: {
          menuInput: {
            id: activeId,
            previous_id: previousId,
            next_id: nextId,
          },
        },
      }).then((_res: any) => {
        setIsUpdating(false);
      });
    } else if (itemType === "category") {
      updatingCategoryOrder(true);
      await updateCategoryFloatingPoint({
        variables: {
          menuInput: {
            id: activeId,
            previous_id: previousId,
            next_id: nextId,
          },
        },
      }).then((_res: any) => {
        updatedCategoryOrder();
        setIsUpdating(false);
      });
    } else if (itemType === "item") {
      updatingItemOrder(true);

      await updateItemFloatingPoint({
        variables: {
          itemInput: {
            id: activeId,
            previous_id: previousId,
            next_id: nextId,
          },
        },
      }).then((_res: any) => {
        updatedItemOrder();
        setIsUpdating(false);
      });
    }

    setElements((elementsItems: any) => {
      return arrayMove(elementsItems, originalPosition, newPosition);
    });
  };
  useEffect(() => {
    setElements(itemList);
  }, [itemList]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  if (
    (isUpdatingCategoryOrder && itemType === "category") ||
    (isUpdatingItemOrder && itemType === "item") ||
    isUpdating
  ) {
    return (
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <MenuCardSkeleton />
        <MenuCardSkeleton />
        <MenuCardSkeleton />
        <MenuCardSkeleton />
        <MenuCardSkeleton />
        <MenuCardSkeleton />
        <MenuCardSkeleton />
        <MenuCardSkeleton />
        <MenuCardSkeleton />
        <MenuCardSkeleton />
      </div>
    );
  } else {
    return (
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <Row gutter={16} justify="start" style={{ margin: "1rem 0" }}>
          <SortableContext
            items={elements} // Use elements state here
            strategy={horizontalListSortingStrategy}
          >
            {elements.length > 0 &&
              elements.map(
                (
                  item // Map over elements state
                ) => (
                  <Col key={item.id} style={{ marginBottom: "0.5rem" }}>
                    {" "}
                    {/* Ensure unique and stable key */}
                    {itemType === "item" ? (
                      <ItemListItem
                        {...item}
                        action={action}
                        clickedComponent={clickedComponent}
                        modalVisibility={modalVisibility}
                        modalTitle={modalTitle}
                      />
                    ) : (
                      <ElementListItem
                        {...item}
                        itemType={itemType}
                        action={action}
                        item_count={
                          item.categories
                            ? calculateItems(item.categories)
                            : item.items
                              ? calculateItems(item.items)
                              : 0
                        }
                        clickedComponent={clickedComponent}
                        modalVisibility={modalVisibility}
                        modalTitle={modalTitle}
                        itemId={item.id}
                        selectedLabel={selectedLabel}
                      />
                    )}
                  </Col>
                )
              )}

            <Col>
              {selectedLabel !== "Archived" && (
                <AddComponent
                  addItemText={addItemText}
                  action={action}
                  clickedComponent={clickedComponent}
                  modalVisibility={modalVisibility}
                  modalTitle={modalTitle}
                  itemId={itemId}
                  selectedLabel={selectedLabel}
                />
              )}
            </Col>
          </SortableContext>
        </Row>
      </DndContext>
    );
  }
}

export default ListContent;
