"use client";
import style from "@/styles/table/table-components";
import React, { useEffect, useRef, useState } from "react";
import TableBtn from "./tableBtn";
import { FormInstance, Modal, theme } from "antd";
import AddNewTable from "./addNewTable";
import TableHeaderInfo from "./tableHeaderInfo";
// import LayoutChangeBtn from "./layoutChangeBtn";
import { VscSettings } from "react-icons/vsc";
import TableCardHeaderSkeleton from "@/app/components/skeletons/table/table-card-header";
import SkeletonButtonSettings from "@/app/components/skeletons/menu/button-customize";
import SkeletonTableHeaderBtn from "@/app/components/skeletons/table/table-btn-header";
import { useTableContext } from "@/app/providers/TableProvider";
import { useQuery } from "@apollo/client";
import { GET_TABLE_HEADER_COUNTS } from "@/lib/queries/table";
import LoadingErrorHandler from "@/app/components/errors/loadingErrorHandler";
import { Button } from "antd";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { MdModeEditOutline } from "react-icons/md";
// import { PiExportBold } from "react-icons/pi";
import { BiQrScan } from "react-icons/bi";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import { LuPlusCircle } from "react-icons/lu";
import { useWebSocketContext } from "@/app/providers/WebSocketProvider";
// import dynamic from "next/dynamic";
// const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
//   ssr: false,
//   loading: () => <></>,
// });
interface TableHeaderProps {
  tableNumbers?: any;
  qrDetails?: any;
  tableRefetch: () => void;
}

function TableHeader({ tableNumbers, tableRefetch }: TableHeaderProps) {
  const [IsnewTableModalVisible, setIsnewTableModalVisible] = useState(false);
  const formRef = useRef<FormInstance>(null);
  const {
    handleEditTableClick,
    handleSettingsClick,
    handleRegenerateQrModal,
    closeEditView,
    tableUpdated,
    colorBgContainerDisabled,
  } = useTableContext();

  const { lg, xl } = useBreakpoint();

  let restaurant_id: number | null = null;
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("lono_restaurant_id");
    if (storedId) {
      restaurant_id = parseInt(storedId, 10);
    }
  }

  const { data, loading, error, refetch } = useQuery<any>(
    GET_TABLE_HEADER_COUNTS,
    { variables: { restaurant_id: restaurant_id } }
  );

  const deviceWidth = useWindowWidth();
  const [isLargerScreen, setisLargerScreen] = useState(false);
  const { wsRef } = useWebSocketContext();

  // Gets latest changes about web socket connection
  // Processes ws messages here
  useEffect(() => {
    const handleWSmessage = () => {
      console.log("WS message will be handled here!");
      try {
        refetch();
        tableRefetch();
      } catch (err) {
        console.log("Error processing ws message for table management");
      }
      // handle other messages related to table
    };

    console.log("WS connection details: ", wsRef);
    if (wsRef.current) {
      wsRef.current.onmessage = handleWSmessage;
    }
  }, [wsRef]);

  useEffect(() => {
    if (deviceWidth >= 880) {
      setisLargerScreen(true);
    } else if (deviceWidth < 880) {
      setisLargerScreen(false);
    }
  }, [deviceWidth]);

  useEffect(() => {
    tableUpdated && refetch();
  }, [tableUpdated]);

  // const [isExportClicked, setIsExportClicked] = useState(false);
  const handleNewTableClick = () => {
    setIsnewTableModalVisible(!IsnewTableModalVisible);
    formRef.current?.resetFields();
  };

  // const filename = "qr_codes.pdf";

  // const handleExportQrClick = () => {
  //   setIsExportClicked(!isExportClicked);
  // return(<PDFDownloadLink
  //               style={style.settingIconsContainer}
  //             document={<QRCodesPDF qrDetails={qrDetails} />}
  //             fileName={filename}
  //           >
  //           {({ loading:loadingPdf }) =>
  //             loadingPdf ? (
  //               <button>Loading Document...</button>
  //             ) : (
  //               <>
  //                 <MdOutlinePrint style={style.settingIcons} />
  //                 <p style={style.settingTexts}>EXPORT ALL QRs</p>
  //               </>
  //             )
  //           }
  //         </PDFDownloadLink>)
  // };

  const {
    token: {
      colorFillAlter,
      colorBgContainer,
      // colorPrimaryBg,
      // colorInfoText,
      // colorTextBase,
      // colorTextDisabled,
    },
  } = theme.useToken();

  const handleRetryClick = () => {
    refetch();
  };

  if (error) {
    return (
      <LoadingErrorHandler
        handleRetryClick={handleRetryClick}
        text="table header counts"
      />
    );
  }

  const items: MenuProps["items"] = [
    {
      key: "EditTables",
      label: (
        <div style={style.editItems} onClick={handleEditTableClick}>
          <MdModeEditOutline style={style.settingIcons} />
          <p style={style.settingTexts}>Edit Tables</p>
        </div>
      ),
    },

    // {
    //   key: "ExportQRs",
    //   label: (
    //     <PDFDownloadLink
    //       style={{ color: "white" }}
    //       document={<QRCodesPDF qrDetails={qrDetails} />}
    //       fileName={filename}
    //     >
    //       {/* {({ loading: loadingPdf }) =>
    //         loadingPdf ? (
    //           <div style={style.settingIconsContainer}>
    //             <PiExportBold style={style.settingIcons} />
    //             <p style={style.settingTexts}>Export All QRs</p>
    //           </div>
    //         ) : (
    //           <div style={style.settingIconsContainer}>
    //             <PiExportBold style={style.settingIcons} />
    //             <p style={style.settingTexts}>Export All QRs</p>
    //           </div>
    //         )
    //       } */}
    //     </PDFDownloadLink>
    //   ),
    // },
    {
      key: "RegenerateQRs",
      label: (
        <div style={style.editItems} onClick={handleRegenerateQrModal}>
          <BiQrScan style={style.settingIcons} />
          <p style={style.settingTexts}>Regenerate All QRs</p>
        </div>
      ),
    },
  ];

  const menuProps = {
    items,
    backgroundColor: colorBgContainerDisabled,
  };

  return (
    <div style={style.tableManagementHeader} onClick={closeEditView}>
      <div
        style={{
          ...style.tableManagementHeaderLeft,
          gap: isLargerScreen ? "1.5rem" : "0.75rem",
          padding: "0.75rem",
        }}
      >
        {!loading && data ? (
          <TableHeaderInfo
            title="Free"
            no={
              data.getOrdersSummary.free < 10
                ? `0${data.getOrdersSummary.free}`
                : data.getOrdersSummary.free
            }
          />
        ) : (
          <TableCardHeaderSkeleton />
        )}
        <div
          style={{
            backgroundColor: colorFillAlter,
            ...style.leftHeader,
          }}
        />

        {!loading && data ? (
          <TableHeaderInfo
            title="Occupied"
            no={
              data.getOrdersSummary.occupied < 10
                ? `0${data.getOrdersSummary.occupied}`
                : data.getOrdersSummary.occupied
            }
          />
        ) : (
          <TableCardHeaderSkeleton />
        )}
        <div
          style={{
            backgroundColor: colorFillAlter,
            ...style.leftHeader,
          }}
        />

        {!loading && data ? (
          <TableHeaderInfo
            title="Total"
            no={
              data.getOrdersSummary.total < 10
                ? `0${data.getOrdersSummary.total}`
                : data.getOrdersSummary.total
            }
          />
        ) : (
          <TableCardHeaderSkeleton />
        )}
      </div>

      <div
        style={{ ...style.headerRight, gap: isLargerScreen ? "2rem" : "1rem" }}
      >
        <div
          onClick={(e) => {
            handleSettingsClick();
            e.stopPropagation();
          }}
          style={{
            background: colorBgContainer,
            ...style.settingIcon,
            // width: 50,
            // border: "4px solid red",
          }}
          id="settingIcon"
        >
          {loading ? (
            <div style={{ marginBottom: 5 }}>
              <SkeletonButtonSettings />
            </div>
          ) : (
            <Dropdown menu={menuProps} placement="bottomRight" arrow>
              <Button>
                <VscSettings
                  style={{
                    fontSize: 20,
                  }}
                />
              </Button>
            </Dropdown>
          )}
        </div>
        {/* {isSettingClicked && (
          <div
            style={{
              color: colorTextBase,
              backgroundColor: colorInfoText,
              ...style.settingsContainer,
            }}
          >
            <div
              style={style.settingIconsContainer}
              onClick={handleEditTableClick}
            >
              <GrDocumentText style={style.settingIcons} />
              <p style={style.settingTexts}>EDIT TABLES</p>
            </div>
            <div
              // style={style.settingIconsContainer}
              onClick={handleExportQrClick}
            >
              <PDFDownloadLink
                style={{ color: "white" }}
                document={<QRCodesPDF qrDetails={qrDetails} />}
                fileName={filename}
              >
                {({ loading: loadingPdf }) =>
                  loadingPdf ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0px 10px 0 10px",
                        color: colorTextDisabled,
                      }}
                    >
                      <MdOutlinePrint style={style.settingIcons} />
                      <p style={style.settingTexts}>EXPORT ALL QRs</p>
                    </div>
                  ) : (
                    <div style={style.settingIconsContainer}>
                      <MdOutlinePrint style={style.settingIcons} />
                      <p style={style.settingTexts}>EXPORT ALL QRs</p>
                    </div>
                  )
                }
              </PDFDownloadLink>
            </div>

            <div
              style={style.settingIconsContainer}
              onClick={handleRegenerateQrModal}
            >
              <MdOutlinePrint style={style.settingIcons} />
              <p style={style.settingTexts}>REGENERATE ALL QRs</p>
            </div>
          </div>
        )} */}
        {/* <Button
          style={{
            backgroundColor: colorFillSecondary,
            color: colorTextLightSolid,
            ...style.tabelButton,
          }}
        >
          <FaCirclePlus fontSize="1.2rem" /> New Table
        </Button> */}
        {loading ? (
          <SkeletonTableHeaderBtn width={100} />
        ) : (
          <TableBtn
            fontSize={
              isLargerScreen
                ? "16px"
                : deviceWidth > 806
                ? "14px"
                : deviceWidth > 750
                ? "10px"
                : "8px"
            }
            btnText="New Table"
            padding={
              isLargerScreen
                ? "9.25px 20px"
                : deviceWidth > 806
                ? "0.5rem 20px"
                : "0.5rem 10px"
            }
            btnIcon={
              <LuPlusCircle fontSize={isLargerScreen ? "1.2rem" : "1rem"} />
            }
            action={handleNewTableClick}
          />
        )}
      </div>
      {IsnewTableModalVisible && (
        <Modal
          title="New Table"
          style={{
            top: 80,
            right: xl ? "-28%" : lg ? "-23%" : "-15%",
            minHeight: "570px",
          }}
          width={"fit-content"}
          open={IsnewTableModalVisible}
          onCancel={handleNewTableClick}
          footer={null}
        >
          <AddNewTable
            closeModal={handleNewTableClick}
            tableNumbers={tableNumbers}
            formRef={formRef}
          />
        </Modal>
      )}
    </div>
  );
}

export default TableHeader;
