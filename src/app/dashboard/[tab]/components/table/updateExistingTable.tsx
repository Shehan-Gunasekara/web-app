import React, { useState, useEffect } from "react";
import {
  Flex,
  Switch,
  Input,
  Form,
  Button,
  theme,
  Modal,
  Spin,
  Tooltip,
} from "antd";
import style from "@/styles/table/table-components";
import {
  MdOutlineDownload,
  MdOutlinePrint,
  MdOutlineQrCode2,
  MdTableRestaurant,
} from "react-icons/md";
import {
  // GENERATE_TABLE_QR_CODE,
  UPDATE_TABLE,
  REGENERATE_TABLE_QR_CODE,
} from "@/lib/mutations/table";
import { useMutation } from "@apollo/client";
import Image from "next/image";
import { GiWoodenChair } from "react-icons/gi";
import validation from "@/validations/menu-validation";
import { useTableContext } from "@/app/providers/TableProvider";
import Loader from "@/app/components/loarders/loarder";
import { GoCheckCircleFill } from "react-icons/go";
import { CopyOutlined } from "@ant-design/icons";
import TableUpdateSkeleton from "@/app/components/skeletons/table/table-update";
// import html2canvas from "html2canvas";
// import { jsPDF } from "jspdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import QRCodesPDF from "./table-qr";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import jsQR from "jsqr";

interface UpdateTableProps {
  tableDetails: {
    id: number;
    restaurant_id?: number;
    table_number: number;
    seating_capacity: number;
    table_status?: string;
    status?: string;
    qr_code?: string;
    is_available: boolean;
  };
  IsUpdateTableModalVisible: boolean;
  closeModal: () => any;
  tableNumbers?: any;
}

function UpdateExistingTable({
  tableDetails,
  closeModal,
  IsUpdateTableModalVisible,
  tableNumbers,
}: UpdateTableProps) {
  const {
    token: {
      colorTextBase,
      colorBgBase,
      blue9,
      colorTextDisabled,
      colorBgContainerDisabled,
      green4,
      colorTextQuaternary,
    },
  } = theme.useToken();

  const { lg, xl } = useBreakpoint();
  const { updateTableAdded } = useTableContext();

  const [status, setStatus] = useState(false);
  const [QRCode, setQRCode] = useState<any>();
  const [isSending, setIsSending] = useState(false);
  const [tableNo, setTableNo] = useState<number>();
  const [seatsNo, setSeatsNo] = useState<any>();
  const [tableLoading, setTableLoading] = useState(true);
  const [isQrGenerating, setIsQrGenerating] = useState(false);
  const [showGeneratedText, setShowGeneratedText] = useState(false);
  const [showQrCode, setShowQrCode] = useState(true);
  const [isTableNumberExists, setIsTableNumberExists] = useState(false);
  const [form] = Form.useForm();

  // const [generateTableQrCode] = useMutation<any>(GENERATE_TABLE_QR_CODE);
  const [reGenerateTableQrCode] = useMutation<any>(REGENERATE_TABLE_QR_CODE);
  const [updateTable] = useMutation<any>(UPDATE_TABLE);

  const filteredTableNumbers = tableNumbers?.filter(
    (table: any) => table !== tableDetails.table_number
  );

  useEffect(() => {
    setTableLoading(true);
    form.setFieldsValue({
      tableNumber: tableDetails.table_number,
      seatNumber: tableDetails.seating_capacity,
      status: tableDetails.is_available,
    });
    setQRCode(tableDetails.qr_code);
    setStatus(tableDetails.is_available);
    setTableNo(tableDetails.table_number);
    setSeatsNo(tableDetails.seating_capacity);
    setTableLoading(false);
  }, [tableDetails]);

  const [generateBtnClicked, setGenerateBtnClicked] = useState(false);

  //generating QR code
  const generateQRCode = async () => {
    form.validateFields(["tableNumber"]).then(async (_values) => {
      try {
        setIsQrGenerating(true);
        const restaurant_id =
          localStorage.getItem("lono_restaurant_id") &&
          parseInt(localStorage.getItem("lono_restaurant_id")!);
        const { data } = await reGenerateTableQrCode({
          variables: {
            input: {
              table_id: tableDetails.id,
              table_number: tableNo,
              restaurant_id: restaurant_id,
            },
          },
          onCompleted: () => {
            setIsQrGenerating(false);
          },
        });
        // setGenerateBtnClicked(true);
        setShowQrCode(true);
        setQRCode(data.regenerateTableQrCode.qr_code);
      } catch (_error) {
        setIsQrGenerating(false);
      }
    });
  };

  const downloadBase64Image = (base64Data: any, filename: any) => {
    const link = document.createElement("a");
    link.href = base64Data;
    link.download = filename;
    link.click();
  };

  // regenerating QR code
  const reGenerateQRCode = async () => {
    form.validateFields(["tableNumber"]).then(async (_values) => {
      try {
        setIsQrGenerating(true);
        const restaurant_id =
          localStorage.getItem("lono_restaurant_id") &&
          parseInt(localStorage.getItem("lono_restaurant_id")!);
        const { data } = await reGenerateTableQrCode({
          variables: {
            input: {
              table_id: tableDetails.id,
              table_number: tableNo,
              restaurant_id: restaurant_id,
            },
          },
          onCompleted: () => {
            setIsQrGenerating(false);
          },
        });
        setGenerateBtnClicked(true);
        setShowQrCode(false);
        setQRCode(data.regenerateTableQrCode.qr_code);
      } catch (_error) {
        setIsQrGenerating(false);
      }
    });
  };

  //updating table
  const handleSave = async () => {
    const formValues = form.getFieldsValue();
    form.validateFields().then(async (_values) => {
      setIsSending(true);
      try {
        const restaurant_id =
          localStorage.getItem("lono_restaurant_id") &&
          parseInt(localStorage.getItem("lono_restaurant_id")!);
        await updateTable({
          variables: {
            input: {
              id: tableDetails.id,
              table_number: parseInt(formValues.tableNumber),
              // status: formValues.status ? "active" : "inactive",
              is_available: status,
              seating_capacity: parseInt(formValues.seatNumber),
              qr_code: QRCode ?? null,
              restaurant_id: restaurant_id,
            },
          },
        });
        updateTableAdded();
        setTableNo(0);
        setSeatsNo(0);
        form.resetFields();
        setQRCode(undefined);
        closeModal();
      } catch (_error) {}
      setIsSending(false);
    });
  };

  // donwloading QR code
  // const downloadQRCode = () => {
  //   if (qrCodeRef.current) {
  //     html2canvas(qrCodeRef.current).then((canvas) => {
  //       const qrImage = canvas
  //         .toDataURL("image/png")
  //         .replace("image/png", "image/octet-stream");
  //       const link = document.createElement("a");
  //       link.href = qrImage;
  //       link.download = "qr-code.png";
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     });
  //   }
  // };

  // Download QR code as PDF with additional text
  // const downloadQRCodeAsPDF = () => {
  //   if (qrCodeRef.current) {
  //     html2canvas(qrCodeRef.current).then((canvas) => {
  //       const qrImage = canvas.toDataURL("image/png");

  //       // Create PDF
  //       const pdf = new jsPDF();
  //       const imgWidth = 80; // Adjust this as needed
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //       const pageWidth = pdf.internal.pageSize.getWidth();
  //       // const pageHeight = pdf.internal.pageSize.getHeight();

  //       // Add QR code image
  //       pdf.addImage(
  //         qrImage,
  //         "PNG",
  //         (pageWidth - imgWidth) / 2,
  //         20,
  //         imgWidth,
  //         imgHeight
  //       );

  //       // Add top text
  //       pdf.setFontSize(28);
  //       pdf.setFont("bold");
  //       const topText = "SCAN FOR MENU";
  //       const topTextWidth = pdf.getTextDimensions(topText).w;
  //       const topMargin = 20; // Adjust this as needed
  //       pdf.text(topText, (pageWidth - topTextWidth) / 2, topMargin);

  //       // Add bottom text
  //       pdf.setFontSize(40);
  //       pdf.setFont("bold");
  //       const bottomText = `TABLE ${tableNo}`;
  //       const bottomTextWidth = pdf.getTextDimensions(bottomText).w;
  //       const bottomMargin = imgHeight + 30; // Adjust this as needed
  //       pdf.text(bottomText, (pageWidth - bottomTextWidth) / 2, bottomMargin);

  //       // Save PDF
  //       pdf.save("qr-code.pdf");
  //     });
  //   }
  // };

  useEffect(() => {
    return () => {
      setStatus(false);
      setQRCode(undefined);
    };
  }, []);

  useEffect(() => {
    if (generateBtnClicked) {
      setShowGeneratedText(true);
      setGenerateBtnClicked(false);
    }
  }, [!isQrGenerating && QRCode && generateBtnClicked]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowGeneratedText(false);
      setShowQrCode(true);
    }, 50);

    return () => clearTimeout(timeout);
  }, [showGeneratedText]);

  const [qrURL, setQrURL] = useState("");
  useEffect(() => {
    const img = document.createElement("img");
    img.src = QRCode;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      if (context) {
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setQrURL(code.data);
        } else {
          console.log("No QR code found.");
        }
      }
    };
  }, [QRCode]);

  // const onCheckedChange = (e: any, checked: boolean) => {
  //   if (checked) {
  //     setStatus(false);
  //   } else {
  //     setStatus(true);
  //   }
  // };
  return (
    <Modal
      title="Update Table"
      style={{
        top: 80,
        right: xl ? "-27%" : lg ? "-23%" : "-15%",
        minHeight: "570px",
      }}
      open={IsUpdateTableModalVisible}
      onCancel={closeModal}
      footer={null}
    >
      {tableLoading ? (
        <TableUpdateSkeleton />
      ) : (
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          initialValues={{
            status: status,
            tableNo: tableNo,
            seats: seatsNo,
          }}
          style={{
            height: "32rem",
            minWidth: "412px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Flex vertical={true} gap={"2rem"}>
            <div style={style.addTableUpperSection}>
              {/* Table Card */}
              <div
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid ${colorTextBase}`,
                  marginTop: "1rem",
                  borderRadius: "15px",
                  padding: "1rem 1.5rem",
                  minWidth: "132px",
                  display: "flex",
                  flexDirection: "column" as "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <MdTableRestaurant color={colorTextBase} fontSize="3rem" />
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column" as "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "end",
                      }}
                    >
                      <span
                        style={{
                          color: colorTextDisabled,
                          ...style.tableTextNew,
                        }}
                      >
                        Table
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          color: colorTextDisabled,
                          fontSize: "40px",
                          fontWeight: "500",
                          lineHeight: "0.8",
                        }}
                      >
                        {/* {tableNo ? tableNo : "00"} */}
                        {tableNo
                          ? tableNo < 10
                            ? `0${tableNo}`
                            : tableNo
                          : "00"}
                      </span>
                    </div>
                  </div>

                  <div style={style.seatContent}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "0.5rem",
                        alignItems: "end",
                      }}
                    >
                      <span
                        style={{
                          color: colorTextDisabled,
                          fontSize: "14px",
                          fontWeight: "400",
                        }}
                      >
                        seats
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          color: colorTextDisabled,
                          ...style.seatsNoNew,
                        }}
                      >
                        {/* {seatsNo ? seatsNo : "00"} */}
                        {seatsNo
                          ? parseInt(seatsNo) < 10
                            ? `0${seatsNo}`
                            : seatsNo
                          : "00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column" as "column",
                  gap: "0.5rem",
                  flex: 1,
                }}
              >
                <div style={style.addTableStatus}>
                  {/* Table Status */}
                  <Form.Item
                    name="status"
                    label={
                      <div style={{ fontSize: 12, color: colorTextQuaternary }}>
                        table status
                      </div>
                    }
                    style={{
                      color: blue9,
                      fontSize: 11,
                      fontWeight: "400",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <Switch
                      style={{
                        width: "6.5rem",
                        backgroundColor: status ? green4 : colorTextDisabled,
                      }}
                      checkedChildren="available"
                      unCheckedChildren="unavailable"
                      // className="switch-right-mark"
                      onChange={setStatus}
                      disabled={
                        tableDetails.status == "occupied" ? true : false
                      }
                      id="statusSwitch"
                      // onChange={(e) => onCheckedChange(e, status)}
                    />
                  </Form.Item>
                </div>

                {/* Table Number */}
                <div>
                  <Form.Item
                    name="tableNumber"
                    label={
                      <div style={{ fontSize: 12, color: colorTextQuaternary }}>
                        table number
                      </div>
                    }
                    rules={[
                      {
                        required: true,
                        message: `Please input a table number`,
                      },
                      validation.tableNumber,
                      validation.tableNoLength,
                      {
                        validator: async (_rule, value) => {
                          const tNo = parseInt(value);
                          if (filteredTableNumbers?.includes(tNo)) {
                            setIsTableNumberExists(true);
                            throw new Error("Table number already exists");
                          } else {
                            setIsTableNumberExists(false);
                          }
                        },
                      },
                    ]}
                    style={{
                      color: blue9,
                      fontSize: 11,
                      fontWeight: "400",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <Input
                      style={{
                        border: "none",
                        height: "2rem",
                        width: "100%",
                        fontWeight: "bold",
                        paddingTop: 0,
                        marginTop: "0",
                        marginRight: "0.5rem",
                        backgroundColor: "black",
                      }}
                      placeholder="00"
                      onChange={(e) => setTableNo(parseInt(e.target.value))}
                    />
                  </Form.Item>
                  <MdTableRestaurant
                    fontSize="1.5rem"
                    style={{ position: "absolute", top: "27%", right: "12%" }}
                  />
                </div>

                {/* Table Seats */}
                <div>
                  <Form.Item
                    name="seatNumber"
                    label={
                      <div style={{ fontSize: 12, color: colorTextQuaternary }}>
                        seats
                      </div>
                    }
                    rules={[
                      {
                        required: true,
                        message: `Please input number of seats`,
                      },
                      validation.tableNumber,
                      validation.tableNoLength,
                    ]}
                    style={{
                      color: blue9,
                      fontSize: 11,
                      fontWeight: "400",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <Input
                      style={{
                        border: "none",
                        height: "2rem",
                        width: "100%",
                        fontWeight: "bold",
                        paddingTop: 0,
                        marginTop: "0",
                        marginRight: "0.5rem",
                        backgroundColor: "black",
                      }}
                      placeholder="00"
                      onChange={(e) => setSeatsNo(e.target.value)}
                    />
                  </Form.Item>
                  <GiWoodenChair
                    fontSize="1.5rem"
                    style={{
                      position: "absolute",
                      top: "39.2%",
                      right: "12%",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* QR CODE */}
            <p
              style={{
                color: colorTextQuaternary,
                fontSize: 12,
                marginBottom: -15,
                marginTop: 0,
                padding: 0,
              }}
            >
              QR Code
            </p>
            <div style={style.addTableBottomSection}>
              <div
                style={{
                  borderRadius: 15,
                  margin: 0,
                  padding: 0,
                  border: `1px solid ${colorTextDisabled}`,
                }}
              >
                {isQrGenerating ? (
                  <div style={{ margin: "60px 57px" }}>
                    <Loader />
                  </div>
                ) : QRCode ? (
                  <>
                    {showGeneratedText ? (
                      <div style={{ margin: "50px 36px" }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                            fontWeight: 600,
                            color: colorTextBase,
                          }}
                        >
                          <GoCheckCircleFill fontSize={30} />
                          <p
                            style={{
                              margin: 0,
                              padding: 0,
                            }}
                          >
                            Regenerated
                          </p>{" "}
                          <p
                            style={{
                              margin: 0,
                              padding: 0,
                            }}
                          >
                            Successfully
                          </p>
                        </div>
                      </div>
                    ) : (
                      showQrCode && (
                        <div
                          // ref={qrCodeRef}
                          style={{ background: "white", borderRadius: 15 }}
                        >
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <Image
                              src={
                                QRCode ??
                                "data:image/png;base64,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"
                              }
                              alt="qr-code"
                              width={160}
                              height={160}
                              style={{ borderRadius: 15 }}
                            />
                            <Tooltip title="Copy QR URL" defaultOpen={false}>
                              <Button
                                type="primary"
                                shape="circle"
                                icon={<CopyOutlined />}
                                style={{
                                  position: "absolute",
                                  bottom: 10,
                                  right: -20,
                                }}
                                onClick={() => {
                                  if (qrURL) {
                                    navigator.clipboard.writeText(qrURL);
                                  }
                                }}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      )
                    )}
                  </>
                ) : (
                  <MdOutlineQrCode2
                    fontSize={150}
                    style={{
                      color: colorBgContainerDisabled,
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  margin: "0.5rem 0 0.5rem 2rem",
                  gap: "1rem",
                }}
              >
                {QRCode ? (
                  <Button
                    size="large"
                    id="generateQRButton"
                    style={{
                      backgroundColor:
                        isQrGenerating || isTableNumberExists
                          ? colorTextDisabled
                          : colorTextBase,
                      color: colorBgBase,
                      fontWeight: 600,
                    }}
                    onClick={reGenerateQRCode}
                    disabled={isTableNumberExists || isQrGenerating}
                    name="regenQRBtn"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 20,
                      }}
                    >
                      {isQrGenerating ? (
                        <>
                          Regenerate QR{" "}
                          <Spin style={{ marginLeft: "0.5rem" }} />
                        </>
                      ) : (
                        "Regenerate QR"
                      )}
                      <MdOutlineQrCode2
                        fontSize={16}
                        style={{
                          position: "absolute",
                          right: 10,
                        }}
                      />
                    </div>
                  </Button>
                ) : (
                  <Button
                    size="large"
                    id="generateQRButton"
                    style={{
                      backgroundColor:
                        isQrGenerating || isTableNumberExists
                          ? colorTextDisabled
                          : colorTextBase,
                      color: colorBgBase,
                      fontWeight: 600,
                    }}
                    onClick={generateQRCode}
                    disabled={isTableNumberExists || isQrGenerating}
                    name="genQRBtn"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 20,
                      }}
                    >
                      {isQrGenerating ? "Generating..." : "Generate QR"}
                      <MdOutlineQrCode2
                        fontSize={18}
                        style={{
                          position: "absolute",
                          right: 10,
                        }}
                      />
                    </div>
                  </Button>
                )}

                <PDFDownloadLink
                  document={
                    <QRCodesPDF table_number={tableNo} qr_code={QRCode} />
                  }
                  fileName={`Table ${tableNo} QR.pdf`}
                >
                  <Button
                    size="large"
                    style={{
                      backgroundColor: QRCode
                        ? colorTextBase
                        : colorBgContainerDisabled,
                      color: colorBgBase,
                      fontWeight: 600,
                      width: "100%",
                    }}
                    disabled={QRCode ? false : true}
                    name="genPDFBtn"
                    // onClick={downloadQRCode}
                    // onClick={downloadQRCodeAsPDF}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Print QR PDF
                      <MdOutlinePrint
                        fontSize={16}
                        style={{
                          position: "absolute",
                          right: 10,
                        }}
                      />
                    </div>
                  </Button>
                </PDFDownloadLink>
                <Button
                  size="large"
                  style={{
                    backgroundColor: QRCode
                      ? colorTextBase
                      : colorBgContainerDisabled,
                    color: colorBgBase,
                    fontWeight: 600,
                    width: "100%",
                  }}
                  disabled={QRCode ? false : true}
                  onClick={() => {
                    downloadBase64Image(QRCode, `Table_${tableNo}_QR.png`);
                  }}
                  name="downloadPNGBtn"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Download QR PNG
                    <MdOutlineDownload
                      fontSize={18}
                      style={{
                        position: "absolute",
                        right: 10,
                      }}
                    />
                  </div>
                </Button>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              htmlType="submit"
              style={{
                backgroundColor:
                  isSending || isTableNumberExists
                    ? colorTextDisabled
                    : colorTextBase,
                color: colorBgBase,
                fontWeight: 600,
                alignSelf: "flex-end",
              }}
              block
              onClick={handleSave}
              disabled={isSending || isTableNumberExists}
              name="saveBtn"
            >
              {isSending ? (
                <>
                  Save <Spin style={{ marginLeft: "0.5rem" }} />
                </>
              ) : (
                "Save"
              )}
            </Button>
          </Flex>
        </Form>
      )}
    </Modal>
  );
}

export default UpdateExistingTable;
