"use client";

import { useState, useEffect, useRef } from "react";
import { MdCheck } from "react-icons/md";
import style from "@/styles/auth/verification";
import { Layout, Button, Row, Col, theme, Input, GetProps } from "antd";
import Image from "next/image";
import { useThemeContext } from "../../providers/ThemeProvider";
import MobileNotice from "@/app/components/mobile-notice";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { Toaster, toast } from "react-hot-toast";
import LoaderLite from "@/app/components/loader-lite";
import { useRouter } from "next/navigation";
type OTPProps = GetProps<typeof Input.OTP>;
function VerificationPage() {
  const {
    token: {
      colorBgBase,
      colorPrimaryBg,
      colorTextLightSolid,
      green10,
      colorTextHeading,
      green1,
      colorTextSecondary,
      colorTextTertiary,
    },
  } = theme.useToken();
  const [otp, setOtp] = useState("");
  const [isMobile, setIsMobile] = useState<any>(null);
  const { isDarkMode } = useThemeContext();
  const [isLoading, setIsLoading] = useState(false);
  const deviceWidth = useWindowWidth();
  const [isVerified, setIsVerified] = useState(false);
  const [otpCountDownStarted, setOtpCountDownStarted] = useState(false);
  const [otpCountDown, setOtpCountDown] = useState("");
  const { resendSignUpOTP, confirmSignUpWithOTP, unverifiedUser } =
    useAuthContext();
  const countDown = useRef(60);
  const { push } = useRouter();

  const toastSuccessStyle = {
    style: {
      font: "Inter",
      background: green1,
      color: colorTextLightSolid,
      fontSize: 16,
    },
  };

  const toastStyle = {
    style: {
      font: "Inter",
      background: colorPrimaryBg,
      color: colorTextLightSolid,
      fontSize: 16,
    },
  };

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }
  const resendOtp = async () => {
    const resendOTP = await resendSignUpOTP(unverifiedUser);
    if (resendOTP.success) {
      toast.success(
        "Verification code has been sent to your email",
        toastSuccessStyle
      );
      countDown.current = 60;
      setOtpCountDownStarted(true);
      const interval = setInterval(() => {
        if (countDown.current === 0) {
          setOtpCountDownStarted(false);
          clearInterval(interval);
        }
        countDown.current -= 1;
        setOtpCountDown(formatTime(countDown.current));
      }, 1000);
    } else {
      toast.error(resendOTP.error.message, toastStyle);
    }
  };

  const handleSignin = () => {
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

  const verifyEmailAddress = async () => {
    setIsLoading(true);
    const verifyEmail = await confirmSignUpWithOTP(unverifiedUser, otp);
    if (verifyEmail.success) {
      setIsVerified(true);
      toast.success(
        "you have successfully verified your email",
        toastSuccessStyle
      );
      setIsLoading(false);
    } else {
      toast.error(verifyEmail.error.message, toastStyle);

      setIsLoading(false);
    }
  };

  const onChange: OTPProps["onChange"] = (text) => {
    setOtp(text);
  };

  const sharedProps = {
    onChange,
  };

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
          <Col xs={0} sm={0} md={1} lg={1}>
            <div style={style.middleContent}>
              <div style={style.verticalLine}></div>
            </div>
          </Col>
        )}

        {/* Right side content */}
        {isMobile === false ? (
          <Col xs={11} sm={11} md={11} lg={11}>
            <div style={style.rightContent}>
              <div style={style.columnCenter}>
                {isVerified ? (
                  <>
                    <div style={style.eclipseContainer}>
                      <div style={style.rowCenter}>
                        <Image
                          src="/assets/ellipse-large.svg"
                          alt="Ellipse"
                          width={130}
                          height={130}
                        />
                        <MdCheck
                          style={{ color: green1, ...style.checkIcon }}
                          size={80}
                        />
                      </div>
                    </div>

                    <h1
                      style={{
                        color: colorTextHeading,
                        ...style.headingTextThin,
                      }}
                    >
                      Verification Success!
                    </h1>

                    <p
                      style={{
                        color: colorTextHeading,
                        ...style.paragraphTexts,
                      }}
                    >
                      Congrats and welcome to Lono.
                      <br />
                      Now you can log in to Lono.
                    </p>

                    <Button
                      style={{
                        backgroundColor: green10,
                        color: colorTextLightSolid,
                        ...style.loginBtn,
                      }}
                      onClick={handleSignin}
                      id="login-btn"
                    >
                      Login
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <h1
                        style={{
                          color: colorTextHeading,
                          ...style.headingText,
                        }}
                        className="exo_init"
                      >
                        Verify you email
                      </h1>
                      <Row style={style.rowCenter}>
                        <p
                          style={{
                            color: colorTextSecondary,
                            ...style.paragraphTextsFormFive,
                          }}
                        >
                          We have sent a verification code to your email. Please
                          enter the verification code below to verify your
                          email.
                        </p>
                      </Row>

                      <div style={style.otpContainer}>
                        <Input.OTP
                          formatter={(str) => str.toUpperCase()}
                          {...sharedProps}
                          length={6}
                          id="otp-input"
                        />{" "}
                      </div>

                      <Row style={style.rowCenter}>
                        <Button
                          style={{
                            backgroundColor: green10,
                            color: colorTextLightSolid,
                            ...style.loginBtn,
                          }}
                          onClick={verifyEmailAddress}
                          disabled={otp.length < 6 || isLoading}
                          id="verify-btn"
                        >
                          {isLoading ? <LoaderLite /> : "Verify"}
                        </Button>
                      </Row>
                      {!otpCountDownStarted ? (
                        <Row style={style.otpTextContainer}>
                          <p
                            style={{
                              color: colorTextTertiary,
                              ...style.noteParagraph,
                            }}
                          >
                            Didn&apos;t receive the code?
                          </p>
                          <p
                            style={{
                              color: colorTextTertiary,
                              ...style.otpResend,
                            }}
                            onClick={resendOtp}
                          >
                            {" "}
                            <u>Click here</u>{" "}
                          </p>{" "}
                          <p
                            style={{
                              color: colorTextTertiary,
                              ...style.noteParagraph,
                            }}
                          >
                            to resend the verification code.
                          </p>
                        </Row>
                      ) : (
                        <Row style={style.otpTextContainer}>
                          <p
                            style={{
                              color: colorTextTertiary,
                              ...style.noteParagraph,
                            }}
                          >
                            Resend the OTP again in {otpCountDown}.
                          </p>
                        </Row>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <></>
          </Col>
        ) : (
          isMobile == null && (
            <div style={{ minHeight: "100vh", backgroundColor: colorBgBase }}>
              <div></div>
            </div>
          )
        )}
      </Row>{" "}
      <Toaster />
    </Layout>
  );
}

export default VerificationPage;
