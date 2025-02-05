import React from "react";
import { Form, Button, theme } from "antd";

import style from "@/styles/profile/confirmation-popup";

function ConfirmationPopup({
  confirmationType,
  setIsEmailChange,
  handleEmailReset,
  handlePasswordReset,
  setIsPasswordChange,
}: {
  confirmationType: string;
  setIsEmailChange: any;
  handleEmailReset: any;
  handlePasswordReset: any;
  setIsPasswordChange: any;
}) {
  const {
    token: { colorBgBase, colorTextBase, colorBgContainer, geekblue6 },
  } = theme.useToken();
  const [form] = Form.useForm();

  const handleContinue = async () => {
    if (confirmationType === "email") {
      handleEmailReset();
      setIsEmailChange(true);
    } else {
      handlePasswordReset();
      setIsPasswordChange(true);
    }
  };

  const handleCancel = () => {
    if (confirmationType === "email") {
      handleEmailReset();
    } else {
      handlePasswordReset();
    }
  };

  return (
    <div
      style={{
        ...style.mainDiv,
        background: colorBgContainer,
      }}
    >
      <p style={{ ...style.headerTitle }}>
        Are you sure you want to update your account {confirmationType}?
      </p>
      {confirmationType === "email" ? (
        <p style={{ ...style.contentText, color: geekblue6 }}>
          You will receive an email to update the account email. Please follow
          the instructions provided in order to complete the process.
        </p>
      ) : (
        <p style={{ ...style.contentText, color: geekblue6 }}>
          You will receive an email to update the account password. Please
          follow the instructions provided in order to complete the process.
        </p>
      )}

      <Form
        form={form}
        name="resetEmail"
        layout="vertical"
        autoComplete="off"
        style={{ ...style.form }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button
              style={{
                color: colorTextBase,
                backgroundColor: "transparent",
                border: "1px solid #484848",
                fontSize: 14,
                height: "2.1rem",
                width: "11rem",
              }}
              block
              onClick={handleCancel}
              name="cancel-btn"
            >
              {"Cancel"}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: colorTextBase,
                color: colorBgBase,
                height: "2.1rem",
                width: "11rem",
                fontWeight: 700,
              }}
              block
              onClick={handleContinue}
              name="continue-btn"
            >
              {"Continue"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default ConfirmationPopup;
