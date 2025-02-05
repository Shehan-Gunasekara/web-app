import React from "react";
import { Button, Modal, theme } from "antd";
import style from "@/styles/handwaves/handwave-confirmation-model";
import { AiOutlineWarning } from "react-icons/ai";

interface HandwaveConfirmationModelProps {
  isOpen: boolean;
  handleConfirmationModal: () => void;
  handleAttendAllRequests: () => void;
  isAttendingAll: boolean;
}

function HandwaveConfirmationModel({
  isOpen,
  handleConfirmationModal,
  handleAttendAllRequests,
  isAttendingAll,
}: HandwaveConfirmationModelProps) {
  const {
    token: { orange1, colorWhite, blue7 },
  } = theme.useToken();
  return (
    <Modal
      //   title={<div style={style.confirmModalTitle}>{modalTitle}</div>}
      style={{ ...style.confirmModal }}
      open={isOpen}
      onCancel={isAttendingAll ? undefined : handleConfirmationModal}
      footer={null}
    >
      <div style={{ ...style.confirmModalContainer, flexDirection: "column" }}>
        <AiOutlineWarning style={{ ...style.warningIcon, color: orange1 }} />
        <div style={style.modalTextContainer as React.CSSProperties}>
          <span style={style.modalText as React.CSSProperties}>
            Do you wish to proceed with marking all
          </span>
          <span style={style.modalText2 as React.CSSProperties}>
            Handwave requests as attended?
          </span>
        </div>
        <div style={style.confirmBtnContainer as React.CSSProperties}>
          <Button
            style={{
              ...style.cancelBtn,
            }}
            onClick={handleConfirmationModal}
            disabled={isAttendingAll}
          >
            No, Cancel
          </Button>
          <Button
            style={{
              backgroundColor: colorWhite,
              color: blue7,
              ...style.confirmBtn,
            }}
            onClick={handleAttendAllRequests}
            name="confirmBtn"
            disabled={isAttendingAll}
          >
            {isAttendingAll ? "Processing..." : " Yes, Proceed"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default HandwaveConfirmationModel;
