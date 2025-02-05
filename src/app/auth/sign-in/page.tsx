"use client";

import style from "../../../styles/auth/sign-in";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Layout, Button, Row, Col, Input, theme } from "antd";
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

      colorTextHeading,
      colorTextSecondary,
      purple1,

      green1,
      yellow6,

      green10,
      colorWhite,
      // colorErrorBorder,
      // colorText,
      // boxShadow,
    },
  } = theme.useToken();

  const [isMobile, setIsMobile] = useState<any>(null);
  const { isDarkMode } = useThemeContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [emailError, setEmailError] = useState("");
  // const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendOtpLoading, setIsResendOtpLoading] = useState(false);
  const { push } = useRouter();
  const {
    signInUser,
    checkIfUserIsLoggedIn,
    resendSignUpOTP,
    saveUnverifiedUser,
    isUserVerified,
  } = useAuthContext();
  const [displayEmailVerification, setDisplayEmailVerification] =
    useState(false);
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

  const toastSuccessStyle = {
    style: {
      font: "Inter",
      background: green1,
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

  const handlePasswordChange = (event: any) => {
    const inputPassword = event.target.value;
    setPassword(inputPassword);
    // setPasswordError(validatePassword(inputPassword));
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isEmailValid = (userEmail: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(userEmail);
  };

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Please enter your email.", toastStyle);
      return;
    } else if (!isEmailValid(email)) {
      toast.error("Please enter a valid email.", toastStyle);
      return;
    } else {
      setIsResendOtpLoading(true);
      saveUnverifiedUser(email);
      const resendOTP = await resendSignUpOTP(email);
      if (resendOTP.success) {
        toast.success(
          "Verification code has been sent to your email",
          toastSuccessStyle
        );
        push("/auth/emailVerification");
      } else {
        setIsResendOtpLoading(false);
        toast.error(resendOTP.error.message, toastStyle);
      }
    }
  };

  const handleLoginUser = async () => {
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
    } else if (!password) {
      toast.error("Please enter your password.", toastStyle);
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
      return;
    }

    // signin logic

    try {
      const { data: _restaurantData } = await getRestaurantByUserEmail({
        variables: {
          user_email: email.trim(),
        },
      });

      console.log("_restaurantData", _restaurantData);

      const isLoggedIn = await checkIfUserIsLoggedIn();
      console.log("isLoggedIn---------", isLoggedIn);
      if (isLoggedIn) {
        const isVerified = await isUserVerified();
        if (isVerified) {
          push("/dashboard/orders");
        } else {
          setIsLoading(false);
          setDisplayEmailVerification(true);
          toast.error("Please verify your email address", {
            style: {
              font: "Inter",
              background: colorPrimaryBg,
              color: colorTextLightSolid,
              fontSize: 16,
            },
          });
        }
      } else {
        if (_restaurantData && _restaurantData.getRestaurantByUserEmail) {
          const restaurant_id = _restaurantData.getRestaurantByUserEmail.id;
          localStorage.setItem("lono_restaurant_id", restaurant_id);
          const response = await signInUser(email, password);

          if (response.isLoggedIn) {
            push("/dashboard/orders");
          } else {
            setIsLoading(false);
            if (response.error.message === "notVerified") {
              setDisplayEmailVerification(true);
              toast.error("Please verify your email address", {
                style: {
                  font: "Inter",
                  background: colorPrimaryBg,
                  color: colorTextLightSolid,
                  fontSize: 16,
                },
              });
            } else {
              toast.error(response.error.message, {
                style: {
                  font: "Inter",
                  background: colorPrimaryBg,
                  color: colorTextLightSolid,
                  fontSize: 16,
                },
              });
            }
          }
        }
      }
    } catch (error: any) {
      if (error.message == "Restaurant not found") {
        setIsLoading(false);
        toast.error("Invalid user name", {
          style: {
            font: "Inter",
            background: colorPrimaryBg,
            color: colorTextLightSolid,
            fontSize: 16,
          },
        });
      } else {
        setIsLoading(false);
        toast.error("An error occurred", {
          style: {
            font: "Inter",
            background: colorPrimaryBg,
            color: colorTextLightSolid,
            fontSize: 16,
          },
        });
      }
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await checkIfUserIsLoggedIn();

      if (isLoggedIn) {
        const isVerified = await isUserVerified();
        if (isVerified) {
          setIsLoading(true);
          push("/dashboard/orders");
        }
      }
    };

    checkLoginStatus();
  }, []);

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

        {isMobile === true ? (
          <div
            style={{
              minHeight: "100vh",
              backgroundColor: colorBgBase,
            }}
          >
            <MobileNotice />
          </div>
        ) : (
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
        )}

        {/* Vertical line in the middle */}
        {isMobile === false && (
          <Col xs={0} sm={0} md={1} lg={1}>
            <div style={style.middleContent}>
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
                  <p
                    style={{ color: colorTextHeading, ...style.headingText }}
                    className="exo_init"
                  >
                    Start your journey with us
                  </p>
                </Row>
                <Row style={{ marginTop: "22px" }}>
                  <p
                    style={{
                      color: colorTextSecondary,
                      ...style.secondaryTexts,
                    }}
                  >
                    New to
                  </p>
                  <Image
                    src={
                      isDarkMode
                        ? "/assets/lonovm_logo.svg"
                        : "/assets/lonovm_logo.svg"
                    }
                    style={{
                      color: colorTextSecondary,
                      ...style.secondaryImg,
                    }}
                    alt="Logo"
                    width={111}
                    height={20}
                  />
                  <p
                    style={{
                      color: colorTextSecondary,
                      ...style.secondaryTexts,
                    }}
                  >
                    ?
                  </p>
                  <Link href="/auth/sign-up">
                    <p style={{ color: colorWhite, ...style.linkText }}>
                      Sign up
                    </p>
                  </Link>
                </Row>
                <p
                  style={{
                    color: colorTextSecondary,
                    ...style.secondaryTextsDescription,
                  }}
                >
                  Welcome to our restaurant management system
                  <br />
                  To get started, please enter details to sign in.
                </p>
                <Col style={style.rightCol}>
                  {/* <Row style={style.rowCenter}>
                  <Space size="large">
                    <Button
                      onClick={submitData}
                      style={{ color: colorIcon, ...style.socialButton }}
                    >
                      <MdFacebook />
                    </Button>

                    <Button
                      onClick={submitData}
                      style={{ color: colorIcon, ...style.socialButton }}
                    >
                      <FaApple />
                    </Button>

                    <Button
                      onClick={submitData}
                      style={{ color: colorIcon, ...style.socialButton }}
                    >
                      <FaGoogle />
                    </Button>
                  </Space>
                </Row>

                <Row style={style.rowCenter}>
                  <div style={style.horizontalOrLineLeft}></div>
                  <p
                    style={{
                      color: colorTextSecondary,
                      ...style.secondaryTexts,
                    }}
                  >
                    OR
                  </p>
                  <div style={style.horizontalOrLineRight}></div>
                </Row> */}

                  {/* INPUTS */}
                  <div style={style.inputsLarge}>
                    <Row style={style.inputContainer}>
                      <Input
                        // {...register("email", {
                        //   required: "Email is required",
                        //   pattern: {
                        //     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        //     message: "Invalid email format",
                        //   },
                        // })}
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
                        name="email"
                      />
                      <RxEnvelopeClosed
                        style={{
                          color: colorTextLightSolid,
                          ...style.inputIconsNonClick,
                        }}
                      />
                    </Row>

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
                        placeholder="Enter your password"
                        onChange={handlePasswordChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleLoginUser();
                          }
                        }}
                        name="password"
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
                  </div>

                  <Button
                    style={{
                      backgroundColor: green10,
                      color: colorTextLightSolid,
                      ...style.enterBtn,
                    }}
                    onClick={handleLoginUser}
                    name="login"
                    disabled={isLoading}
                  >
                    {isLoading ? <LoaderLite /> : "Enter"}
                  </Button>
                </Col>
                {displayEmailVerification && (
                  <Row>
                    <p
                      style={{
                        color: colorTextSecondary,
                        ...style.emailverificationTexts,
                      }}
                    >
                      You have not verified your email address yet?
                    </p>

                    <p
                      style={{ color: purple1, ...style.helpText }}
                      onClick={handleResendEmail}
                      id="resendOtp"
                    >
                      {isResendOtpLoading
                        ? "sending verification..."
                        : "verify now "}
                    </p>
                  </Row>
                )}

                <Row>
                  <p
                    style={{
                      color: colorTextSecondary,
                      ...style.passwordTexts,
                    }}
                  >
                    Forgot your username or password?{" "}
                  </p>
                  <Link href={"/auth/forgot-password"}>
                    <p style={{ color: colorWhite, ...style.helpText }}>
                      Let us help.
                    </p>
                  </Link>
                </Row>
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
