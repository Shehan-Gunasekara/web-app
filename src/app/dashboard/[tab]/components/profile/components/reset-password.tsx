import React, { useState } from "react";
import { Typography, Form, Input, Button, Divider, message, theme } from "antd";
import { useAuthContext } from "@/app/providers/AuthProvider";
import ForgetPasswordPopup from "./forget-password";

const { Title } = Typography;

function ResetPassword({
  handlecanCelingPasswordChange,
  setIsSucess,
}: {
  handlecanCelingPasswordChange: any;
  setIsSucess: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    token: {
      colorBgBase,
      colorTextBase,
      colorBgContainer,
      purple1,
      colorTextDisabled,
    },
  } = theme.useToken();
  const [form] = Form.useForm();

  const { handleUpdatePassword, getUserAttributes, handleResetPassword } =
    useAuthContext();

  const [isForgetClicked, setIsForgetClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    handlecanCelingPasswordChange();
  };
  const handleSubmit = async () => {
    form.validateFields().then(async (formValues: any) => {
      setIsLoading(true);
      const { current_password, new_password, confirm_password } = formValues;

      if (new_password !== confirm_password) {
        message.error("New password and confirm password do not match");
        setIsLoading(false);
        return;
      }

      const user = await getUserAttributes();
      const email = user?.email;

      if (email) {
        handleUpdatePassword(current_password, new_password).then(
          (res: any) => {
            if (res.success) {
              handlecanCelingPasswordChange();
              setIsSucess(true);
              form.resetFields();
            } else {
              if (res.error.message) {
                message.error(res.error.message);
                setIsLoading(false);
              } else {
                message.error("Failed to update password. Please try again.");
                setIsLoading(false);
              }
            }
          }
        );
      }
    });
  };

  const handleForgetPassword = async () => {
    if (!isForgetClicked) {
      setIsForgetClicked(!isForgetClicked);
      const user = await getUserAttributes();
      const username = user?.sub;
      if (username) {
        await handleResetPassword(username);
      }
    } else {
      setIsForgetClicked(!isForgetClicked);
    }
  };

  return (
    <div
      style={{
        maxWidth: "32rem",
        minHeight: "32rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: colorBgContainer,
        borderRadius: 10,
      }}
    >
      <Title level={3}>{"Change Account Password"}</Title>

      <Form
        form={form}
        name="resetPassword"
        layout="vertical"
        autoComplete="off"
        style={{ width: "24rem" }}
      >
        <Form.Item
          name="current_password"
          label={"Current Password"}
          rules={[
            {
              required: true,
              message: "Please enter your current password",
            },
          ]}
          style={{ margin: "2rem 0 1rem 0" }}
        >
          <Input
            type="password"
            style={{
              border: "none",
              height: "2.5rem",
              margin: 0,
              background: colorBgBase,
            }}
          />
          {/* <Input.Password
              style={{
                border: "none",
                height: "2.5rem",
                margin: 0,
                background: colorBgBase,
              }}
            /> */}
        </Form.Item>
        <div
          style={{
            fontSize: 16,
            color: purple1,
            cursor: "pointer",
            marginBottom: "0.5rem",
          }}
          onClick={handleForgetPassword}
        >
          {"Forget Password?"}
        </div>
        <div>
          <Divider
            style={{
              backgroundColor: colorBgContainer,
              margin: 0,
              padding: 0,
            }}
          />
        </div>
        {isForgetClicked ? (
          <div
            style={{
              border: `1px solid ${purple1}`,
              borderRadius: "1rem",
              padding: "0.5rem 1.5rem",
              background: colorBgContainer,
              marginBottom: "1rem",
            }}
          >
            {
              "The password reset link and information has been sent to your email."
            }
          </div>
        ) : (
          <div
            style={{
              fontSize: 11,
              color: colorTextDisabled,
              margin: "0.5rem 0",
            }}
          >
            {
              "Create a password at least 12 characters long, using a mix of uppercase and lowercase letters, numbers and special characters. Avoid common information."
            }
          </div>
        )}
        <Form.Item
          name="new_password"
          label={"New Password"}
          rules={[
            {
              required: true,
              message: "Please enter your new password",
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
              message:
                "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long.",
            },
          ]}
          style={{ margin: "1rem 0 1rem 0" }}
        >
          <Input
            type="password"
            style={{
              border: "none",
              height: "2.5rem",
              margin: 0,
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
                  new Error("New password and confirm password do not match")
                );
              },
            }),
          ]}
          style={{ margin: "1rem 0 1.5rem 0" }}
        >
          <Input
            type="password"
            style={{
              border: "none",
              height: "2.5rem",
              margin: 0,
              background: colorBgBase,
            }}
          />
          {/* <Input.Password
              style={{
                border: "none",
                height: "2.5rem",
                margin: 0,
                background: colorBgBase,
              }}
            /> */}
        </Form.Item>
        {isForgetClicked && (
          <ForgetPasswordPopup
            isOpen={isForgetClicked}
            handleCloseModel={() => setIsForgetClicked(false)}
          />
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button
              style={{
                color: colorTextBase,
                backgroundColor: "transparent",
                border: "1px solid #484848",
                height: "2.1rem",
                width: "11rem",
                fontWeight: 700,
              }}
              block
              onClick={handleCancel}
              name="cancel-btn"
            >
              {"Cancel"}
            </Button>
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
              onClick={handleSubmit}
              name="save-btn"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default ResetPassword;
