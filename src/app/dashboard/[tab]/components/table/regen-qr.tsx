import style from "@/styles/orders/order-modals";
import { Button, Col, Flex, Form, Modal, Row, theme } from "antd";
import React, { useState } from "react";
// import { UPDATE_ORDER_STATUS } from "@/lib/mutations/orders";
// import { useMutation } from '@apollo/client';
import { useTableContext } from "@/app/providers/TableProvider";
import Loader from "@/app/components/loarders/loarder";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { REGENERATE_ALL_QR_CODES } from "@/lib/mutations/table";
import { useMutation } from "@apollo/client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import QRCodesPDF from "./qr-pdf";

interface RegenQRProps {
  qrDetails?: any;
}
function RegenQR({ qrDetails }: RegenQRProps) {
  const {
    token: {
      red10,
      colorInfoBg,
      colorInfoTextHover,
      colorBgContainer,
      colorTextBase,
      blue7,
      colorWhite,
    },
  } = theme.useToken();
  const { isRegenerateQrModalVisible, handleRegenerateQrModal } =
    useTableContext();
  const [form] = Form.useForm();
  const [isRegenCompleted, setIsRegenCompleted] = useState(false);
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

  const [regenQr, { loading: regenLoading }] = useMutation(
    REGENERATE_ALL_QR_CODES
  );

  const handleRegenQr = async () => {
    try {
      const restaurant_id =
        localStorage.getItem("lono_restaurant_id") &&
        parseInt(localStorage.getItem("lono_restaurant_id")!);
      await regenQr({
        variables: {
          restId: restaurant_id,
        },
      });
    } catch (_error) {}
  };

  const handleFormSubmit = async () => {
    setCurrentStep(1);

    await handleRegenQr();
    if (!regenLoading) {
      setIsRegenCompleted(!isRegenCompleted);
      setCurrentStep(2);
    }
    // setTimeout(() => {
    //   setIsRegenCompleted(!isRegenCompleted);
    //   setCurrentStep(2)
    // }, 3000);

    // setIsRegenCompleted(!isRegenCompleted);
  };

  return (
    <Modal
      width={"576px"}
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
              gap={"4rem"}
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

              <Flex
                vertical={true}
                justify={"center"}
                align="center"
                gap={"1rem"}
              >
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
                    >
                      <b>Regenerate</b>
                    </Button>
                  </Col>
                </Row>
              </Flex>
            </Flex>
          </Form>
        </Flex>
      ) : currentStep == 1 && !isRegenCompleted ? (
        <Flex
          vertical={true}
          align="center"
          gap={"2rem"}
          style={{
            backgroundColor: colorBgContainer,
            borderRadius: "15px",
            padding: "4rem",
          }}
        >
          <span
            style={{
              color: colorInfoBg,
              textAlign: "center",
              ...style.deleteTitle,
            }}
          >
            Regenerating...
          </span>
          {!isRegenCompleted && <Loader />}
          <Flex vertical={true}>
            <span
              style={{
                color: colorInfoBg,
                textAlign: "center",
                ...style.deleteTitle,
                fontSize: "16px",
              }}
            >
              Do not close the window.
            </span>
            <span
              style={{ color: colorInfoBg, fontSize: "14px", fontWeight: 300 }}
            >
              Please wait until the process is completed{" "}
            </span>
          </Flex>
        </Flex>
      ) : (
        currentStep == 2 &&
        isRegenCompleted && (
          <Flex
            vertical={true}
            align="center"
            gap={"2rem"}
            style={{
              backgroundColor: colorBgContainer,
              borderRadius: "15px",
              padding: "4rem",
            }}
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
            <IoIosCheckmarkCircle size={"50px"} />
            <Flex
              vertical={true}
              justify={"center"}
              align="center"
              gap={"1rem"}
            >
              <span
                style={{
                  color: colorInfoTextHover,
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: 300,
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
                  >
                    <PDFDownloadLink
                      style={{ color: blue7 }}
                      document={<QRCodesPDF qrDetails={qrDetails} />}
                      fileName={"qr_codes.pdf"}
                    >
                      {/* {({ loading: loadingPdf }) =>
                        loadingPdf ? (
                          <p style={{ margin: 0, fontWeight: 600 }}>
                            Export all QRs
                          </p>
                        ) : (
                          <p style={{ margin: 0, fontWeight: 600 }}>
                            Export all QRs
                          </p>
                        )
                      } */}{" "}
                      Export all QRs
                    </PDFDownloadLink>
                  </Button>
                </Col>
              </Row>
            </Flex>
          </Flex>
        )
      )}
    </Modal>
  );
}

export default RegenQR;
