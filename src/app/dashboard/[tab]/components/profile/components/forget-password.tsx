import React, { useState } from "react";
import { Typography, Form, Input, Button, Modal, message, theme } from "antd";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { IoIosCheckmarkCircle } from "react-icons/io";
import style from "@/styles/profile/forget-password";

const { Title } = Typography;

function ForgetPasswordPopup({
  isOpen,
  handleCloseModel,
}: {
  isOpen: boolean;
  handleCloseModel: () => void;
}) {
  const {
    token: {
      colorBgBase,
      colorTextBase,
      colorBgContainer,
      colorTextDisabled,
      colorBgContainerDisabled,
    },
  } = theme.useToken();

  const { getUserAttributes, handleConfirmResetPassword } = useAuthContext();

  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const submitOTPCode = () => {
    form.validateFields().then(async (formValues: any) => {
      setIsLoading(true);
      const { otp_code, new_password, confirm_password } = formValues;

      if (new_password !== confirm_password) {
        setIsLoading(false);
        message.error("New password and confirm password do not match");
        return;
      }

      const user = await getUserAttributes();
      const username = user?.sub;
      if (username) {
        handleConfirmResetPassword(username, otp_code, new_password).then(
          (res: any) => {
            if (res.success) {
              form.resetFields();
              setResetSuccess(true);
              setIsLoading(false);
            } else {
              setIsLoading(false);
              message.error("Failed to verify OTP code. Please try again.");
            }
          }
        );
      }
    });
  };

  return (
    <Modal
      centered={true}
      style={{ ...style.modal }}
      width={"fit-content"}
      open={isOpen}
      onCancel={handleCloseModel}
      footer={null}
    >
      <div
        style={{
          ...style.modalDiv,
          background: colorBgContainer,
        }}
      >
        {resetSuccess ? (
          <div style={{ ...style.resetDiv }}>
            <div
              style={{
                ...style.resetText,
                color: colorTextDisabled,
              }}
            >
              {"Your password update has been successfully completed"}
            </div>
            <div style={{ ...style.resetCheckmark }}>
              <IoIosCheckmarkCircle size={"33px"} />
            </div>
            <div style={{ ...style.resetDividerDiv }}>
              <div
                style={{
                  ...style.resetDivider,
                  borderTop: `3px solid ${colorBgContainerDisabled}`,
                }}
              />
            </div>
            <div style={{ ...style.resetInfoText }}>
              {
                "Please use the new password to log back into your other active devices"
              }
            </div>
          </div>
        ) : (
          <Form
            form={form}
            name="forgetPassword"
            layout="vertical"
            autoComplete="off"
            style={{ ...style.form }}
          >
            <Title level={3} style={{ ...style.formTitle }}>
              {"Reset Password"}
            </Title>
            <p style={{ ...style.otpMessage, color: colorTextDisabled }}>
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
              style={{ ...style.otpItem }}
            >
              <Input
                style={{
                  ...style.otpInput,
                  background: colorBgBase,
                }}
              />
            </Form.Item>
            <Form.Item
              name="new_password"
              label={"New Password"}
              rules={[
                {
                  required: true,
                  message: "Please enter your new password",
                },
              ]}
              style={{ ...style.newPasswordItem }}
            >
              <Input
                style={{
                  ...style.newPasswordInput,
                  background: colorBgBase,
                }}
              />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              label={"Confirm New Password"}
              dependencies={["new_password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("new_password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match"
                      )
                    );
                  },
                }),
              ]}
              style={{ ...style.confirmPasswordItem }}
            >
              <Input
                style={{
                  ...style.confirmPasswordInput,
                  background: colorBgBase,
                }}
              />
            </Form.Item>
            <div style={{ ...style.buttonDiv }}>
              <Button
                disabled={isLoading}
                type="primary"
                htmlType="submit"
                style={{
                  ...style.button,
                  backgroundColor: colorTextBase,
                  color: colorBgBase,
                }}
                block
                onClick={submitOTPCode}
                name="submit-btn"
              >
                {isLoading ? "verifying..." : "Submit"}
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Modal>
  );
}

export default ForgetPasswordPopup;
