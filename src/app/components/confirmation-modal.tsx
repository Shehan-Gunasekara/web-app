import { Button, Modal, theme } from "antd";
import React from "react";
import style from "@/styles/menu/menu-modals";

interface ConfirmationModalProps {
  modalTitle: string;
  modalVisibility: boolean;
  itemId?: number;
  message: string;
  btnCancelText: string;
  btnConfirmText: string;
  handleCancelClick: (e: any) => any;
  handleConfirmClick: (e: any) => any;
}

function ConfirmationModal({
  modalTitle,
  modalVisibility,
  message,
  btnCancelText,
  btnConfirmText,
  handleCancelClick,
  handleConfirmClick,
}: ConfirmationModalProps) {
  const {
    token: { colorBgBase, colorTextBase, red2 },
  } = theme.useToken();

  return (
    <>
      <Modal
        title={<div style={style.confirmModalTitle}>{modalTitle}</div>}
        style={style.confirmModal}
        width={"fit-content"}
        open={modalVisibility}
        onCancel={handleCancelClick}
        footer={null}
      >
        <div style={style.confirmMessage}>{message}</div>
        <div style={style.confirmBtnContainer}>
          <div style={style.consfirmBtns}>
            <Button
              style={{
                backgroundColor: colorTextBase,
                color: colorBgBase,
                ...style.confirmBtn,
              }}
              onClick={handleCancelClick}
              name="cancelBtn"
            >
              {btnCancelText}
            </Button>
            <Button
              style={{
                backgroundColor: red2,
                color: colorTextBase,
                ...style.confirmBtn,
              }}
              onClick={handleConfirmClick}
              name="confirmBtn"
            >
              {btnConfirmText}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ConfirmationModal;
