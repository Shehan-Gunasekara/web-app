import React, { useState } from "react";
import { Typography, Form, Input, Button, Divider, message, theme } from "antd";
import { useAuthContext } from "@/app/providers/AuthProvider";
import ForgetPasswordPopup from "./forget-password";
import VerifyEmailPopup from "./verify-email";
import style from "@/styles/profile/reset-email";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_EMAIL } from "@/lib/mutations/user";
const { Title } = Typography;

function ResetEmail({
  handlecanCelingEmailChange,
  setIsSucess,
}: {
  handlecanCelingEmailChange: any;
  setIsSucess: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    token: { colorBgBase, colorTextBase, colorBgContainer, purple1 },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [updateUserEmail] = useMutation<any>(UPDATE_USER_EMAIL);
  const {
    getUserAttributes,
    handleUpdateUserAttribute,
    handleVerificationSession,
    handleResetPassword,
    verifyCurrentUserPassword,
  } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [isForgetClicked, setIsForgetClicked] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCancel = () => {
    handlecanCelingEmailChange();
  };

  const handleSubmit = async () => {
    form.validateFields().then(async (formValues: any) => {
      setIsLoading(true);

      const { new_email, confirm_email, current_password } = formValues;
      console.log(new_email, confirm_email, current_password);
      const isPassowrdCorrect = await verifyCurrentUserPassword(
        current_password
      );
      console.log(isPassowrdCorrect);
      if (isPassowrdCorrect.isCorrect === false) {
        setIsLoading(false);
        setDisableBtn(true);
        message.error(isPassowrdCorrect.error);
        setTimeout(() => {
          setDisableBtn(false);
        }, 3000);
        return;
      }
      console.log(isPassowrdCorrect);

      if (new_email !== confirm_email) {
        setIsLoading(false);
        setDisableBtn(true);
        message.error("New email and confirm email do not match");
        setTimeout(() => {
          setDisableBtn(false);
        }, 3000);
        return;
      }

      const userRes = await getUserAttributes();

      const email = userRes?.email;

      if (email === new_email) {
        setIsLoading(false);
        setDisableBtn(true);
        message.error("New email and current email are same");
        setTimeout(() => {
          setDisableBtn(false);
        }, 3000);
        return;
      }

      handleUpdateUserAttribute("email", new_email).then(async (res: any) => {
        if (res.success) {
          await handleVerificationSession(email);
          try {
            await updateUserEmail({
              variables: {
                userInput: {
                  restaurant_id:
                    localStorage.getItem("lono_restaurant_id") &&
                    parseInt(localStorage.getItem("lono_restaurant_id")!),
                  email: new_email,
                },
              },
            });
            setIsPopupOpen(true);
            form.resetFields();
            setIsLoading(false);
          } catch (e) {
            setDisableBtn(true);
            message.error("Failed to update email. Please try again.");
            setIsLoading(false);
            setTimeout(() => {
              setDisableBtn(false);
            }, 3000);
          }
        } else {
          setIsLoading(false);
          if (res.error.message) {
            setDisableBtn(true);
            message.error(res.error.message);
            setTimeout(() => {
              setDisableBtn(false);
            }, 3000);
          } else {
            setDisableBtn(true);
            message.error("Failed to update email. Please try again.");
            setTimeout(() => {
              setDisableBtn(false);
            }, 3000);
          }
        }
      });
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
        ...style.mainDiv,
        background: colorBgContainer,
      }}
    >
      <>
        <Title level={3}>{"Change Account Email"}</Title>
        <Form
          form={form}
          name="resetEmail"
          layout="vertical"
          autoComplete="off"
          style={{ ...style.form }}
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
            style={{ ...style.passwordItem }}
          >
            <Input
              type="password"
              style={{
                ...style.passwordInput,
                background: colorBgBase,
              }}
            />
          </Form.Item>
          <div
            style={{
              ...style.forgotLabel,
              color: purple1,
            }}
            onClick={handleForgetPassword}
          >
            {"Forget Password?"}
          </div>
          {isForgetClicked && (
            <div
              style={{
                ...style.forgetText,
                border: `1px solid ${purple1}`,
                background: colorBgContainer,
              }}
            >
              {
                "The password reset link and information has been sent to your email."
              }
            </div>
          )}
          <div>
            <Divider
              style={{
                backgroundColor: colorBgContainer,
                margin: 0,
                padding: 0,
              }}
            />
          </div>
          <Form.Item
            name="new_email"
            label={"enter new account email"}
            rules={[
              {
                required: true,
                message: "Please enter your new email",
              },
            ]}
            style={{ margin: "1rem 0 1rem 0" }}
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
          <Form.Item
            name="confirm_email"
            label={"confirm new account email"}
            rules={[
              {
                required: true,
                message: "Please confirm your new email",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_email") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two emails that you entered do not match")
                  );
                },
              }),
            ]}
            style={{ margin: "1rem 0 1.5rem 0" }}
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
          {isForgetClicked && (
            <ForgetPasswordPopup
              isOpen={isForgetClicked}
              handleCloseModel={() => setIsForgetClicked(false)}
            />
          )}
          {isPopupOpen && (
            <VerifyEmailPopup
              isOpen={isPopupOpen}
              handleCloseModel={() => setIsPopupOpen(false)}
              setIsSucess={setIsSucess}
              handleCancel={handleCancel}
            />
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
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
                }}
                block
                onClick={handleCancel}
                name="cancel-btn"
              >
                {"Cancel"}
              </Button>
              <Button
                disabled={isLoading || disableBtn}
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
                name="submit-btn"
              >
                {isLoading ? "updating..." : "Confirm"}
              </Button>
            </div>
          </div>
        </Form>
      </>
    </div>
  );
}

export default ResetEmail;
