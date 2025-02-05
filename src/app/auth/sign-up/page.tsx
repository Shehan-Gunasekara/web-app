"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import style from "@/styles/auth/sign-up";
import {
  Layout,
  Button,
  Row,
  Col,
  Input,
  theme,
  Checkbox,
  Form,
  Upload,
} from "antd";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoChevronBackOutline } from "react-icons/io5";
import { FaPen } from "react-icons/fa";
import { GoCircle } from "react-icons/go";
import {
  MdLocationPin,
  MdAttachFile,
  MdCheck,
  MdPhotoSizeSelectActual,
} from "react-icons/md";
import { PiForkKnifeFill } from "react-icons/pi";
import { AiFillShop } from "react-icons/ai";
import { BiSolidEnvelope } from "react-icons/bi";
import Link from "next/link";
import { useThemeContext } from "../../providers/ThemeProvider";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import LoaderLite from "@/app/components/loader-lite";
import { Toaster, toast } from "react-hot-toast";
import MobileNotice from "@/app/components/mobile-notice";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import { useMutation } from "@apollo/client";
import { CREATE_RESTAURANT } from "@/lib/mutations/restaurant";
import { UPLOAD_IMAGE } from "@/lib/mutations/file";
import axios from "axios";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import type { GetProps } from "antd";
import { GET_RESTAURANT_BY_USER_EMAIL } from "@/lib/mutations/restaurant";

type OTPProps = GetProps<typeof Input.OTP>;

// import CircleComponent from "../components/circle";

function SignUpPage() {
  const {
    token: {
      colorBgBase,
      colorPrimaryBg,
      colorTextLightSolid,
      green10,
      yellow6,
      colorIcon,
      colorTextHeading,
      colorTextSecondary,
      colorTextTertiary,
      purple1,
      green1,
      green2,
      blue1,
      colorBgContainerDisabled,
    },
  } = theme.useToken();

  const ALLOWED_TYPES = ["image/jpeg", "image/png"]; // Allowed image types

  const [isMobile, setIsMobile] = useState<any>(null);
  const { isDarkMode } = useThemeContext();
  const [activeForm, setActiveForm] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpCountDown, setOtpCountDown] = useState("");
  const [otpCountDownStarted, setOtpCountDownStarted] = useState(false);
  const { signUpUser, resendSignUpOTP, confirmSignUpWithOTP } =
    useAuthContext();
  const { push } = useRouter();
  const countDown = useRef(60);

  const deviceWidth = useWindowWidth();

  //INPUTS
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [createRestaurant] = useMutation<any>(CREATE_RESTAURANT);
  const [getRestaurantByUserEmail] = useMutation<any>(
    GET_RESTAURANT_BY_USER_EMAIL
  );
  const isImageTypeAllowed = (file: File) => ALLOWED_TYPES.includes(file.type);
  const [fileName, setFileName] = useState("");

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const resizeAndCropImage = (file: File, maxSize: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const size = Math.min(img.width, img.height);
        canvas.width = maxSize;
        canvas.height = maxSize;

        if (ctx) {
          ctx.drawImage(
            img,
            (img.width - size) / 2,
            (img.height - size) / 2,
            size,
            size,
            0,
            0,
            maxSize,
            maxSize
          );

          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
              });
              resolve(resizedFile);
            } else {
              reject(new Error("Canvas is empty"));
            }
          }, file.type);
        } else {
          reject(new Error("Canvas context is not available"));
        }
      };
      img.onerror = reject;
    });
  };

  const handleImageUpload = async (info: any) => {
    const file: any = info.file;

    if (file) {
      if (!isImageTypeAllowed(file)) {
        alert("Only JPG and PNG files are allowed.");
        return;
      }
      try {
        const resizedImage = await resizeAndCropImage(file, 512);
        setImage(new File([resizedImage], file.name, { type: file.type }));
        setImageFileUrl(`restaurant_pic/${file.name}`);
        setFileName(file.name);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleBackClick = () => {
    if (activeForm == 1) {
      push("/auth/sign-in");
    } else {
      setActiveForm(activeForm - 1);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

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

  // Function to handle file upload
  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const handleFileUpload = async (file: any) => {
    const response = await uploadImage({
      variables: {
        input: {
          file_name: file.name,
          folder_name: "restaurant_pic",
          file_extension: file.type,
        },
      },
    });
    const signedURL = response.data.getFileUploadUrl;
    await axios.put(signedURL, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    setImageFileUrl("restaurant_pic/" + file.name);
  };

  const isEmailValid = (userEmail: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(userEmail);
  };

  const isPasswordValid = (userPassword: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(userPassword);
  };

  const handleSignupClick = async () => {
    //field validation

    if (!isChecked) {
      toast.error(
        "Please accept the terms and conditions to continue",
        toastStyle
      );

      return;
    }

    const missingFields = [];
    if (!restaurantName) missingFields.push("Restaurant Name");
    if (!email) missingFields.push("Email");
    if (!password) missingFields.push("Password");

    //missing
    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`,
        toastStyle
      );
      return;

      //email wrong
    } else if (!isEmailValid(email)) {
      toast.error("Please enter a valid email.", toastStyle);
      return;
    } else if (!isChecked) {
      //password wrong
    } else if (!isPasswordValid(password)) {
      toast.error(
        "Password should contain atleast one uppercase, one lowercase and one numeric.",
        toastStyle
      );
      return;
    }

    //signup logic
    setIsLoading(true);
    const response = await signUpUser(email, password);

    if (response.isSignedUp) {
      if (image) {
        await handleFileUpload(image as File);
      }
      const { data: _createData } = await createRestaurant({
        variables: {
          input: {
            name: restaurantName.trim(),
            user_name: restaurantName.trim(),
            user_email: email.trim(),
            location: address.trim(),
            ...(image && { image: imageFileUrl }), //only adds if exists
          },
        },
      });
      if (_createData.createRestaurant) {
        const restaurant_id = _createData.createRestaurant.id;
        localStorage.setItem("lono_restaurant_id", restaurant_id);
        toast.success(
          "Account confirmation link has been sent to email. Please verify your email before login.",
          toastSuccessStyle
        );

        setActiveForm(5);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error("Error while account create", toastStyle);
      }
    } else {
      setIsLoading(false);
      toast.error(response.error.message, toastStyle);
    }

    setIsLoading(false);
  };

  const handleClickSignIn = () => {
    setIsLoading(true);
    push("/auth/sign-in");
  };

  const verifyEmailAddress = async () => {
    setIsLoading(true);
    const verifyEmail = await confirmSignUpWithOTP(email, otp);
    if (verifyEmail.success) {
      setActiveForm(6);
      toast.success(
        "Verification code has been sent to your email",
        toastSuccessStyle
      );
      setIsLoading(false);
    } else {
      toast.error(verifyEmail.error.message, toastStyle);
      setIsLoading(false);
    }
  };
  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }
  const resendOtp = async () => {
    const resendOTP = await resendSignUpOTP(email);
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
  const onChange: OTPProps["onChange"] = (text) => {
    setOtp(text);
  };

  const sharedProps = {
    onChange,
  };

  const formOneOnFinish = () => {
    setActiveForm(2);
    setIsLoading(false);
  };

  const addressFormFinish = () => {
    setActiveForm(3);
    setIsLoading(false);
  };

  const validateEmail = async (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error("Please input your email!"));
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      return Promise.reject(new Error("The input is not a valid email!"));
    }
    try {
      const { data: _restaurantData } = await getRestaurantByUserEmail({
        variables: {
          user_email: value,
        },
      });

      if (_restaurantData.getRestaurantByUserEmail) {
        return Promise.reject(new Error("This email is already registered!"));
      }
    } catch (e) {
      return Promise.resolve();
    }
  };

  const validatePassowrd = async (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error("Please input your password!"));
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(value)) {
      return Promise.reject(
        new Error(
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long."
        )
      );
    }
    return Promise.resolve();
  };

  const [initialeForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const handleSubmit = () => {
    setIsLoading(true);
    if (activeForm == 1) {
      initialeForm
        .validateFields()
        .then(() => {
          formOneOnFinish();
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else if (activeForm == 2) {
      addressForm
        .validateFields()
        .then(() => {
          addressFormFinish();
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else if (activeForm == 3) {
      setActiveForm(4);
      setIsLoading(false);
    } else if (activeForm == 4) {
      handleSignupClick();
    }
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
              <div
                style={{
                  border:
                    activeForm >= 1
                      ? `1px solid ${green2}`
                      : `1px solid ${colorBgContainerDisabled}`,
                  ...style.initialeVerticalLine,
                }}
              ></div>
              <div style={style.flexContainer}>
                <GoCircle
                  style={{
                    color:
                      activeForm == 1
                        ? colorIcon
                        : activeForm > 1
                        ? green2
                        : colorBgContainerDisabled,
                    ...style.circleIcon,
                  }}
                />
                <PiForkKnifeFill
                  style={{
                    color:
                      activeForm == 1
                        ? colorIcon
                        : activeForm > 1
                        ? green2
                        : colorBgContainerDisabled,
                    ...style.verticleIcons,
                  }}
                />
              </div>
              <div
                style={{
                  border:
                    activeForm >= 2
                      ? `1px solid ${green2}`
                      : `1px solid ${colorBgContainerDisabled}`,
                  ...style.verticalLineMiddle,
                }}
              ></div>
              <div style={style.flexContainer}>
                <GoCircle
                  style={{
                    color:
                      activeForm == 2
                        ? colorIcon
                        : activeForm > 2
                        ? green2
                        : colorBgContainerDisabled,
                    ...style.circleIcon,
                  }}
                />
                <MdLocationPin
                  style={{
                    color:
                      activeForm == 2
                        ? colorIcon
                        : activeForm > 2
                        ? green2
                        : colorBgContainerDisabled,
                    ...style.verticleIcons,
                  }}
                />
              </div>
              <div
                style={{
                  border:
                    activeForm >= 3
                      ? `1px solid ${green2}`
                      : `1px solid ${colorBgContainerDisabled}`,
                  ...style.verticalLineMiddle,
                }}
              ></div>
              <div style={style.flexContainer}>
                <GoCircle
                  style={{
                    color:
                      activeForm == 3
                        ? colorIcon
                        : activeForm > 3
                        ? green2
                        : colorBgContainerDisabled,
                    ...style.circleIcon,
                  }}
                />
                <MdPhotoSizeSelectActual
                  style={{
                    color:
                      activeForm == 3
                        ? colorIcon
                        : activeForm > 3
                        ? green2
                        : colorBgContainerDisabled,
                    ...style.verticleIcons,
                  }}
                />
              </div>
              <div
                style={{
                  border:
                    activeForm == 4
                      ? `1px solid ${green2}`
                      : `1px solid ${colorBgContainerDisabled}`,
                  ...style.verticalLineMiddle,
                }}
              ></div>
              <div style={style.flexContainer}>
                <GoCircle
                  style={{
                    color:
                      activeForm == 4
                        ? colorIcon
                        : activeForm > 4
                        ? green2
                        : colorBgContainerDisabled,
                    ...style.circleIcon,
                  }}
                />
                <FaPen
                  style={{
                    color:
                      activeForm == 4
                        ? colorIcon
                        : activeForm > 4
                        ? green2
                        : colorBgContainerDisabled,
                    ...style.verticleIcons,
                  }}
                />
              </div>{" "}
              <div
                style={{
                  border:
                    activeForm == 5
                      ? `1px solid ${green2}`
                      : `1px solid ${colorBgContainerDisabled}`,
                  ...style.verticalLineMiddle,
                }}
              ></div>
              {/* Form 2 */}
              <div style={style.flexContainer}>
                <GoCircle
                  style={{
                    color:
                      activeForm == 5
                        ? colorIcon
                        : activeForm > 4
                        ? green2
                        : colorBgContainerDisabled,
                    ...style.circleIcon,
                  }}
                />
                <MdOutlineMarkEmailRead
                  style={{
                    color:
                      activeForm == 5
                        ? colorIcon
                        : activeForm > 5
                        ? green2
                        : colorBgContainerDisabled,
                    ...style.verticleIcons,
                  }}
                />
              </div>
              {activeForm == 6 && (
                <>
                  <div
                    style={{
                      border:
                        activeForm == 6
                          ? `1px solid ${green2}`
                          : `1px solid ${colorBgContainerDisabled}`,
                      ...style.verticalLineMiddle,
                    }}
                  ></div>
                  <div style={style.flexContainer}>
                    <GoCircle
                      style={{
                        color: green2,
                        ...style.circleIcon,
                      }}
                    />
                    <MdCheck style={{ color: green2, ...style.tickIcon }} />
                  </div>
                </>
              )}
            </div>
          </Col>
        )}

        {/* Sign-in form on the right */}
        {isMobile === false ? (
          <Col xs={11} sm={11} md={11} lg={11}>
            <div style={style.rightContent}>
              <div>
                <div>
                  <h1
                    style={{ color: colorTextHeading, ...style.headingText }}
                    className="exo_init"
                  >
                    Sign up for Lono
                  </h1>
                  {/* Form 1 */}
                  {activeForm == 1 && (
                    <div>
                      <Row style={style.rowCenter}>
                        <p
                          style={{
                            color: colorTextSecondary,
                            ...style.paragraphTexts,
                          }}
                        >
                          Please enter the following information to register
                          your restaurant
                        </p>
                      </Row>

                      <div style={style.columnCenter}>
                        <Form
                          form={initialeForm}
                          name="basic"
                          initialValues={{ remember: true }}
                          onFinish={formOneOnFinish}
                          style={{ width: "100%", marginLeft: "70px" }}
                        >
                          <Row style={style.inputContainer}>
                            <Form.Item
                              name="restaurantName"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input the restaurant name!",
                                },
                              ]}
                              style={{
                                width: "100%",
                                marginBottom: "0px",
                              }}
                            >
                              <Input
                                value={restaurantName}
                                style={{
                                  color: colorTextLightSolid,
                                  backgroundColor: yellow6,
                                  ...style.inputField,
                                }}
                                placeholder="Restaurant Name"
                                onChange={(e) =>
                                  setRestaurantName(e.target.value)
                                }
                                suffix={
                                  <AiFillShop
                                    style={{
                                      color: colorTextLightSolid,
                                      ...style.inputIcons,
                                    }}
                                  />
                                }
                              />
                            </Form.Item>
                          </Row>

                          <Row style={style.inputContainer}>
                            <Form.Item
                              name="email"
                              rules={[{ validator: validateEmail }]}
                              style={{
                                width: "100%",
                                marginBottom: "0px",
                                marginTop: "0px",
                              }}
                            >
                              <Input
                                value={email}
                                style={{
                                  color: colorTextLightSolid,
                                  backgroundColor: yellow6,
                                  ...style.inputField,
                                }}
                                placeholder="E-mail"
                                onChange={(e) => setEmail(e.target.value)}
                                suffix={
                                  <BiSolidEnvelope
                                    style={{
                                      color: colorTextLightSolid,
                                      ...style.inputIcons,
                                    }}
                                  />
                                }
                              />
                            </Form.Item>
                          </Row>

                          <Row style={style.inputContainer}>
                            <Form.Item
                              name="password"
                              rules={[{ validator: validatePassowrd }]}
                              style={{
                                width: "23.5rem",
                                marginBottom: "0px",
                                marginTop: "0px",
                              }}
                            >
                              <Input.Password
                                value={password}
                                type={showPassword ? "text" : "password"}
                                style={{
                                  color: colorTextLightSolid,
                                  backgroundColor: yellow6,
                                  ...style.inputField,
                                }}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                iconRender={(visible) =>
                                  visible ? (
                                    <IoMdEye
                                      style={{
                                        color: colorTextLightSolid,
                                        ...style.inputIconsClick,
                                      }}
                                      onClick={handleShowPassword}
                                    />
                                  ) : (
                                    <IoMdEyeOff
                                      style={{
                                        color: colorTextLightSolid,
                                        ...style.inputIconsClick,
                                      }}
                                      onClick={handleShowPassword}
                                    />
                                  )
                                }
                              />
                            </Form.Item>
                          </Row>
                        </Form>
                      </div>
                    </div>
                  )}
                  {activeForm == 2 && (
                    <div>
                      <Row style={style.rowCenter}>
                        <p
                          style={{
                            color: colorTextSecondary,
                            ...style.paragraphTexts,
                          }}
                        >
                          Please enter the restaurant address
                        </p>
                      </Row>

                      <div style={style.columnCenter}>
                        <Form
                          form={addressForm}
                          name="basic"
                          initialValues={{ remember: true }}
                          onFinish={addressFormFinish}
                          style={{ width: "100%", marginLeft: "70px" }}
                        >
                          <Row style={style.inputContainer}>
                            <Form.Item
                              name="restaurantAddress"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Please input the restaurant address!",
                                },
                              ]}
                              style={{
                                width: "100%",
                                marginBottom: "0px",
                              }}
                            >
                              <Input
                                value={address}
                                style={{
                                  color: colorTextLightSolid,
                                  backgroundColor: yellow6,
                                  ...style.inputField,
                                }}
                                placeholder="Enter restaurant address"
                                onChange={(e) => setAddress(e.target.value)}
                                suffix={
                                  <MdLocationPin
                                    style={{
                                      color: colorTextLightSolid,
                                      ...style.inputIcons,
                                    }}
                                  />
                                }
                              />
                            </Form.Item>
                          </Row>
                        </Form>
                      </div>
                    </div>
                  )}
                  {/* Form 3 */}
                  {activeForm == 3 && (
                    <div>
                      <Row style={style.rowCenter}>
                        <p
                          style={{
                            color: colorTextSecondary,
                            ...style.paragraphTexts,
                          }}
                        >
                          Upload your restaurant logo
                        </p>
                      </Row>

                      <div style={style.columnCenter}>
                        <Row style={style.inputContainer}>
                          <Input
                            style={{
                              color: colorTextLightSolid,
                              backgroundColor: yellow6,
                              ...style.inputField,
                            }}
                            placeholder="Select a logo file..."
                            value={fileName}
                            readOnly
                            name="logo"
                          />
                          <Upload
                            onChange={handleImageUpload}
                            fileList={[]}
                            defaultFileList={[]}
                            name="logo"
                            beforeUpload={() => false}
                            showUploadList={false}
                          >
                            <div
                              style={{
                                backgroundColor: blue1,
                                ...style.attachIcon,
                              }}
                            >
                              <MdAttachFile
                                style={{
                                  color: colorIcon,
                                  ...style.fileInputIcon,
                                }}
                              />
                            </div>
                          </Upload>
                        </Row>
                      </div>
                    </div>
                  )}
                  {activeForm == 4 && (
                    <Col style={style.columnCenter}>
                      <div style={style.policyContainer}>
                        <Row>
                          <p
                            style={{
                              color: colorTextSecondary,
                              ...style.secondaryTextsOne,
                            }}
                          >
                            By continuing, you agree to Lono’s
                          </p>
                          <Link href="/auth/sign-up">
                            <p
                              style={{
                                color: purple1,
                                ...style.linkTextOne,
                              }}
                            >
                              Terms of Service
                            </p>
                          </Link>
                          <p
                            style={{
                              color: colorTextSecondary,
                              ...style.secondaryTextsOne,
                            }}
                          >
                            and
                          </p>
                        </Row>
                        <Row>
                          <p
                            style={{
                              color: colorTextSecondary,
                              ...style.secondaryTexts,
                            }}
                          >
                            acknowledge Lono’s
                          </p>
                          <Link href="/auth/sign-up">
                            <p
                              style={{
                                color: purple1,
                                ...style.linkText,
                              }}
                            >
                              Privacy Policy.
                            </p>
                          </Link>
                        </Row>
                        <p
                          style={{
                            color: colorTextSecondary,
                            ...style.policyText,
                          }}
                        >
                          Lono VM Restaurant Management App revolutionizes the
                          way restaurants operate by offering a comprehensive
                          suite of tools designed to streamline every aspect of
                          the dining experience. From efficient order management
                          to seamless table reservations, Lono VM empowers
                          restaurants to deliver exceptional service while
                          maximizing efficiency.
                          <br />
                          <br />
                          With intuitive interfaces and powerful analytics,
                          restaurant owners can gain valuable insights into
                          customer preferences and operational performance,
                          allowing them to make data-driven decisions that drive
                          success. Whether managing multiple locations or
                          fine-tuning menu offerings, Lono VM provides the tools
                          needed to thrive in today competitive restaurant
                          industry.
                          <br />
                          <br />
                          With Lono VM Restaurant Management App, restaurateurs
                          can take control of their operations like never
                          before. Say goodbye to manual order taking and
                          paper-based reservations – Lono VM automates these
                          processes, freeing up staff to focus on delivering
                          top-notch customer service.
                        </p>
                        <Row style={style.rowCenter}>
                          <div style={style.checkboxContainer}>
                            <Checkbox
                              checked={isChecked}
                              onChange={handleCheckboxChange}
                            />{" "}
                          </div>
                          <p
                            style={{
                              color: colorTextHeading,
                              ...style.termsText,
                            }}
                          >
                            I Accept Terms and Conditions
                          </p>
                        </Row>{" "}
                      </div>
                    </Col>
                  )}
                  {activeForm == 5 && (
                    <>
                      <div>
                        <h1
                          style={{
                            color: colorTextHeading,
                            ...style.headingTextThin,
                          }}
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
                            We have sent a verification code to your email.
                            Please enter the verification code below to verify
                            your email.
                          </p>
                        </Row>

                        <div style={style.otpContainer}>
                          <Input.OTP
                            formatter={(str) => str.toUpperCase()}
                            {...sharedProps}
                            length={6}
                            id="otp"
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
                            name="verify-email"
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
                  {activeForm == 6 && (
                    <>
                      <div>
                        <h1
                          style={{
                            color: colorTextHeading,
                            ...style.headingTextThin,
                          }}
                        >
                          Thank you
                        </h1>
                        <h1
                          style={{
                            color: colorTextHeading,
                            ...style.headingTextThin,
                          }}
                        >
                          for registering with Lono!
                        </h1>

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

                        <Row style={style.rowCenter}>
                          <p
                            style={{
                              color: colorTextSecondary,
                              ...style.paragraphTextsFormFive,
                            }}
                          ></p>
                        </Row>

                        <Row style={style.rowCenter}>
                          <Button
                            style={{
                              backgroundColor: colorPrimaryBg,
                              color: colorTextLightSolid,
                              ...style.loginBtn,
                            }}
                            onClick={handleClickSignIn}
                            name="sign-in"
                          >
                            {isLoading ? <LoaderLite /> : "Sign in"}
                          </Button>
                        </Row>
                      </div>
                    </>
                  )}
                </div>

                {activeForm <= 4 && (
                  <Row style={style.rowCenter}>
                    <div
                      style={
                        activeForm < 4
                          ? style.btnContainer
                          : style.btnContainerFour
                      }
                    >
                      <Button
                        style={{
                          color: colorBgContainerDisabled,
                          ...style.backBtn,
                        }}
                        onClick={handleBackClick}
                        name="back-click"
                      >
                        <IoChevronBackOutline />
                      </Button>

                      <Button
                        style={{
                          backgroundColor: green10,
                          color: colorTextLightSolid,
                          ...style.nextBtn,
                        }}
                        onClick={handleSubmit}
                        disabled={(activeForm == 4 && !isChecked) || isLoading}
                        name="handle-submit"
                      >
                        {activeForm > 3 ? "Sign up" : "Next"}
                        {isLoading && <LoaderLite />}
                      </Button>
                    </div>
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

export default SignUpPage;
