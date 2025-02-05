import { Button, Modal, theme } from "antd";
import React, { useEffect } from "react";
import style from "@/styles/menu/message-modal";
import { useQuery } from "@apollo/client";
import { IS_CATEGORY_DELETABLE, IS_MENU_DELETABLE } from "@/lib/queries/menu";
import { IS_ITEM_DELETABLE } from "@/lib/queries/items";
import { GET_ALL_RESTAURANTS } from "@/lib/queries/restaurants";

interface DeleteCheckModalProps {
  modalTitle: string;
  modalVisibility: boolean;
  itemId?: number;
  type: string;
  messageOne: string;
  messageTwo: string;
  btnCancelText: string;
  handleCancelClick: () => any;
  handleShowDeleteModal: () => any;
  isDeleteProhibited: boolean;
  setIsDeleteProhibited: React.Dispatch<React.SetStateAction<boolean>>;
  onHandleArchive: () => any;
}

function DeleteCheckModal({
  modalTitle,
  modalVisibility,
  itemId,
  type,
  messageOne,
  messageTwo,
  btnCancelText,
  handleCancelClick,
  handleShowDeleteModal,
  isDeleteProhibited,
  setIsDeleteProhibited,
  onHandleArchive,
}: DeleteCheckModalProps) {
  const {
    token: { colorBgBase, colorTextBase, colorTextDisabled },
  } = theme.useToken();

  const {
    data: deletableData,
    // loading: menuDeletableLoading,
    // error: menuDeletableError,
    // refetch: deletableRefetch,
  } = useQuery(
    type == "menu"
      ? IS_MENU_DELETABLE
      : type == "category"
      ? IS_CATEGORY_DELETABLE
      : type == "item"
      ? IS_ITEM_DELETABLE
      : GET_ALL_RESTAURANTS,
    {
      variables: {
        id: itemId,
      },
      onCompleted: () => {
        if (type == "menu") {
          const isDeletable = deletableData?.isMenuDeletable;
          setIsDeleteProhibited(!isDeletable);
          if (isDeletable) handleShowDeleteModal();
        } else if (type == "category") {
          const isDeletable = deletableData?.isCategoryDeletable;
          setIsDeleteProhibited(!isDeletable);
          if (isDeletable) handleShowDeleteModal();
        } else if (type == "item") {
          const isDeletable = deletableData?.isItemDeletable;
          setIsDeleteProhibited(!isDeletable);
          if (isDeletable) handleShowDeleteModal();
        }
      },
      onError: () => {},
    }
  );

  useEffect(() => {
    return () => {
      setIsDeleteProhibited(false);
    };
  }, []);

  return (
    <>
      {
        <Modal
          title={<div style={style.confirmModalTitle}>{modalTitle}</div>}
          style={style.confirmModal}
          width={"fit-content"}
          open={isDeleteProhibited && modalVisibility}
          onCancel={handleCancelClick}
          footer={null}
        >
          <div
            style={{
              color: colorTextDisabled,
              ...style.confirmMessageContainer,
            }}
          >
            <div
              style={{ color: colorTextDisabled, ...style.confirmMessageOne }}
            >
              {messageOne}
            </div>
            <div
              style={{ color: colorTextDisabled, ...style.confirmMessageTwo }}
            >
              {messageTwo}
            </div>
          </div>

          <div style={style.consfirmBtns}>
            <Button
              style={{
                backgroundColor: colorTextBase,
                color: colorBgBase,
                ...style.confirmBtn,
              }}
              onClick={onHandleArchive}
              name="archive-btn"
            >
              {"Archive"}
            </Button>
            <Button
              style={{
                marginLeft: "5px",
                backgroundColor: colorTextBase,
                color: colorBgBase,
                ...style.confirmBtn,
              }}
              onClick={handleCancelClick}
              name="cancel-btn"
            >
              {btnCancelText}
            </Button>
          </div>
        </Modal>
      }
    </>
  );
}

export default DeleteCheckModal;
