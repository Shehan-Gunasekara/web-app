import React from "react";
import { theme } from "antd";
import style from "@/styles/menu/add-component";
import { GoPlus } from "react-icons/go";
import AddItem from "./add-item";
import AddCategory from "./add-category";
import UpdateCategory from "./update-component";
import UpdateItem from "./update-item";
import { useMenuContext } from "@/app/providers/MenuProvider";

interface AddItemProps {
  addItemText: string;
  clickedComponent: string;
  action: (clickedItem: string, itemId: number) => any;
  itemId: number;
  modalVisibility: boolean;
  modalTitle?: string;
  selectedLabel?: string;
}

function AddComponent({
  addItemText,
  action,
  clickedComponent,
  itemId,
  modalVisibility,
  modalTitle,
}: //selectedLabel,
  AddItemProps) {
  const {
    token: { geekblue2 },
  } = theme.useToken();

  const { selectedLabel } = useMenuContext();

  const handleClick = () => {
    clickedComponent = addItemText;
    action(clickedComponent, itemId);
    // formRef.current?.resetFields();
  };

  return (
    <>
      {addItemText === "Add item" ? (
        <div
          onClick={handleClick}
          style={{
            border: `3px dotted ${geekblue2}`,
            ...style.addItemButtonItem,
          }}
          id="add-component"
        >
          <div style={style.addItemCard}>
            <div
              style={{
                borderBottom: `3px dotted ${geekblue2}`,
                ...style.addItemCardInner,
              }}
            />
            <div style={style.itemContainerItem}>
              <GoPlus style={{ color: geekblue2, ...style.addIcon }} />
              <p style={{ color: geekblue2, ...style.addItemText }}>
                {addItemText}
              </p>
            </div>
          </div>
        </div>
      ) : (
        selectedLabel === "Menu" && (
          <div
            onClick={handleClick}
            style={{
              border: `3px dotted ${geekblue2}`,
              ...style.addItemButton,
            }}
            id="add-menu"
          >
            <div style={style.itemContainer}>
              <GoPlus style={{ color: geekblue2, ...style.addIcon }} />
              <p style={{ color: geekblue2, ...style.addItemText }}>
                {addItemText}
              </p>
            </div>
          </div>
        )
      )}

      {clickedComponent === "Add category" ? (
        <AddCategory
          itemType="category"
          action={handleClick}
          modalTitle={modalTitle!}
          modalVisibility={modalVisibility}
          itemId={itemId}
          clickedComponent={clickedComponent}
        />
      ) : clickedComponent === "Update category" ? (
        <UpdateCategory
          itemType="category"
          action={handleClick}
          modalTitle={modalTitle!}
          modalVisibility={modalVisibility}
          itemId={itemId}
          clickedComponent={clickedComponent}
        />
      ) : clickedComponent === "Add menu" ? (
        <AddCategory
          itemType="menu"
          action={handleClick}
          modalTitle={modalTitle!}
          modalVisibility={modalVisibility}
          itemId={itemId}
          clickedComponent={clickedComponent}
        />
      ) : clickedComponent === "Update menu" ? (
        <UpdateCategory
          itemType="menu"
          action={handleClick}
          modalTitle={modalTitle!}
          modalVisibility={modalVisibility}
          itemId={itemId}
          clickedComponent={clickedComponent}
        />
      ) : clickedComponent === "Add item" ? (
        <AddItem
          action={handleClick}
          modalTitle={modalTitle!}
          modalVisibility={modalVisibility}
          clickedComponent={clickedComponent}
          selectedLabel={selectedLabel}
        />
      ) : (
        clickedComponent === "Update item" && (
          <UpdateItem
            action={handleClick}
            modalTitle={"Update Item"}
            modalVisibility={modalVisibility}
            clickedComponent={clickedComponent}
            itemId={itemId}
            selectedLabel={selectedLabel}
          />
        )
      )}
    </>
  );
}

export default AddComponent;
