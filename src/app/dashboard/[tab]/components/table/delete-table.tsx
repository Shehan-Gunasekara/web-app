import style from "@/styles/orders/order-modals";
import { Button, Col, Flex, Form, Modal, Row, theme } from "antd";
import React, { useState } from "react";
// import { UPDATE_ORDER_STATUS } from "@/lib/mutations/orders";
// import { useMutation } from '@apollo/client';
import { useTableContext } from "@/app/providers/TableProvider";
import Loader from "@/app/components/loarders/loarder";

function DeleteTable() {
  const {
    token: {
      // colorBgBase,
      // blue10,
      // purple1,
      red10,
      colorInfoBg,
      colorInfoTextHover,
      colorBgContainer,
      colorTextBase,
      // blue6,
      blue7,
      colorWhite,
    },
  } = theme.useToken();
  const { isRegenerateQrModalVisible, handleRegenerateQrModal } =
    useTableContext();
  const [form] = Form.useForm();
  const [isDeleteCompleted, setIsDeleteCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);

  // const handleUpdateOrderStatus = async (
  //   _orderId: string,
  //   newStatus: string,
  //   reason:string,
  //   bounceReset?:boolean,
  //   isActive?:boolean
  // ) => {
  //   try {
  //     const { data } = await updateOrderStatus({
  //       variables: {
  //         orderInput: {
  //           id: _orderId,
  //           status: newStatus,
  //           cancelled_reason:reason,
  //           bounce_reset:bounceReset,
  //           is_active:isActive
  //         },
  //       },
  //     });

  //   } catch (error) {
  //   }
  // };

  const handleFormSubmit = () => {
    setCurrentStep(1);

    setTimeout(() => {
      setIsDeleteCompleted(!isDeleteCompleted);
      setCurrentStep(2);
    }, 3000);

    // setIsDeleteCompleted(!isDeleteCompleted);
  };

  return (
    <Modal
      width={"fit-content"}
      open={isRegenerateQrModalVisible}
      onCancel={handleRegenerateQrModal}
      footer={null}
    >
      {currentStep == 0 ? (
        <Flex
          vertical={true}
          justify={"center"}
          align="center"
          style={{
            backgroundColor: colorBgContainer,
            borderRadius: "15px",
            ...style.orderModals,
            minHeight: "20.188rem",
            padding: "1.5rem",
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
                Regenerating all QR codes will overwrite the current ones that
                may already be in use.
              </span>
              {/* <Flex justify='center' align='center' vertical={true} gap={"0.4rem"} style={{margin:"0.5rem 0"}}>
                    <span style={{color:colorInfoBg,...style.lightLabel}}>Order Name: <span style={style.boldLabel}>{orderName}</span></span>
                    <span style={{color:colorInfoBg,...style.lightLabel}}>Order #: <span style={style.boldLabel}>{orderNo}</span></span>
                </Flex> */}

              <Flex
                vertical={false}
                align="center"
                style={{ color: colorInfoTextHover, fontSize: "16px" }}
              >
                <span>Do you still wish to proceed?.</span>
              </Flex>
              <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                  <Button
                    htmlType="button"
                    size="large"
                    block
                    onClick={handleRegenerateQrModal}
                    style={{
                      border: `1px solid ${colorTextBase}`,
                      width: "8.438rem",
                    }}
                    name="cancel-btn"
                  >
                    Cancel
                  </Button>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Button
                    htmlType="button"
                    size="large"
                    style={{
                      backgroundColor: red10,
                      width: "8.438rem",
                    }}
                    block
                    onClick={handleFormSubmit}
                    name="regenerate-btn"
                  >
                    <b>Regenerate</b>
                  </Button>
                </Col>
              </Row>
            </Flex>
          </Form>
        </Flex>
      ) : currentStep == 1 && !isDeleteCompleted ? (
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
            Do not close the window.
          </span>
          {!isDeleteCompleted && <Loader />}
          <span
            style={{
              color: colorInfoBg,
              textAlign: "center",
              ...style.deleteTitle,
            }}
          >
            Please wait until the process is completed
          </span>
        </Flex>
      ) : (
        currentStep == 2 &&
        isDeleteCompleted && (
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
              All QR codes have been regenerated successfully.
            </span>
            <span
              style={{
                color: colorInfoBg,
                textAlign: "center",
                ...style.deleteTitle,
              }}
            >
              Do you wish to export all QR codes?
            </span>
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <Button
                  htmlType="button"
                  size="large"
                  block
                  onClick={handleRegenerateQrModal}
                  style={{
                    border: `1px solid ${colorTextBase}`,
                    width: "8.438rem",
                  }}
                  name="cancel-btn"
                >
                  Cancel
                </Button>
              </Col>
              <Col className="gutter-row" span={12}>
                <Button
                  htmlType="button"
                  size="large"
                  style={{
                    backgroundColor: colorWhite,
                    width: "8.438rem",
                    color: blue7,
                  }}
                  block
                  onClick={() => {}}
                  name="regenerate-btn"
                >
                  <b>Export All QRs</b>
                </Button>
              </Col>
            </Row>
          </Flex>
        )
      )}
    </Modal>
  );
}

export default DeleteTable;
