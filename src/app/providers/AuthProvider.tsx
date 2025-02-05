"use client";

import React, { createContext, useContext, useState } from "react";
import {
  AuthUser,
  getCurrentUser,
  fetchAuthSession,
  signUp,
  signIn,
  signOut,
  // confirmSignUp,
  updatePassword,
  fetchUserAttributes,
  updateUserAttribute,
  type UpdateUserAttributeOutput,
  confirmUserAttribute,
  type ConfirmUserAttributeInput,
  resetPassword,
  confirmResetPassword,
  confirmSignUp,
  resendSignUpCode,
  type ResetPasswordOutput,
} from "aws-amplify/auth";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Amplify } from "aws-amplify";
import { userPool, AwsExport } from "@/aws-exports";
import { defaultStorage } from "aws-amplify/utils";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";

import {
  sendUserAttributeVerificationCode,
  SendUserAttributeVerificationCodeInput,
} from "aws-amplify/auth";

const AuthContext = createContext<any>(null);

Amplify.configure(AwsExport);

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [unverifiedUser, setUnverifiedUser] = useState<string>("");
  const [prevoiousEmail, setPreviousEmail] = useState<string>("");
  const [isVerifiedNewEmail, setIsVerifiedNewEmail] = useState<boolean>(false);
  const getAuthenticatedUser = async () => {
    try {
      const user: AuthUser = await getCurrentUser();
      setAuthUser(user);
      return user;
    } catch (_error) {
      return null;
    }
  };

  const getUserAttributes = async () => {
    try {
      const user = await fetchUserAttributes();
      return user;
    } catch (_error) {
      return null;
    }
  };
  const handleResendVerificationCode = async (
    attributeKey: SendUserAttributeVerificationCodeInput["userAttributeKey"]
  ) => {
    try {
      const result: any = await sendUserAttributeVerificationCode({
        userAttributeKey: attributeKey,
      });
      console.log("Code delivery details:", result.codeDeliveryDetails);
      return {
        success: true,
        message: `Verification code resent successfully `,
      };
    } catch (error) {
      console.error("Error resending verification code:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  };

  const getCurrentSession = async () => {
    try {
      const { accessToken, idToken } =
        (await fetchAuthSession({ forceRefresh: true })).tokens ?? {};
      // if (accessToken && accessToken?.payload) {
      //   const token = localStorage.getItem(
      //     `CognitoIdentityServiceProvider.${accessToken?.payload.client_id}.${accessToken?.payload.username}.accessToken`
      //   );
      //   if (token) {
      //     localStorage.setItem("jwt-token", token);
      //   }
      // }
      return { accessToken, idToken };
    } catch (_err) {
      return null;
    }
  };

  const signUpUser = async (username: string, password: string) => {
    try {
      const user = await signUp({
        username,
        password,
      });
      return { isSignedUp: true, user };
    } catch (error) {
      return { isSignedUp: false, error };
    }
  };

  const checkIfUserIsLoggedIn = async () => {
    try {
      const user = await getCurrentUser();
      const session = await getCurrentSession();

      // If we can get both the user and a valid session, the user is logged in
      return !!user && !!session;
    } catch (error) {
      console.log("Error checking login status:", error);
      return false;
    }
  };

  // const signUpConfirm = async (username: string, confirmationCode: string) => {
  //   try {
  //     const { isSignUpComplete, nextStep } = await confirmSignUp({
  //       username,
  //       confirmationCode,
  //     });
  //   } catch (error) {
  //   }
  // };

  const isUserVerified = async (): Promise<boolean> => {
    try {
      // First, ensure we have the current user
      await getAuthenticatedUser();

      // Fetch user attributes
      const userAttributes = await getUserAttributes();

      // Check if the email is verified
      if (userAttributes) {
        return userAttributes.email_verified === "true";
      }

      // If we can't find the email_verified attribute, assume the user is not verified
      return false;
    } catch (error) {
      console.error("Error checking user verification status:", error);
      return false;
    }
  };

  const signInUser = async (username: string, password: string) => {
    try {
      const user = await signIn({ username, password });

      if (!user.isSignedIn) {
        return {
          isLoggedIn: false,
          error: { message: "notVerified" },
        };
      }
      const isVerified = await isUserVerified();

      if (!isVerified) {
        return {
          isLoggedIn: false,
          error: { message: "notVerified" },
        };
      }
      return { isLoggedIn: true, user };
    } catch (error) {
      return { isLoggedIn: false, error };
    }
  };

  const signOutUser = async () => {
    try {
      const user = await signOut();
      return user;
    } catch (_error) {
      return null;
    }
  };

  const verifyUser = async (username: string, password: string) => {
    try {
      const user = await signIn({ username, password });
      if (!user.isSignedIn) {
        return {
          isVerified: false,
          error: { message: "Invalid Password." },
        };
      }
      return { isVerified: true, user };
    } catch (error) {
      return { isVerified: false, error };
    }
  };

  const handleUpdatePassword = async (
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      await updatePassword({ oldPassword, newPassword });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleUpdateUserAttributeNextSteps = (
    output: UpdateUserAttributeOutput
  ) => {
    const { nextStep } = output;

    switch (nextStep.updateAttributeStep) {
      case "CONFIRM_ATTRIBUTE_WITH_CODE":
        break;
      case "DONE":
        break;
    }
  };

  const handleUpdateUserAttribute = async (
    attributeKey: string,
    value: string
  ) => {
    try {
      const output = await updateUserAttribute({
        userAttribute: {
          attributeKey,
          value,
        },
      });
      handleUpdateUserAttributeNextSteps(output);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleConfirmUserAttribute = async ({
    userAttributeKey,
    confirmationCode,
  }: ConfirmUserAttributeInput) => {
    try {
      await confirmUserAttribute({ userAttributeKey, confirmationCode });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleResetPasswordNextSteps = async (output: ResetPasswordOutput) => {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case "CONFIRM_RESET_PASSWORD_WITH_CODE":
        break;
      case "DONE":
        break;
    }
  };

  const handleResetPassword = async (username: string) => {
    try {
      const output = await resetPassword({ username });
      handleResetPasswordNextSteps(output);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  async function handleConfirmResetPassword(
    username: string,
    confirmationCode: string,
    newPassword: string
  ) {
    try {
      await confirmResetPassword({ username, confirmationCode, newPassword });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  const handleRequestForgotPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    try {
      await new Promise((resolve, reject) => {
        user.forgotPassword({
          onSuccess: () => resolve("Password reset code sent successfully"),
          onFailure: reject,
        });
      });
      return {
        success: true,
        message: "Password reset code has been sent to your email.",
      };
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        if (err.name === "UserNotFoundException") {
          return {
            success: false,
            message: "No user found with this email address.",
          };
        }
        if (err.name === "LimitExceededException") {
          return {
            success: false,
            message: "Too many attempts. Please try again later.",
          };
        }
        return {
          success: false,
          message:
            err.message || "An error occurred while sending the reset code.",
        };
      }
      return {
        success: false,
        message: "An unknown error occurred while sending the reset code.",
      };
    }
  };

  const handleForgotPassword = async (
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    try {
      await new Promise((resolve, reject) => {
        user.confirmPassword(code.trim(), newPassword, {
          onSuccess: resolve,
          onFailure: reject,
        });
      });
      return { success: true, message: "Password reset successful!" };
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        if (err.name === "CodeMismatchException") {
          return {
            success: false,
            message: "Incorrect verification code.",
          };
        }
        return {
          success: false,
          message: err.message || "An error occurred during password reset.",
        };
      }
      return {
        success: false,
        message: "An unknown error occurred during password reset.",
      };
    }
  };

  const confirmSignUpWithOTP = async (
    username: string,
    confirmationCode: string
  ) => {
    const isLoggedIn = await checkIfUserIsLoggedIn();
    if (isLoggedIn) {
      return handleConfirmUserAttribute({
        userAttributeKey: "email",
        confirmationCode: confirmationCode,
      });
    } else {
      try {
        const { isSignUpComplete, nextStep } = await confirmSignUp({
          username,
          confirmationCode,
        });
        return { success: true, isSignUpComplete, nextStep };
      } catch (error) {
        return { success: false, error };
      }
    }
  };

  const resendSignUpOTP = async (username: string) => {
    const isLoggedIn = await checkIfUserIsLoggedIn();
    if (isLoggedIn) {
      return handleResendVerificationCode("email");
    } else {
      try {
        const codeDeliveryDetails = await resendSignUpCode({
          username,
        });
        return { success: true, codeDeliveryDetails };
      } catch (error) {
        return { success: false, error };
      }
    }
  };
  const saveUnverifiedUser = async (email: string) => {
    setUnverifiedUser(email);
  };

  const handleVerificationSession = async (email: string) => {
    setPreviousEmail(email);
    setIsVerifiedNewEmail(true);
  };
  const verifyCurrentUserPassword = async (password: string) => {
    try {
      // Attempt to update the password to the same password
      // This will fail if the current password is incorrect
      await updatePassword({ oldPassword: password, newPassword: password });

      // If we reach here, the password is correct
      return { isCorrect: true };
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.name === "NotAuthorizedException" ||
          error.name === "InvalidPasswordException"
        ) {
          // These errors are thrown when the password is incorrect
          return { isCorrect: false, error: "Incorrect password" };
        } else {
          // Handle other types of errors
          return { isCorrect: false, error: error.message };
        }
      }
      return { isCorrect: false, error: "An unknown error occurred" };
    }
  };
  return (
    <AuthContext.Provider
      value={{
        authUser,
        getAuthenticatedUser,
        getUserAttributes,
        getCurrentSession,
        signUpUser,
        // signUpConfirm,
        signInUser,
        signOutUser,
        verifyUser,
        handleUpdatePassword,
        handleUpdateUserAttribute,
        handleConfirmUserAttribute,
        handleResetPassword,
        handleConfirmResetPassword,
        handleForgotPassword,
        handleRequestForgotPassword,
        checkIfUserIsLoggedIn,
        confirmSignUpWithOTP,
        resendSignUpOTP,
        verifyCurrentUserPassword,
        saveUnverifiedUser,
        unverifiedUser,
        handleVerificationSession,
        prevoiousEmail,
        isVerifiedNewEmail,
        isUserVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
