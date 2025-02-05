import React, { useEffect, useState } from "react";
import { Col, Row, Divider, Form, Space, Switch } from "antd";
import style from "@/styles/settings/settings";
import { UPDATE_RESTAURANT } from "@/lib/mutations/restaurant";
import { useMutation } from "@apollo/client";

interface GeneralSettingsProps {
  isOrderActive: boolean;
  settingDataLoading: boolean;
  settingsDataRefetch: any;
}

function OrderSettings({
  isOrderActive,

  settingsDataRefetch,
}: GeneralSettingsProps) {
  const [updateRestuatant] = useMutation(UPDATE_RESTAURANT);
  const [form] = Form.useForm();
  const [isChecked, setIsChecked] = useState(isOrderActive);
  const [isUpdatingOrderStatus, setIsUpdatingOrderStatus] = useState(false);

  const handleOrderingStatus = (checked: boolean) => {
    setIsUpdatingOrderStatus(true);
    setIsChecked(checked);
    try {
      form.validateFields().then(async () => {
        const restaurant_id =
          localStorage.getItem("lono_restaurant_id") &&
          parseInt(localStorage.getItem("lono_restaurant_id")!);
        const response = await updateRestuatant({
          variables: {
            input: {
              id: restaurant_id,
              ordering_active: checked,
            },
          },
        });
        if (response) {
          settingsDataRefetch().then(() => {
            setIsUpdatingOrderStatus(false);
          });
        }
      });
    } catch (_error) {}
  };
  useEffect(() => {
    setIsChecked(isOrderActive);
  }, [isOrderActive]);
  return (
    <Col style={{ height: "90vh" }}>
      {/** Business hours */}
      <Row style={style.containerRow}>
        <Row justify="space-between" align="middle" style={style.topRow}>
          <div style={style.topRowText}>Ordering</div>
        </Row>
        <Divider />
        <Row style={{ width: "100%" }}>
          <Col sm={22} style={{}}>
            <Row>
              <p style={style.orderSettingFontHead}> Ordering is </p>{" "}
              {isChecked ? (
                <div style={style.orderSettingFontHeadActive}> Active</div>
              ) : (
                <div style={style.orderSettingFontHeadInactive}> Inactive</div>
              )}
            </Row>
            <Row style={style.orderSettingFontContent}>
              {isChecked
                ? " Customer can place orders using the QR code."
                : " Please activate the Ordering to start accepting orders."}
            </Row>
          </Col>
          <Col sm={1} style={{ marginTop: "20px" }}>
            <Space direction="vertical">
              <Switch
                style={{
                  width: "6rem",
                }}
                checkedChildren="active"
                unCheckedChildren="inactive"
                defaultChecked={isChecked}
                // className="switch-right-mark" // Apply the custom class here
                onChange={(checked) => handleOrderingStatus(checked)}
                disabled={isUpdatingOrderStatus}
                id="ordering_status"
              />
            </Space>
          </Col>
        </Row>
      </Row>
    </Col>
  );
}

export default OrderSettings;
