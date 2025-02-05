/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Flex, Switch, Tabs, Input, Form, Button, theme, Tooltip } from "antd";
import TableBtn from "./tableBtn";
import style from "@/styles/table/table-components";
import { MdOutlineQrCode2, MdTableRestaurant } from "react-icons/md";
import { CopyOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import Image from "next/image";
import { GENERATE_TABLE_QR_CODE, UPDATE_TABLE } from "@/lib/mutations/table";
import { useMutation } from "@apollo/client";
import TableInfo from "./tableInfo";
import LoaderLite from "@/app/components/loader-lite";
import jsQR from "jsqr";

interface UpdateTableProps {
  tableDetails: {
    id: number;
    restaurant_id?: number;
    table_number?: number;
    seating_capacity?: number;
    status?: string;
    qr_code?: string;
    session_id?: string;
    session_start_time?: string;
    session_elapsed_time?: string;
  };
  closeModal: () => any;
}
function UpdateTable({ tableDetails, closeModal }: UpdateTableProps) {
  const {
    token: {
      colorBorder,
      blue10,
      colorInfoActive,
      blue9,
      colorTextBase,
      colorBgBase,
    },
  } = theme.useToken();

  const [form] = Form.useForm();

  const [updateTable] = useMutation<any>(UPDATE_TABLE);

  const [tableNumber, setTableNumber] = useState(
    tableDetails.table_number ?? 1
  );
  const [status, setStatus] = useState(
    tableDetails.status?.toLowerCase() === "active"
  );

  const [QRCode, setQRCode] = useState(tableDetails.qr_code);
  const [isSending, setIsSending] = useState(false);

  const [generateTableQRCode] = useMutation<any>(GENERATE_TABLE_QR_CODE);

  const downloadQRCode = (url: string) => {
    const link = document.createElement("a");
    link.download = "qr.png";
    link.href = url;
    link.click();
  };

  const regenerateQRCode = async () => {
    const { data } = await generateTableQRCode({
      variables: {
        id: tableDetails.id,
      },
    });
    setQRCode(data.generateTableQrCode.qr_code);
  };

  const handleSave = async () => {
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
              table_number: tableNumber,
              status: status ? "active" : "inactive",
              qr_code: QRCode ?? null,
              restaurant_id: restaurant_id,
            },
          },
        });
        form.resetFields();
        setQRCode(undefined);
        closeModal();
      } catch (_error) {}
      setIsSending(false);
    });
  };

  useEffect(() => {
    if (tableDetails) {
      setTableNumber(tableDetails.table_number ?? 1);
      setStatus(tableDetails.status?.toLowerCase() === "active");
      setQRCode(tableDetails.qr_code);
    }
    return () => {
      setTableNumber(0);
      setStatus(false);
      setQRCode(undefined);
    };
  }, [tableDetails]);

  const [qrURL, setQrURL] = useState("");
  useEffect(() => {
    if (!QRCode) return;
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

  return (
    tableDetails && (
      <div style={style.modal}>
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="Table settings" key="1" style={{ width: "25.75rem" }}>
              <Flex vertical={true} gap={"3rem"}>
                <div style={style.addTableUpperSection}>
                  <TableInfo tableNumber={tableNumber} status={status} />
                  <div style={style.addTableUpperSectionSecondary}>
                    <div style={style.addTableStatus}>
                      <Form.Item
                        name="status"
                        label="Table status"
                        style={{
                          color: blue9,
                          fontSize: "0.75rem",
                          fontWeight: "400",
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        <Switch
                          style={{ width: "6.5rem" }}
                          checkedChildren="active"
                          unCheckedChildren="inactive"
                          // className="switch-right-mark"
                          onChange={setStatus}
                        />
                      </Form.Item>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Form.Item
                          label="Table name"
                          name="table_name"
                          rules={[{ required: true }]}
                          style={{
                            color: blue9,
                            fontSize: "0.75rem",
                            fontWeight: "400",
                            margin: 0,
                            padding: 0,
                          }}
                        >
                          <Input
                            placeholder="01"
                            onChange={(e) =>
                              setTableNumber(parseInt(e.target.value))
                            }
                            value={tableNumber}
                            style={{
                              border: "none",
                              height: "2.5rem",
                              fontWeight: "bold",
                              marginRight: "0.5rem",
                            }}
                            name="table_number"
                          />
                        </Form.Item>

                        <MdTableRestaurant fontSize="1.5rem" />
                      </div>
                    </div>
                  </div>
                </div>
                <Flex vertical={true} gap={"1rem"}>
                  <span
                    style={{ color: colorInfoActive, ...style.updateLabelF }}
                  >
                    QR code
                  </span>
                  <Flex vertical={false} gap={"2rem"}>
                    <div
                      style={{ position: "relative", display: "inline-block" }}
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
                    <div>
                      <TableBtn
                        minWidth="10.25rem"
                        btnText="Print QR"
                        action={() =>
                          downloadQRCode(
                            QRCode ??
                              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPQAAAD0CAYAAACsLwv+AAAAAklEQVR4AewaftIAABGfSURBVO3BQW5su45FwWXB8/E2AXP+bTYIzsjVZUuAcDL97lcx4uPr++eXMcYVFmOMayzGGNdYjDGusRhjXGMxxrjGYoxxjcUY4xqLMcY1FmOMayzGGNdYjDGusRhjXGMxxrjGYoxxjcUY4xqfPFQZ/CWZ80qVwY7M6SqDTuZ0lcGOzNmpDDqZ01UGnczpKoMnZE5XGXQyp6sMOpnzX6oMdmTOicrgL8mcJxZjjGssxhjXWIwxrvHJi8mcV6oMTlQGJ2TOE5XBE5XBCZmzI3O6yqCTOSdkzonKYEfmdJXBjszpKoNO5pyoDDqZc0LmvFJl8EqLMcY1FmOMayzGGNf45M0qgxMy50RlsCNznqgMOpnTVQYnKoMTlcGOzOkqgxOVwQmZsyNzusrghMw5URnsyJyuMnilyuCEzHmnxRjjGosxxjUWY4xrfPL/TGWwI3N2KoMnZM5OZdDJnBMyZ6cy2JE5XWXQVQadzNmROV1l0Mmcncqgkzk7lUFXGXQyp6sMOpnzv2wxxrjGYoxxjcUY4xqfXEbmnJA5OzKnqwx2ZM5OZdDJnE7mdJVBJ3O6yuCVKoMdmdNVBp3M2ZE5J2ROVxl0MucJmXOTxRjjGosxxjUWY4xrfPJmMucvVQZ/SeackDk7lUEnc07InBOVwYnKoJM5XWVwQuZ0lcGOzOkqg07mdJXBO8mcf8lijHGNxRjjGosxxjU+ebHK4L8kc7rKoJM5XWXQyZyuMuhkTlcZdDKnqww6mdNVBp3M6SqDTuacqAw6mbMjc7rKoJM5XWXQyZyuMuhkTlcZdDKnqwzeqTLoZM5OZfAvW4wxrrEYY1xjMca4xicPyZx/SWVwQuZ0lcFOZdDJnBOVQSdzTlQGJ2TOEzKnqww6mXOiMtipDP6SzNmROf9LFmOMayzGGNdYjDGu8fH1/fPLA5VBJ3O6yuCVZM5OZdDJnK4y2JE5XWXQyZwnKoMdmbNTGfwlmfNEZdDJnK4y6GTOv6QyeCWZ806LMcY1FmOMayzGGNf4+Pr++eWByqCTOTuVwY7M2akMdmROVxl0MqerDDqZ01UGryRzusrghMx5ojJ4JZlzojI4IXOeqAw6mbNTGXQy50Rl0MmcrjLYkTlPLMYY11iMMa6xGGNc45MXqwyeqAyeqAw6mfOXZM5OZXBC5jxRGXQyZ6cy6GTOE5VBJ3O6yqCTOV1l0MmcncqgkzknZE5XGXQyp6sMnpA5r7QYY1xjMca4xmKMcY1PXkzmdJVBJ3N2KoNO5nSVwY7M2akMOplzQuZ0lcETMqerDE5UBp3M6WTOX6oMOpnTVQYnZE5XGfwlmdNVBp3M6SqDHZnTVQadzHliMca4xmKMcY3FGOMaH1/fP7+8UGXwTjKnqwyekDldZbAjc/5SZdDJnJ3KYEfmdJVBJ3N2KoNO5uxUBq8kc05UBp3M6SqDV5I5XWVwQuY8sRhjXGMxxrjGYoxxjU8eqgw6mbNTGezInJ3KYEfmnKgMOplzojLYkTldZXBC5uxUBp3M2akMdiqDTubsVAYnZM5OZdDJnK4y2JE5O5VBJ3O6yqCTOV1l0MmcrjL4Ly3GGNdYjDGusRhjXOPj6/vnlzeqDHZkTlcZnJA5XWWwI3O6yqCTOTuVQSdzdiqDHZnTVQYnZM5OZbAjc3Yqg07mdJVBJ3N2KoNO5nSVwQmZ806VQSdzusrghMx5p8UY4xqLMcY1FmOMa3x8ff/88ocqgx2Z80Rl0Mmcncqgkzn/ksrgCZnTVQadzNmpDJ6QOU9UBk/InK4yeCWZ01UGnczZqQw6mfPEYoxxjcUY4xqLMcY1Pr6+f355oDI4IXNOVAbvJHOeqAw6mbNTGZyQOV1l0MmcrjLYkTldZdDJnJ3KoJM5JyqDJ2TOicqgkzldZfCEzNmpDE7InCcWY4xrLMYY11iMMa7xyYvJnK4yOFEZdDKnqwx2ZM6JyqCTOTuVwU5lcELmdJVBVxl0MqerDHZkzhOVQSdzuspgR+ackDldZdBVBjsy54TMOVEZdJXBCZnzTosxxjUWY4xrLMYY1/jkzWTOCZnTVQadzOkqg1eqDE7InK4y6GROVxmckDk7MqerDHYqg07m7MicHZnzX5I5OzJnpzJ4JZlzojLoZM4TizHGNRZjjGssxhjX+Pj6/vnlgcrghMzpKoMdmdNVBp3M2akMOpmzUxl0MqerDHZkzonKoJM5O5XBjszZqQx2ZE5XGTwhc05UBidkTlcZdDLnRGVwQuZ0lcGOzOkqg07mPLEYY1xjMca4xmKMcY1P/nGVwb9E5uxUBidkTlcZdDKnkzldZbBTGXQy54TMeaIyOCFzusqgkzldZXCiMnhC5nSVwY7M6SqDd1qMMa6xGGNcYzHGuMbH1/fPLw9UBp3M6SqDEzLnlSqDTuZ0lUEnc7rK4AmZ01UGOzJnpzLYkTmvVBl0MqerDHZkTlcZdDKnqwyekDlPVAadzHmiMuhkzjstxhjXWIwxrrEYY1zj4+v755cHKoMnZE5XGezInJ3KoJM5O5VBJ3OeqAw6mdNVBidkTlcZvJLM6SqDTuacqAx2ZE5XGXQy50RlsCNzusqgkzk7lUEnc7rK4ITMeafFGOMaizHGNRZjjGt88mYyp6sMTsicEzJnpzLoZE5XGZyQOZ3M6SqDTuacqAw6mdNVBp3M+UuVwY7M6SqDE5VBJ3N2ZM4TlUEnc7rKoJM5JyqDHZnzxGKMcY3FGOMaizHGNT6+vn9+eaAy6GTOTmXwTjKnqww6mdNVBp3M2akMTsicrjLoZM6JyuAvyZyuMuhkTlcZ7MicrjLoZM5OZbAjc7rKoJM5XWXwSjKnqww6mdNVBp3MeWIxxrjGYoxxjcUY4xofX98/v7xQZfCEzDlRGXQyZ6cyeELmdJXBEzKnqwx2ZE5XGXQy50Rl8ITMOVEZ7MicV6oMTsicE5VBJ3NOVAadzHliMca4xmKMcY3FGOMan7yZzNmpDHYqg07mvJLM6SqDncpgR+bsVAZ/qTLoZM4JmXOiMtiROV1lsFMZdDLnL1UGncw5URnsyJxXWowxrrEYY1xjMca4xsfX988vD1QGnczZqQx2ZM6JymBH5jxRGXQy50RlsCNznqgMOplzojLoZM4TlUEnc05UBp3M6SqDHZlzojLoZM6JymBH5vylxRjjGosxxjUWY4xrfHx9//zyQpVBJ3N2KoNXkjldZdDJnK4y6GTOO1UGOzJnpzL4SzKnqwx2ZE5XGTwhc05UBv8lmdNVBp3MeafFGOMaizHGNRZjjGt88lBlcKIy6GTOv6Qy+Esyp6sMdmROVxl0MmenMuhkTlcZdJVBJ3O6ymBH5nSVwStVBk/InJ3KoJM5XWWwI3N2KoNO5jyxGGNcYzHGuMZijHGNT96sMniiMtiROTsyp6sMnpA5f0nmdJVBJ3OeqAx2ZE5XGZyoDDqZ01UGJyqDTua8UmXwSpVBJ3M6mfNKizHGNRZjjGssxhjX+OTFZM5OZbBTGXQyp6sMTlQGnczZqQw6mfNOlcETlcGOzNmROTuVwY7M6SqDEzLnicqgkzldZdDJnK4yOFEZ7FQGnczpKoNO5rzSYoxxjcUY4xqLMcY1Pr6+f355oDLoZE5XGezInK4y2JE5O5XBjszpKoNO5uxUBjsyp6sMTsicE5VBJ3NOVAYnZE5XGXQyp6sMXknmPFEZdDKnqwx2ZM6JyuCEzHliMca4xmKMcY3FGOMaH1/fP7+8UGXQyZx3qgw6mdNVBk/InJ3KoJM5O5XBjszZqQxOyJyuMtiROV1l8ITM6SqDTuZ0lUEnc05UBjsyp6sMTsicrjLoZE5XGezInFdajDGusRhjXGMxxrjGx9f3zy8PVAadzNmpDDqZs1MZ7MicV6oMOplzojLoZE5XGZyQOTuVQSdzdiqDJ2ROVxk8IXN2KoMdmdNVBp3M6SqDTuZ0lUEnc3Yqgx2Z85cWY4xrLMYY11iMMa7xyUMy54TM6SqDHZnTVQY7lcEJmfNfkjldZdBVBk9UBp3M2akMOpnTVQY7MqerDJ6QOTuVwROVwU5l8E6VQSdznliMMa6xGGNcYzHGuMYnD1UGnczpKoMdmbNTGXQy5wmZ01UGnczZqQx2ZM4TMqerDHZkzo7MeaIy2JE5XWVwojLoZM5OZdDJnJ3KoJM5XWWwI3O6ymBH5nSVwY7MeaXFGOMaizHGNRZjjGt88mKVQSdzusrghMzpKoMdmdNVBjsyp6sMTsicrjLYkTldZdDJnFeqDP6SzOkqg07m7FQGJyqDTua8UmWwI3O6yqCTOV1l8E6LMcY1FmOMayzGGNf45M0qg53KoJM5XWWwI3NeSebsVAY7MqerDF5J5pyQOV1lsCNznqgMOpnTVQadzDkhc07InB2Z01UGnczpKoOuMuhkzn9pMca4xmKMcY3FGOMaH1/fP7+8UGWwI3O6yqCTOTuVwQmZs1MZdDKnqwzeSeZ0lcGOzNmpDE7InJ3KoJM5XWXQyZyuMuhkzjtVBp3M6SqDTubsVAadzOkqg07m7FQGOzLnicUY4xqLMcY1FmOMa3zyxyqDTuZ0lcGOzHmiMtipDDqZ01UGnczZqQw6mdNVBp3M6SqDncpgR+Z0lUFXGTwhc3ZkTlcZnJA5XWXQyZxO5uzInL9UGfylxRjjGosxxjUWY4xrfPJQZfBEZbAjc3YqgxMy50Rl0MmcrjLYkTldZbBTGXQyp6sMOpmzUxnsyJydymCnMtiROZ3MeULmnKgMdmROVxn8L1uMMa6xGGNcYzHGuMbH1/fPLw9UBjsyp6sMnpA5O5XBv0TmdJVBJ3O6ymBH5rxSZdDJnFeqDJ6QOV1l0MmcrjLoZM4rVQadzOkqg07m/KXFGOMaizHGNRZjjGt8fH3//PJClcGOzHmiMuhkzhOVQSdzdiqDHZlzojLoZE5XGXQy50RlsCNzusrgCZlzojJ4QuZ0lUEnc7rKYEfmdJVBJ3NeqTLoZM4TizHGNRZjjGssxhjX+Pj6/vnlD1UGnczZqQw6mdNVBjsy54nKoJM5JyqDTubsVAb/JZnTVQadzHmiMuhkTlcZdDLnnSqDd5I5O5VBJ3OeWIwxrrEYY1xjMca4xid/TOackDnvVBl0MmenMtiROTuVwRMyp6sMOplzojLoKoN3kjlPVAYnZM4JmXOiMuhkTlcZdDLnnRZjjGssxhjXWIwxrvHJQ5XBX5I5ncw5URmckDldZXBC5nSVQSdzusqgkzlPVAadzNmROTuVQSdzdiqDHZnTyZyuMtiROTuVwROVQSdzdiqDTuZ0lUEnc15pMca4xmKMcY3FGOMan7yYzHmlymCnMjghc7rKoKsMdmROVxnsVAY7lUEnc3YqgxMy54nK4AmZ01UGXWVwQuZ0lcEJmdNVBjsy55VkzjstxhjXWIwxrrEYY1zjkzerDE7InL8kc16pMuhkTlcZdDKnqww6mXOiMnglmXOiMuhkTidzusrgCZnTVQZPVAZPyJyuMtiROa+0GGNcYzHGuMZijHGNT/6fqQx2ZM5OZfCEzNmROTsy550qg07mdJVBJ3M6mbNTGZyQOV1l8E4y54nKoJM5XWXQVQadzHliMca4xmKMcY3FGOMan1xG5pyoDHYqg07m7FQGJyqDTuZ0lcGOzOkqgxMy54TM2akMdmROVxl0MqerDHZkzonKoJM5XWWwI3O6yqCTOTsy550WY4xrLMYY11iMMa7xyZvJnHeSOTuVwY7M6SqDTuZ0lUEnc3Yqgx2Zc0LmdJVBJ3O6yuCVKoNO5jwhc56oDJ6oDHZkzonKoJM5XWXQyZxXWowxrrEYY1xjMca4xsfX988vD1QGf0nmdJXBK8mcrjLoZE5XGezInK4y6GROVxnsyJydymBH5nSVQSdzTlQGnczpKoMnZM4TlUEnc7rK4JVkTlcZdDLnnRZjjGssxhjXWIwxrvHx9f3zyxjjCosxxjUWY4xrLMYY11iMMa6xGGNcYzHGuMZijHGNxRjjGosxxjUWY4xrLMYY11iMMa6xGGNcYzHGuMZijHGN/wOiYrPvPUejawAAAABJRU5ErkJggg=="
                          )
                        }
                      />
                      <TableBtn
                        minWidth="10.25rem"
                        btnText="Reassign QR"
                        btnIcon={<MdOutlineQrCode2 />}
                        action={regenerateQRCode}
                      />
                    </div>
                  </Flex>
                </Flex>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  style={{
                    backgroundColor: colorTextBase,
                    color: colorBgBase,
                  }}
                  block
                  onClick={handleSave}
                  name="save-btn"
                >
                  {isSending ? <LoaderLite /> : "Save"}
                </Button>
              </Flex>
            </TabPane>
            <TabPane tab="Table sessions" key="2" style={{ width: "25.75rem" }}>
              <Flex vertical={true} gap={"2rem"}>
                <div style={style.addTableUpperSection}>
                  <TableInfo tableNumber={tableNumber} status={status} />
                  <div style={style.addTableUpperSectionSecondary}>
                    <div style={style.addTableStatus}>
                      <span style={{ color: blue10, ...style.updateLabelF }}>
                        Session id
                      </span>
                      <span
                        style={{ color: colorBorder, ...style.updateLabel }}
                      >
                        CH-19022383
                      </span>
                    </div>
                    <Flex vertical={true}>
                      <span style={{ color: blue10, ...style.updateLabelF }}>
                        Start session{" "}
                      </span>
                      <span
                        style={{ color: colorBorder, ...style.updateLabel }}
                      >
                        18/08/2023 18:43 hrs.
                      </span>
                    </Flex>
                    <Flex vertical={true}>
                      <span style={{ color: blue10, ...style.updateLabelF }}>
                        Time elapsed
                      </span>
                      <span
                        style={{ color: colorBorder, ...style.updateLabel }}
                      >
                        1:32:02
                      </span>
                    </Flex>
                  </div>
                </div>
                <TableBtn btnText="Close session" action={() => {}} />
              </Flex>
            </TabPane>
          </Tabs>
        </Form>
      </div>
    )
  );
}

export default UpdateTable;
