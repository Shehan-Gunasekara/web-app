import React, { useState } from "react";
import { Typography, Form, Input, Button, Modal, message, theme } from "antd";
import { useAuthContext } from "@/app/providers/AuthProvider";
const { Title } = Typography;

function VerifyEmailPopup({
  isOpen,
  handleCloseModel,
  setIsSucess,
  handleCancel,
}: {
  isOpen: boolean;
  handleCloseModel: () => void;
  setIsSucess: React.Dispatch<React.SetStateAction<boolean>>;
  handleCancel: any;
}) {
  const {
    token: { colorBgBase, colorTextBase, colorBgContainer, colorTextDisabled },
  } = theme.useToken();

  const { getUserAttributes, handleConfirmUserAttribute } = useAuthContext();

  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const submitOTPCode = () => {
    form.validateFields().then(async (formValues: any) => {
      setIsLoading(true);
      const { otp_code } = formValues;

      const user = await getUserAttributes();
      const username = user?.sub;
      if (username) {
        handleConfirmUserAttribute({
          userAttributeKey: "email",
          confirmationCode: otp_code,
        }).then((res: any) => {
          if (res.success) {
            form.resetFields();
            setIsSucess(true);
            handleCancel();
            setIsLoading(false);
          } else {
            setIsLoading(false);
            message.error("Failed to verify OTP code. Please try again.");
          }
        });
      } else {
        message.error("Failed to verify OTP code. Please try again.");
        setIsLoading(false);
      }
    });
  };

  return (
    <Modal
      centered={true}
      style={{
        minWidth: "24rem",
        minHeight: "24rem",
      }}
      width={"fit-content"}
      open={isOpen}
      onCancel={handleCloseModel}
      footer={null}
    >
      <div
        style={{
          maxWidth: "24rem",
          minHeight: "24rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: colorBgContainer,
          borderRadius: 10,
        }}
      >
        <Form
          form={form}
          name="verifyEmail"
          layout="vertical"
          autoComplete="off"
        >
          <Title level={3} style={{ textAlign: "center" }}>
            {"Email Verification"}
          </Title>
          <p style={{ padding: "0 2.5rem", color: colorTextDisabled }}>
            {"Please check your email for OTP code"}
          </p>
          <Form.Item
            name="otp_code"
            label={"OTP Code"}
            rules={[
              {
                required: true,
                message: "Please enter the otp code",
              },
            ]}
            style={{ margin: "0 2rem" }}
          >
            <Input
              style={{
                border: "none",
                height: "2.5rem",
                margin: 0,
                background: colorBgBase,
              }}
            />
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1.5rem",
            }}
          >
            <Button
              disabled={isLoading}
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
              onClick={submitOTPCode}
              name="submitOTPcode"
            >
              {isLoading ? "verifying..." : "Submit"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default VerifyEmailPopup;
