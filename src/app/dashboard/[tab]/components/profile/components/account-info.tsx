import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Divider,
  Form,
  Select,
  Modal,
  theme,
  Spin,
  message,
} from "antd";
import { IoCheckmarkCircle } from "react-icons/io5";
import ResetEmail from "./reset-email";
import ResetPassword from "./reset-password";
import getCountryCodes from "@/constants/country-codes";
import { GET_RESTAURANT } from "@/lib/queries/restaurants";
import { UPDATE_RESTAURANT } from "@/lib/mutations/restaurant";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import AccountInfoSkeleton from "@/app/components/skeletons/profile/account-info";
import style from "@/styles/profile/account";
import { isValidPhoneNumber, CountryCode } from "libphonenumber-js";
import { FaSearch } from "react-icons/fa";
import { useAuthContext } from "@/app/providers/AuthProvider";

import ConfirmationPopup from "./confirmation-popup";
import SuccessPrompt from "./successPrompt";

function AccountInfo() {
  const {
    token: {
      colorBgBase,
      colorTextBase,
      geekblue6,
      colorBgContainer,
      green1,
      colorBgContainerDisabled,
    },
  } = theme.useToken();

  const countryOptions = getCountryCodes();
  const [form] = Form.useForm();

  const [isEmailChange, setIsEmailChange] = useState<boolean>(false);

  const [isOpenEmailChangeConfirm, setIsOpenEmailChangeConfirm] =
    useState(false);
  const [isOpenPasswordChangeConfirm, setIsOpenPasswordChangeConfirm] =
    useState(false);
  const [isPasswordChange, setIsPasswordChange] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [needFetchUser, setNeedFetchUser] = useState<boolean>(false);
  const [isSucessEmail, setIsSucessEmail] = useState(false);
  const [isSucessPassword, setIsSucessPassword] = useState(false);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [contactEmail, setContactEmail] = useState("");
  const [country, setCountry] = useState<any>("");
  const [revievedCountry, setRecievedCountry] = useState<any>("");
  const [changingCountry, setChangingCountry] = useState<any>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailFromAuth, setEmailFromAuth] = useState<string>("");
  const [taxPercent, setTaxPercent] = useState<any>("");
  const [countryState, setCountryState] = useState<any>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [isFormeChanged, setIsFormeChanged] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  let restaurant_id: number | null = null;
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("lono_restaurant_id");
    if (storedId) {
      restaurant_id = parseInt(storedId, 10);
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Function to validate email
  const validateEmail = (_email: string) => {
    return emailRegex.test(_email);
  };

  const { data, refetch } = useQuery<any>(GET_RESTAURANT, {
    variables: {
      id: restaurant_id,
    },
    onCompleted: (response) => {
      if (response) {
        setName(response.getRestaurant.name);
        setAddress(response.getRestaurant.location);
        setPhone(response.getRestaurant.contact_information);
        setContactEmail(response.getRestaurant.contact_email);
        const filteredCountry =
          response.getRestaurant?.country &&
          countryOptions.find(
            (option) =>
              option.value.toLowerCase() ===
              response.getRestaurant?.country.toLowerCase()
          );

        response.getRestaurant?.country &&
          setRecievedCountry(response.getRestaurant?.country.toLowerCase());
        response.getRestaurant?.country &&
          setChangingCountry(response.getRestaurant?.country.toLowerCase());
        const sortedCountry = filteredCountry && filteredCountry.label;

        const selectedState =
          response.getRestaurant.state &&
          response.getRestaurant.state.toLowerCase().replace(/\s+/g, "-");
        selectedState && setCountryState(selectedState);

        const taxValue =
          response.getRestaurant.tax_value && response.getRestaurant.tax_value;
        taxValue && setTaxPercent(taxValue.toString());

        email && setIsEmailVerified(validateEmail(email));
        sortedCountry && setCountry(sortedCountry);

        setIsLoading(false);
      }
    },
  });

  const validatePhoneNumber = (
    phoneNumber: string,
    countryName: string | null
  ) => {
    if (data.getRestaurant.country) {
      if (isValidPhoneNumber(phoneNumber, data.getRestaurant.country)) {
        setPhoneError(null);
        return true;
      }
    }
    if (!countryName) {
      setPhoneError("Please select a country first");
      return false;
    }

    console.log("countryName", countryName);

    if (!countryName) {
      setPhoneError("Invalid country selection");
      return false;
    }
    try {
      if (
        isValidPhoneNumber(
          phoneNumber,
          countryName.toUpperCase() as CountryCode
        )
      ) {
        setPhoneError(null);
        return true;
      } else {
        setPhoneError("Invalid phone number for the selected country");
        return false;
      }
    } catch (error) {
      setPhoneError("Invalid phone number format");
      return false;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    if (selectedCountry) {
      validatePhoneNumber(newPhone, selectedCountry);
    }
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setChangingCountry(value);
    if (phone) {
      validatePhoneNumber(phone, value);
    }
  };

  const { getUserAttributes } = useAuthContext();

  useEffect(() => {
    getUserAttributes().then((res: any) => {
      if (res) {
        setEmail(res.email);
        setEmailFromAuth(res.email);
        setIsEmailVerified(res.email_verified);
      }
    });
  }, [needFetchUser]);

  const handleEmailChange = (e: any) => {
    const newEmail = e.target.value;
    if (newEmail !== emailFromAuth) {
      setIsEmailVerified(false);
    } else {
      setIsEmailVerified(true);
    }
    setEmail(newEmail);
  };

  console.log("data--------------------", data);

  useEffect(() => {
    if (data) {
      if (
        name == data.getRestaurant.name &&
        phone == data.getRestaurant.contact_information &&
        address == data.getRestaurant.location &&
        changingCountry == revievedCountry &&
        contactEmail == data.getRestaurant.contact_email
      ) {
        setIsFormeChanged(false);
      } else {
        setIsFormeChanged(true);
      }
    }
  }, [name, phone, changingCountry, address, data, contactEmail]);

  useEffect(() => {
    refetch();
  }, [isUpdated]);

  const [updateRestaurant] = useMutation(UPDATE_RESTAURANT, {
    onCompleted: (_response) => {},
  });

  const handleEmailReset = () => {
    setIsOpenEmailChangeConfirm(!isOpenEmailChangeConfirm);
    // setIsEmailChange(!isEmailChange);
  };

  const handleCloseSuccessModal = () => {
    setIsSucessPassword(false);
    setIsSucessEmail(false);
    setNeedFetchUser(!needFetchUser);
  };

  const handlecanCelingEmailChange = () => {
    setIsEmailChange(false);
    setNeedFetchUser(!needFetchUser);
  };

  const handlecanCelingPasswordChange = () => {
    setIsPasswordChange(false);
  };

  const handlePasswordReset = () => {
    setIsOpenPasswordChangeConfirm(!isOpenPasswordChangeConfirm);
    // setIsPasswordChange(!isPasswordChange);
  };

  const handleSaveRestaurant = () => {
    // Why do we need to read values from a form when
    // there are setter and getter methods available???
    const values = form.getFieldsValue();
    let countryValue = values.country.toUpperCase();
    setRecievedCountry(values.country);
    if (!validatePhoneNumber(values.phone, selectedCountry)) {
      message.error(
        "Please enter a valid phone number for the selected country"
      );
      return;
    }

    if (values.country.length > 2) {
      const countryObject = countryOptions.find(
        (option) => option.label.toLowerCase() === values.country.toLowerCase()
      );
      countryValue = countryObject ? countryObject.value : null;
    }

    try {
      form.validateFields().then(async () => {
        setIsUpdating(true);
        const response = await updateRestaurant({
          variables: {
            input: {
              id: restaurant_id,
              name: values.name,
              contact_information: values.phone,
              contact_email: contactEmail,
              location: values.address,
              country: countryValue,
            },
          },
        });

        if (response) {
          setIsUpdating(false);
          setIsUpdated(!isUpdated);
        }
      });
    } catch (_error) {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <AccountInfoSkeleton />
      ) : (
        <div
          style={{
            ...style.baseContainer,
            backgroundColor: colorBgContainer,
          }}
        >
          <Form
            form={form}
            name="accountInfo"
            layout="vertical"
            autoComplete="off"
            initialValues={{
              name: name,
              phone: phone,
              country: country,
              address: address,
              tax: taxPercent,
              country_state: countryState,
              contact_email: contactEmail,
            }}
          >
            <div
              style={{
                ...style.title,
                color: colorTextBase,
              }}
            >
              {"Account Info"}
            </div>
            <div>
              <Divider
                style={{
                  ...style.divider,
                  backgroundColor: colorTextBase,
                }}
              />
            </div>
            <div style={{ ...style.countryDiv }}>
              <Form.Item
                name="name"
                label={"Restaurant Name"}
                rules={[
                  {
                    required: true,
                    message: "Please enter the restaurant name",
                  },
                ]}
                style={{ ...style.nameItem }}
              >
                <Input
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    ...style.nameInput,
                    background: colorBgBase,
                  }}
                />
              </Form.Item>
            </div>

            <div style={{ ...style.countryDiv }}>
              <Form.Item
                name="phone"
                label={"Phone"}
                rules={[
                  {
                    required: true,
                    message: "Please enter the phone number",
                  },
                  {
                    validator: (_, value) =>
                      validatePhoneNumber(value, changingCountry)
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(phoneError || "Invalid phone number")
                          ),
                  },
                ]}
                style={{ ...style.phoneNumItem }}
                validateStatus={phoneError ? "error" : ""}
                help={phoneError}
              >
                <Input
                  onChange={handlePhoneChange}
                  placeholder="Phone number"
                  style={{
                    ...style.phoneInput,
                    background: colorBgBase,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="contact_email"
                label={"Contact email"}
                rules={[
                  {
                    type: "email",
                    message: "Please enter a valid email!",
                  },
                  {
                    required: true,
                    message: "Contact email is required!",
                  },
                ]}
                style={{ ...style.phoneNumItem }}
              >
                <Input
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Please enter contact email"
                  style={{
                    ...style.phoneInput,
                    background: colorBgBase,
                  }}
                />
              </Form.Item>
            </div>

            <div style={{ ...style.countryDiv }}>
              <Form.Item
                name="address"
                label={"Address"}
                rules={[
                  {
                    required: true,
                    message: "Please enter the restaurant address",
                  },
                ]}
                style={{ ...style.addressItem }}
              >
                <Input
                  prefix={<FaSearch style={{ marginRight: "1em" }} />}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  style={{
                    ...style.addressInput,
                    background: colorBgBase,
                  }}
                />
              </Form.Item>
              <Form.Item
                name="country"
                label={"Country"}
                rules={[
                  { required: true, message: "Please enter the country" },
                ]}
                style={{ ...style.countryItem }}
              >
                <Select
                  defaultValue="Select country"
                  onChange={handleCountryChange}
                  style={{
                    ...style.countryDropdown,
                    // border: `3px solid ${colorBgBase}`,
                  }}
                  allowClear={true}
                  showSearch={true}
                  filterOption={(input, option) =>
                    option
                      ? option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      : false
                  }
                  options={countryOptions.map((option) => ({
                    value: option.value.toLowerCase(),
                    label: option.label,
                  }))}
                />
              </Form.Item>
            </div>

            <div
              style={{
                ...style.loginTitle,
                color: colorTextBase,
              }}
            >
              {"Login Info"}
            </div>
            <div>
              <Divider
                style={{
                  ...style.loginDivider,
                  backgroundColor: colorTextBase,
                }}
              />
            </div>
            <div
              style={{
                ...style.emailDiv,
              }}
            >
              <Form.Item name="email" label={"Email"} style={{ flex: 3 }}>
                <div
                  style={{
                    ...style.emailItem,
                  }}
                >
                  <Input
                    placeholder="Email"
                    style={{
                      ...style.emailInput,
                      background: colorBgBase,
                    }}
                    value={email}
                    onChange={handleEmailChange}
                    suffix={
                      isEmailVerified && (
                        <IoCheckmarkCircle
                          style={{ ...style.emailVerifyIcon, color: green1 }}
                        />
                      )
                    }
                  />
                  {/* <MdEdit
                    style={{
                      ...style.emailEditIcon,
                      color: colorTextBase,
                    }}
                    onClick={handleEmailReset}
                  /> */}
                </div>
              </Form.Item>
              <div
                style={{
                  ...style.btnEditPwdDiv,
                }}
              >
                <Button
                  style={{
                    ...style.btnEditPwd,
                    color: geekblue6,
                  }}
                  block
                  onClick={handleEmailReset}
                  name="update-email-btn"
                >
                  Update email
                </Button>
              </div>
            </div>
            <div
              style={{
                ...style.passwordDiv,
              }}
            >
              <Form.Item name="password" label={"Password"} style={{ flex: 3 }}>
                <div
                  style={{
                    ...style.passwordItem,
                  }}
                >
                  <Input
                    placeholder="Password"
                    style={{
                      ...style.passwordInput,
                      background: colorBgBase,
                    }}
                    type="password"
                    value={"This is sample value"}
                    name="password"
                  />
                </div>
              </Form.Item>
              <div
                style={{
                  ...style.btnEditPwdDiv,
                }}
              >
                <Button
                  style={{
                    ...style.btnEditPwd,
                    color: geekblue6,
                  }}
                  block
                  onClick={handlePasswordReset}
                  name="update-password-btn"
                >
                  Update password
                </Button>
              </div>
            </div>
            <div
              style={{
                ...style.btnSaveDiv,
              }}
            >
              {/* <div
                style={{ display: "flex", gap: "1rem", justifyContent: "end" }}
              >
                <Button
                  style={{
                    color: colorTextBase,
                    backgroundColor: "transparent",
                    border: `1px solid ${colorBgContainerDisabled}`,
                    fontSize: 14,
                    height: "3rem",
                    width: "20rem",
                    fontWeight: "bold",
                  }}
                  block
                >
                  {"Back"}
                </Button> */}
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  ...style.btnSave,
                  backgroundColor: !isFormeChanged
                    ? colorBgContainerDisabled
                    : colorTextBase,
                  color: colorBgBase,
                }}
                block
                onClick={handleSaveRestaurant}
                disabled={isUpdating || !isFormeChanged}
                name="save-restaurant-btn"
              >
                {isUpdating ? (
                  <>
                    Save <Spin style={{ marginLeft: "0.5rem" }} />
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              {/* </div> */}
            </div>
          </Form>
          {isEmailChange && (
            <Modal
              centered={true}
              style={{
                ...style.modal,
              }}
              width={"fit-content"}
              open={isEmailChange}
              onCancel={handlecanCelingEmailChange}
              footer={null}
            >
              <ResetEmail
                handlecanCelingEmailChange={handlecanCelingEmailChange}
                setIsSucess={setIsSucessEmail}
              />
            </Modal>
          )}
          {isEmailChange && (
            <Modal
              centered={true}
              style={{
                ...style.modal,
              }}
              width={"fit-content"}
              open={isEmailChange}
              onCancel={handlecanCelingEmailChange}
              footer={null}
            >
              <ResetEmail
                handlecanCelingEmailChange={handlecanCelingEmailChange}
                setIsSucess={setIsSucessEmail}
              />
            </Modal>
          )}
          {isSucessEmail && (
            <Modal
              centered={true}
              style={{
                ...style.modal,
                top: 40,
              }}
              width={"fit-content"}
              open={isSucessEmail}
              onCancel={handleCloseSuccessModal}
              footer={null}
            >
              <SuccessPrompt successType="Email" />
            </Modal>
          )}
          {isSucessPassword && (
            <Modal
              centered={true}
              style={{
                ...style.modal,
                top: 40,
              }}
              width={"fit-content"}
              open={isSucessPassword}
              onCancel={handleCloseSuccessModal}
              footer={null}
            >
              <SuccessPrompt successType="Password" />
            </Modal>
          )}
          {isOpenEmailChangeConfirm && (
            <Modal
              centered={true}
              style={{
                ...style.modal,
                top: 40,
              }}
              width={"fit-content"}
              open={isOpenEmailChangeConfirm}
              onCancel={handleEmailReset}
              footer={null}
            >
              <ConfirmationPopup
                confirmationType={"email"}
                setIsEmailChange={setIsEmailChange}
                handleEmailReset={handleEmailReset}
                handlePasswordReset={handlePasswordReset}
                setIsPasswordChange={setIsPasswordChange}
              />
            </Modal>
          )}
          {isOpenPasswordChangeConfirm && (
            <Modal
              centered={true}
              style={{
                ...style.modal,
                top: 40,
              }}
              width={"fit-content"}
              open={isOpenPasswordChangeConfirm}
              onCancel={handlePasswordReset}
              footer={null}
            >
              <ConfirmationPopup
                confirmationType={"password"}
                setIsEmailChange={setIsEmailChange}
                handleEmailReset={handleEmailReset}
                handlePasswordReset={handlePasswordReset}
                setIsPasswordChange={setIsPasswordChange}
              />
            </Modal>
          )}

          {isPasswordChange && (
            <Modal
              centered={true}
              style={{
                ...style.modal,
              }}
              width={"fit-content"}
              open={isPasswordChange}
              onCancel={handlecanCelingPasswordChange}
              footer={null}
            >
              <ResetPassword
                handlecanCelingPasswordChange={handlecanCelingPasswordChange}
                setIsSucess={setIsSucessPassword}
              />
            </Modal>
          )}
        </div>
      )}
    </>
  );
}

export default AccountInfo;
