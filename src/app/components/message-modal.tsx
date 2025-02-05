import { Button, Modal, theme } from "antd";
import React from "react";
import style from "@/styles/menu/message-modal";

interface ConfirmationModalProps {
  modalTitle: string;
  modalVisibility: boolean;
  itemId?: number;
  messageOne: string;
  messageTwo: string;
  btnCancelText: string;
  handleCancelClick: () => any;
}

function MessageModal({
  modalTitle,
  modalVisibility,
  messageOne,
  messageTwo,
  btnCancelText,
  handleCancelClick,
}: ConfirmationModalProps) {
  const {
    token: { colorBgBase, colorTextBase, colorTextDisabled },
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
        <div
          style={{ color: colorTextDisabled, ...style.confirmMessageContainer }}
        >
          <div style={{ color: colorTextDisabled, ...style.confirmMessageOne }}>
            {messageOne}
          </div>
          <div style={{ color: colorTextDisabled, ...style.confirmMessageTwo }}>
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
            onClick={handleCancelClick}
            name="cancelBtn"
          >
            {btnCancelText}
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default MessageModal;
