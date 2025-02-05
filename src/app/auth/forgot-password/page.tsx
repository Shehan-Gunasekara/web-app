"use client";

import style from "../../../styles/auth/forgot-password";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Layout, Button, Row, Col, Input, theme } from "antd";
import { IoMdArrowForward } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { RxEnvelopeClosed } from "react-icons/rx";
// import { MdFacebook } from "react-icons/md";
// import { FaApple, FaGoogle } from "react-icons/fa";
import { useThemeContext } from "../../providers/ThemeProvider";
import Link from "next/link";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import LoaderLite from "@/app/components/loader-lite";
// import { useForm } from "react-hook-form"; // Import for validation
import { Toaster, toast } from "react-hot-toast";
import MobileNotice from "@/app/components/mobile-notice";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import { useMutation } from "@apollo/client";
import { GET_RESTAURANT_BY_USER_EMAIL } from "@/lib/mutations/restaurant";

function SignInPage() {
  const {
    token: {
      colorBgBase,
      colorPrimaryBg,
      colorTextLightSolid,
      yellow6,
      colorIcon,
      colorTextHeading,
      green10,
      colorTextSecondary,
      purple1,
    },
  } = theme.useToken();

  const [isMobile, setIsMobile] = useState<any>(null);
  const { isDarkMode } = useThemeContext();
  const [email, setEmail] = useState("");
  const [verificationCode, setverificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  // const [emailError, setEmailError] = useState("");
  // const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const { push } = useRouter();
  const { handleForgotPassword, handleRequestForgotPassword } =
    useAuthContext();

  const deviceWidth = useWindowWidth();

  const [getRestaurantByUserEmail] = useMutation<any>(
    GET_RESTAURANT_BY_USER_EMAIL
  );

  const toastStyle = {
    style: {
      font: "Inter",
      background: colorPrimaryBg,
      color: colorTextLightSolid,
      fontSize: 16,
    },
  };

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  const handleEmailChange = (event: any) => {
    const inputEmail = event.target.value;
    setEmail(inputEmail);
    // setEmailError(validateEmail(inputEmail));
  };

  const handleVerificationCodeChange = (event: any) => {
    const code = event.target.value;
    setverificationCode(code);
    // setEmailError(validateEmail(inputEmail));
  };

  const handlePasswordChange = (event: any) => {
    const inputPassword = event.target.value;
    setPassword(inputPassword);
    // setPasswordError(validatePassword(inputPassword));
  };

  const handleConfirmPasswordChange = (event: any) => {
    const inputPassword = event.target.value;
    setconfirmPassword(inputPassword);
    // setPasswordError(validatePassword(inputPassword));
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isEmailValid = (userEmail: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(userEmail);
  };

  const isPasswordValid = (userPassword: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(userPassword);
  };

  const requestVerificationCode = async () => {
    // Validate email
    setIsLoading(true);

    if (!email) {
      toast.error("Please enter your email.", toastStyle);
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
      return;
    } else if (!isEmailValid(email)) {
      toast.error("Please enter a valid email.", toastStyle);
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
      return;
    }

    try {
      const { data: _restaurantData } = await getRestaurantByUserEmail({
        variables: {
          user_email: email.trim(),
        },
      });

      if (_restaurantData && _restaurantData.getRestaurantByUserEmail) {
        const result = await handleRequestForgotPassword(email);
        if (result.success) {
          toast.success(result.message);
          setForgotPasswordStep(2);
          setIsLoading(false);
          // You might want to transition to the next step of your password reset flow here
        } else {
          setIsLoading(false);
          toast.error(result.message);
        }
      }
    } catch (error: any) {
      if (error.message == "Restaurant not found") {
        setIsLoading(false);
        toast.error("User Not Found", {
          style: {
            font: "Inter",
            background: colorPrimaryBg,
            color: colorTextLightSolid,
            fontSize: 16,
          },
        });
      }
    }

    // setIsLoading(false);
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    if (!verificationCode) {
      toast.error("Please enter your verification code.", toastStyle);
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);

      return;
    }
    if (!password) {
      toast.error("Please enter your password.", toastStyle);
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
      return;
    }
    if (!isPasswordValid(password)) {
      toast.error(
        "Password should contain atleast one uppercase, one lowercase and one numeric.",
        toastStyle
      );
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your password.", toastStyle);
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", toastStyle);
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
      return;
    }

    const resault = await handleForgotPassword(
      email,
      verificationCode,
      password
    );
    if (resault.success) {
      setIsLoading(false);
      toast.success(resault.message);
      setForgotPasswordStep(3);
      // Additional logic for successful reset (e.g., redirecting to login page)
    } else {
      setIsLoading(false);
      toast.error(resault.message);
    }
  };
  const redirectToLogin = (event: any) => {
    event.preventDefault();
    push("/auth/sign-in");
  };

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsMobile(deviceWidth <= 767);
      }, 500);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [deviceWidth]);

  // const submitData = () => {
  // };

  // Validation functions
  // const validateEmail = (email: string) => {
  //   const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  //   return isValid ? "" : "Invalid email address";
  // };

  // const validatePassword = (password: string) => {
  //   const isValid = password.length >= 8;
  //   return isValid ? "" : "Password must be at least 6 characters long";
  // };

  return (
    <Layout style={{ backgroundColor: colorBgBase, ...style.container }}>
      <Row>
        {/* Logo on the left */}
        <Col xs={12} sm={12} md={12} lg={12}>
          <div style={style.leftContent}>
            <Image
              src={isDarkMode ? "/assets/logo.svg" : "/assets/logo.svg"}
              alt="Logo"
              width={262}
              height={296}
            />
          </div>
        </Col>

        {isMobile === true && (
          <div
            style={{
              minHeight: "100vh",
              backgroundColor: colorBgBase,
            }}
          >
            <MobileNotice />
          </div>
        )}

        {/* Vertical line in the middle */}
        {isMobile === false && (
          <Col xs={1} sm={0} md={1} lg={1}>
            <div style={style.middleContent}>
              <div style={style.verticalLine}></div>
              <Image
                src="/assets/ellipse.svg"
                alt="eclipse"
                width={70}
                height={70}
              />
              <IoMdArrowForward
                style={{ color: colorIcon, ...style.arrowIcon }}
              />
              <div style={style.verticalLine}></div>
            </div>
          </Col>
        )}

        {/* Sign-in form on the right */}
        {isMobile === false ? (
          <Col xs={11} sm={11} md={11} lg={11}>
            <div style={style.rightContent}>
              <div style={style.columnCenter}>
                <Row style={style.rowJustify}>
                  <h1
                    style={{ color: colorTextHeading, ...style.headingText }}
                    className="exo_init"
                  >
                    Forgot password
                  </h1>
                </Row>
                {forgotPasswordStep === 1 && (
                  <>
                    {" "}
                    <p
                      style={{
                        color: colorTextSecondary,
                        ...style.secondaryTexts,
                      }}
                    >
                      Please Enter Your Email Address To
                      <br />
                      Recieve a Verification Code
                    </p>
                    <Col style={style.rightCol}>
                      <div style={style.inputsLarge}>
                        <Row style={style.inputContainer}>
                          <Input
                            value={email}
                            style={{
                              color: colorTextLightSolid,
                              backgroundColor: yellow6,
                              // borderColor: emailError
                              //   ? colorErrorBorder
                              //   : colorBgContainer,
                              ...style.inputField,
                            }}
                            placeholder="Enter your email address"
                            onChange={handleEmailChange}
                            id="email"
                          />
                          <RxEnvelopeClosed
                            style={{
                              color: colorTextLightSolid,
                              ...style.inputIconsNonClick,
                            }}
                          />
                        </Row>
                      </div>

                      <Button
                        style={{
                          backgroundColor: green10,
                          color: colorTextLightSolid,
                          ...style.enterBtn,
                        }}
                        onClick={requestVerificationCode}
                        disabled={isLoading}
                        id="enter-btn"
                      >
                        {isLoading ? <LoaderLite /> : "Enter"}
                      </Button>
                    </Col>
                  </>
                )}

                {forgotPasswordStep === 2 && (
                  <>
                    {" "}
                    <p
                      style={{
                        color: colorTextSecondary,
                        ...style.secondaryTexts,
                      }}
                    >
                      Please Enter Verification Code and New Password
                    </p>
                    <Col style={style.rightCol}>
                      <div style={style.inputsLarge}>
                        <Row style={style.inputContainer}>
                          <Input
                            value={verificationCode}
                            style={{
                              color: colorTextLightSolid,
                              backgroundColor: yellow6,
                              // borderColor: emailError
                              //   ? colorErrorBorder
                              //   : colorBgContainer,
                              ...style.inputField,
                            }}
                            placeholder="Enter your verification code"
                            onChange={handleVerificationCodeChange}
                            id="verification-code"
                          />
                        </Row>{" "}
                        <Row style={style.inputContainer}>
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            style={{
                              color: colorTextLightSolid,
                              backgroundColor: yellow6,
                              // borderColor: passwordError
                              //   ? colorErrorBorder
                              //   : "transparent",
                              ...style.inputField,
                            }}
                            placeholder="Enter new your password"
                            onChange={handlePasswordChange}
                            id="password"
                          />
                          {showPassword ? (
                            <IoEyeOutline
                              style={{
                                color: colorTextLightSolid,
                                ...style.inputIcons,
                              }}
                              onClick={handleShowPassword}
                            />
                          ) : (
                            <IoEyeOffOutline
                              style={{
                                color: colorTextLightSolid,
                                ...style.inputIcons,
                              }}
                              onClick={handleShowPassword}
                            />
                          )}
                        </Row>
                        <Row style={style.inputContainer}>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            style={{
                              color: colorTextLightSolid,
                              backgroundColor: yellow6,
                              // borderColor: passwordError
                              //   ? colorErrorBorder
                              //   : "transparent",
                              ...style.inputField,
                            }}
                            placeholder="Confirm your password"
                            onChange={handleConfirmPasswordChange}
                            id="confirm-password"
                          />
                          {showConfirmPassword ? (
                            <IoEyeOutline
                              style={{
                                color: colorTextLightSolid,
                                ...style.inputIcons,
                              }}
                              onClick={handleShowConfirmPassword}
                            />
                          ) : (
                            <IoEyeOffOutline
                              style={{
                                color: colorTextLightSolid,
                                ...style.inputIcons,
                              }}
                              onClick={handleShowConfirmPassword}
                            />
                          )}
                        </Row>
                      </div>

                      <Button
                        style={{
                          backgroundColor: green10,
                          color: colorTextLightSolid,
                          ...style.enterBtn,
                        }}
                        onClick={handleChangePassword}
                        disabled={isLoading}
                        id="enter-btn-2"
                      >
                        {isLoading ? <LoaderLite /> : "Enter"}
                      </Button>
                    </Col>
                  </>
                )}

                {forgotPasswordStep === 3 && (
                  <>
                    {" "}
                    <p
                      style={{
                        color: colorTextSecondary,
                        ...style.secondaryTexts,
                      }}
                    >
                      successfully changed your password
                    </p>
                    <Col style={style.rightCol}>
                      <Button
                        style={{
                          backgroundColor: colorPrimaryBg,
                          color: colorTextLightSolid,
                          ...style.enterBtn,
                        }}
                        onClick={(event) => redirectToLogin(event)}
                        disabled={isLoading}
                        id="enter-btn-3"
                      >
                        {isLoading ? <LoaderLite /> : "Login to system"}
                      </Button>
                    </Col>
                  </>
                )}
                {forgotPasswordStep != 3 && (
                  <Row>
                    <p
                      style={{
                        color: colorTextSecondary,
                        ...style.passwordTexts,
                      }}
                    >
                      Return to sign-in page?{" "}
                    </p>
                    <Link href={"/auth/sign-in"}>
                      <p style={{ color: purple1, ...style.helpText }}>
                        Sign in.
                      </p>
                    </Link>
                  </Row>
                )}
              </div>
            </div>
          </Col>
        ) : (
          isMobile == null && (
            <div style={{ minHeight: "100vh", backgroundColor: colorBgBase }}>
              <div></div>
            </div>
          )
        )}
      </Row>
      <Toaster />
    </Layout>
  );
}

export default SignInPage;
