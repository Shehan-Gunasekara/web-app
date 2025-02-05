import style from "@/styles/orders/order-modals";
import { Button, Col, Flex, Form, Modal, Row, theme } from "antd";
import React, { useEffect, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { UPDATE_ORDER_STATUS } from "@/lib/mutations/orders";
import { useMutation } from "@apollo/client";
interface OrderCancelProps {
  modalVisibility: boolean;
  orderId: number;
  orderName: string;
  orderNo: number;
  action: () => any;
  tableID: number;
}
function OrderCancel({
  modalVisibility,
  orderId,
  orderName,
  orderNo,
  action,
  tableID,
}: OrderCancelProps) {
  const {
    token: {
      colorBgBase,
      blue10,
      purple1,
      red10,
      colorInfoBg,
      colorInfoTextHover,
      colorBgContainer,
      colorTextBase,
      blue6,
    },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [selectedReson, setSeletedReason] = useState<number>();
  const [isCancelDisabled, setIsCancelDisabled] = useState(true);
  const [isCancelCompleted, setIsCancelCompleted] = useState(false);
  const resons = [
    "Out of Stock",
    "Closing Hours",
    "Minimum Order Requirement",
    "System Errors",
  ];

  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);

  const handleUpdateOrderStatus = async (
    _orderId: number,
    newStatus: string,
    reason: string,
    bounceReset?: boolean,
    isActive?: boolean,
    tableId?: number
  ) => {
    try {
      await updateOrderStatus({
        variables: {
          orderInput: {
            id: _orderId,
            status: newStatus,
            cancelled_reason: reason,
            bounce_reset: bounceReset,
            is_active: isActive,
            table_id: tableId,
            resturant_id: parseInt(
              localStorage.getItem("lono_restaurant_id") || "",
              10
            ),
          },
        },
      });
    } catch (_error) {
      console.log(_error);
    }
  };
  const hanldeResonClick = (index: number) => {
    setSeletedReason(index);
    setIsCancelDisabled(false);
  };
  const handleFormSubmit = () => {
    handleUpdateOrderStatus(
      orderId,
      "cancelled",
      resons[selectedReson!],
      false,
      false,
      tableID
    );
    setIsCancelCompleted(!isCancelCompleted);
  };
  useEffect(() => {}, []);
  return (
    <Modal
      width={"fit-content"}
      open={modalVisibility}
      onCancel={action}
      footer={null}
      style={{ padding: "0 0" }}
    >
      {!isCancelCompleted ? (
        <Flex
          vertical={true}
          justify={"center"}
          align="center"
          style={{
            backgroundColor: colorBgContainer,
            borderRadius: "15px",
            ...style.orderModals,
          }}
        >
          <Form
            form={form}
            name="validateOnly"
            layout="vertical"
            autoComplete="off"
          >
            <Flex
              vertical={true}
              align="center"
              gap={"1rem"}
              style={{
                backgroundColor: colorBgContainer,
                borderRadius: "15px",
              }}
            >
              <span
                style={{
                  color: colorInfoBg,
                  textAlign: "center",
                  ...style.deleteTitle,
                }}
              >
                Are you sure you want to <br />
                cancel the order?
              </span>
              <Flex
                justify="center"
                align="center"
                vertical={true}
                gap={"0.4rem"}
                style={{ margin: "0.5rem 0" }}
              >
                <span style={{ color: colorInfoBg, ...style.lightLabel }}>
                  Order Name: <span style={style.boldLabel}>{orderName}</span>
                </span>
                <span style={{ color: colorInfoBg, ...style.lightLabel }}>
                  Order #: <span style={style.boldLabel}>{orderNo}</span>
                </span>
              </Flex>
              <Flex
                vertical={false}
                gap="0.5rem"
                wrap="wrap"
                style={{ padding: "0 4rem", color: blue10 }}
                align="center"
                justify="center"
              >
                {resons.map((reason, index) => (
                  <div
                    key={index}
                    onClick={() => hanldeResonClick(index)}
                    style={{
                      border:
                        selectedReson == index ? `1px solid ${purple1}` : "",
                      backgroundColor: colorBgBase,
                      ...style.reasonLabel,
                    }}
                  >
                    {reason}
                  </div>
                ))}
              </Flex>
              <Flex
                vertical={false}
                gap={"0.2rem"}
                align="center"
                style={{ color: colorInfoTextHover }}
              >
                <IoIosInformationCircleOutline fontSize={"1.2rem"} />
                <span>
                  Please select a reason in order to proceed with the
                  cancellation.
                </span>
              </Flex>
              <Row gutter={16} style={{ marginTop: "2rem" }}>
                <Col className="gutter-row" span={12}>
                  <Button
                    htmlType="button"
                    size="large"
                    block
                    onClick={action}
                    style={{
                      border: `1px solid ${colorTextBase}`,
                      width: "8.438rem",
                    }}
                    name="dismiss-btn"
                  >
                    Dissmiss
                  </Button>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Button
                    htmlType="button"
                    size="large"
                    style={{
                      backgroundColor: isCancelDisabled ? blue6 : red10,
                      width: "8.438rem",
                    }}
                    block
                    onClick={handleFormSubmit}
                    disabled={isCancelDisabled}
                    name="cancel-btn"
                  >
                    <b>Yes, Cancel</b>
                  </Button>
                </Col>
              </Row>
            </Flex>
          </Form>
        </Flex>
      ) : (
        <Flex
          vertical={true}
          align="center"
          gap={"2rem"}
          style={{ padding: "4rem" }}
        >
          <span
            style={{
              color: colorInfoBg,
              textAlign: "center",
              ...style.deleteTitle,
            }}
          >
            The order #{orderNo} has been cancelled and <br />
            notified to the customer.
          </span>
          <Button
            htmlType="button"
            size="large"
            block
            onClick={action}
            style={{
              border: `1px solid ${colorTextBase}`,
              width: "8.438rem",
            }}
          >
            Dissmiss
          </Button>
        </Flex>
      )}
    </Modal>
  );
}

export default OrderCancel;
