import React, { useEffect, useRef, useState } from "react";
import {
  theme,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Select,
  Flex,
  Spin,
  Input,
} from "antd";
import { useMutation } from "@apollo/client";
import { UPDATE_RESTAURANT } from "@/lib/mutations/restaurant";
import style from "@/styles/settings/settings";
import getCurrency from "@/constants/currencies";
import getCountryCodes from "@/constants/country-codes";

interface bankSettingsProps {
  bankData: any;
  settingsDataLoading: boolean;
  settingsDataRefetch: any;
}

function BankSettings({ bankData, settingsDataLoading }: bankSettingsProps) {
  const {
    token: { colorTextBase, colorTextLightSolid, geekblue7 },
  } = theme.useToken();

  const [form] = Form.useForm();

  const countryOptions = getCountryCodes();
  const currencyOptions = getCurrency();

  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState("");

  const [currency, setCurrency] = useState("");
  const [country, setCountry] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountType, setAccountType] = useState("");

  const currencyRef = useRef(currency);
  const countryRef = useRef(country);

  useEffect(() => {
    if (bankData) {
      setCurrency(bankData.getRestaurant.currency);
      setCountry(bankData.getRestaurant.country);

      currencyRef.current = bankData.getRestaurant.currency;
      countryRef.current = bankData.getRestaurant.country;

      form.setFieldsValue({
        currency: currencyRef.current,
        country: countryRef.current,
      });
    }
  }, [bankData]);

  const [updateRestaurant] = useMutation(UPDATE_RESTAURANT);

  const onChangeCountry = (value: string) => {
    setCountry(value);
  };

  const onChangeCurrency = (value: string) => {
    setCurrency(value);
  };

  const onChangeAccountHolderName = (value: string) => {
    setAccountHolderName(value);
  };

  const onChangeAccountNumber = (value: string) => {
    setAccountNumber(value);
  };

  const onChangeRoutingNumber = (value: string) => {
    setRoutingNumber(value);
  };

  const onChangeAccountType = (value: string) => {
    setAccountType(value);
  };

  const updateRestaurantData = async () => {
    setIsLoading(true);
    const data = form.getFieldsValue();

    try {
      setOutput("Validating fields");
      form
        .validateFields()
        .then(async () => {
          //send data to stripe
          setOutput("Sending bank data to stripe API");
          const stripe = require("stripe")("sk_test_Hrs6SAopgFPF0bZXSN3f6ELN");
          const bankToken = await stripe.tokens.create({
            bank_account: {
              country: data.country,
              currency: data.currency,
              account_holder_name: data.accountHolderName,
              account_holder_type: data.accountType,
              routing_number: data.routingNumber,
              account_number: data.accountNumber,
            },
          });

          setOutput(
            "Received bank token from stripe, sending token to backend"
          );
          //send token to backend
          let restaurant_id: number | null = null;
          if (typeof window !== "undefined") {
            const storedId = localStorage.getItem("lono_restaurant_id");
            if (storedId) {
              restaurant_id = parseInt(storedId, 10);
            }
          }
          const response = await updateRestaurant({
            variables: {
              input: {
                id: restaurant_id,
                bank_token: bankToken,
              },
            },
          });
          if (response) {
            setOutput("Please check your email to validate this action");
            setIsLoading(false);
          }
        })
        .catch((error: any) => {
          setIsLoading(false);
          setOutput(error.toString());
        });
    } catch (_error: Error | any) {
      setOutput(_error.toString());
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setOutput("");
    setCurrency("");
    setCountry("");
    setAccountHolderName("");
    setAccountNumber("");
    setRoutingNumber("");
    setAccountType("");
  };

  return (
    <Col style={{ height: "100%" }}>
      <Form
        form={form}
        name="generalSettingsForm"
        layout="vertical"
        autoComplete="off"
        initialValues={{}}
      >
        <Row style={style.containerRow}>
          <Row justify="space-between" align="middle" style={style.topRowTwo}>
            <div style={style.topRowText}>Bank Account</div>
          </Row>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginTop: "20px" }}
          >
            <div>
              LONO VM does NOT store any banking details on our server. Your
              banking data will be sent directly to{" "}
              <a href="https://stripe.com">Stripe</a> for secure storage, and
              the resulting reference token will be used to direct customer
              payments into your account
            </div>
          </Row>

          <Divider />

          <Row justify="space-between" align="top" style={style.insideRow}>
            <Form.Item
              name="country"
              label={"Country"}
              rules={[
                {
                  required: true,
                  message: "Please select the country",
                },
              ]}
            >
              {!settingsDataLoading && countryOptions && (
                <Select
                  placeholder={country || "Select the country"}
                  style={{ width: "260px", ...style.select }}
                  // allowClear={true}
                  showSearch={true}
                  className="select-tax"
                  // disabled={valueTax === 2 || isAddTaxManually}
                  filterOption={(
                    input: string,
                    option?: { value: string; label: string }
                  ) => (option ? option.label.indexOf(input) >= 0 : false)}
                  options={countryOptions.map((option) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  onChange={onChangeCountry}
                />
              )}
            </Form.Item>
          </Row>

          <Row justify="space-between" align="middle" style={style.insideRow}>
            <Form.Item
              name="currency"
              label={"Currency"}
              rules={[
                {
                  required: true,
                  message: "Please select the curency",
                },
              ]}
            >
              {!settingsDataLoading && currencyOptions && (
                <Select
                  style={style.select}
                  showSearch={true}
                  placeholder={currency || "Select the currency"}
                  filterOption={(
                    input: string,
                    option?: { value: string; label: string }
                  ) => (option ? option.label.indexOf(input) >= 0 : false)}
                  options={currencyOptions.map((option) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  onChange={onChangeCurrency}
                />
              )}
            </Form.Item>
          </Row>

          <Row justify="space-between" align="middle" style={style.insideRow}>
            <Form.Item
              name="accountType"
              label={"Account type"}
              rules={[
                {
                  required: true,
                  message: "Please select the type of account",
                },
              ]}
            >
              {!settingsDataLoading && (
                <Select
                  style={style.select}
                  showSearch={true}
                  placeholder={accountType || "Select the account type"}
                  filterOption={(
                    input: string,
                    option?: { value: string; label: string }
                  ) =>
                    option
                      ? option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      : false
                  }
                  options={[
                    { value: "individual", label: "Individual" },
                    { value: "business", label: "Business" },
                  ]}
                  onChange={onChangeAccountType}
                />
              )}
            </Form.Item>
          </Row>

          <Row justify="space-between" align="top" style={style.insideRow}>
            <Form.Item
              name="accountHolderName"
              label={"Account holder name"}
              rules={[
                {
                  required: true,
                  message: "Please enter your name",
                },
              ]}
            >
              {!settingsDataLoading && (
                <Input
                  placeholder={accountHolderName || "John Smith"}
                  style={style.select}
                  onChange={(e) => {
                    onChangeAccountHolderName(e.target.value);
                  }}
                />
              )}
            </Form.Item>
          </Row>

          <Row justify="space-between" align="top" style={style.insideRow}>
            <Form.Item
              name="routingNumber"
              label={"Routing number / Transit number"}
              rules={[
                {
                  required: true,
                  message: "Please enter the routing number",
                },
                {
                  pattern: /^[0-9]+(?:\.[0-9]+)?$/,
                  message: "Only numbers are allowed!",
                },
              ]}
            >
              {!settingsDataLoading && (
                <Input
                  placeholder={routingNumber || "110000000"}
                  style={style.select}
                  onChange={(e) => {
                    onChangeRoutingNumber(e.target.value);
                  }}
                />
              )}
            </Form.Item>
          </Row>

          <Row justify="space-between" align="top" style={style.insideRow}>
            <Form.Item
              name="accountNumber"
              label={"Account number"}
              rules={[
                {
                  required: true,
                  message: "Please enter the account number",
                },
                {
                  pattern: /^[0-9]+(?:\.[0-9]+)?$/,
                  message: "Only numbers are allowed!",
                },
              ]}
            >
              {!settingsDataLoading && (
                <Input
                  placeholder={accountNumber || "000123456789"}
                  style={style.select}
                  onChange={(e) => {
                    onChangeAccountNumber(e.target.value);
                  }}
                />
              )}
            </Form.Item>
          </Row>
        </Row>

        <Divider />
        {/** Buttons */}
        <Row justify={"end"}>
          <Flex
            gap={20}
            style={{
              width: "50%",
            }}
            justify={"start"}
          >
            {output && (
              <div
                style={{
                  background: "transparent",
                  color: colorTextBase,
                  height: 55,
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                {output}
              </div>
            )}
          </Flex>
          <Flex
            gap={20}
            style={{
              width: "50%",
            }}
            justify={"end"}
          >
            <Button
              style={{
                background: "transparent",
                color: colorTextBase,
                border: `2px solid ${geekblue7}`,
                ...style.buttons,
              }}
              name="discard-btn"
              onClick={resetForm}
            >
              Discard
            </Button>
            <Button
              style={{
                background: colorTextBase,
                color: colorTextLightSolid,
                ...style.buttons,
              }}
              onClick={updateRestaurantData}
              name="apply-btn"
            >
              {isLoading ? (
                <div>
                  Apply
                  <Spin style={{ marginLeft: "0.5rem" }} />
                </div>
              ) : (
                "Apply"
              )}
            </Button>
          </Flex>
        </Row>
      </Form>
    </Col>
  );
}

export default BankSettings;
