import React, { useEffect, useState, useRef } from "react";
import { Button, Flex, Layout, Modal, Skeleton, Spin, theme } from "antd";
import TableItem from "./tableItem";
import TableHeader from "./tableManagementHeader";
import { GET_ALL_TABLES, IS_TABLE_DELETABLE } from "@/lib/queries/table";
import { useMutation, useQuery } from "@apollo/client";
import ViewOrdersModal from "./view-orders-modal";
import { useTableContext } from "@/app/providers/TableProvider";
import UpdateExistingTable from "./updateExistingTable";
import SkeletonButtonCuztomizable from "@/app/components/skeletons/button-customize";
import {
  IoIosInformationCircleOutline,
  IoMdRedo,
  IoMdUndo,
} from "react-icons/io";
import { RiDeleteBinFill } from "react-icons/ri";
import { DELETE_TABLES, MOVE_TABLES_OFFLINE } from "@/lib/mutations/table";
import RegenQR from "./regen-qr";
import style from "@/styles/table/table-content";
import LoadingErrorHandler from "@/app/components/errors/loadingErrorHandler";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import MessageModalCentered from "@/app/components/message-modal-centered";

// import TableCardHeaderSkeleton from "@/app/components/skeletons/table/table-card-header";
// import TableCardSkeleton from "@/app/components/skeletons/table/table-card";

const { Content } = Layout;

function TableContents() {
  const {
    token: {
      colorBgBase,
      colorTextBase,
      colorTextDisabled,
      colorInfoTextHover,
      geekblue6,
      red10,
      geekblue7,
      colorTextQuaternary,
      blue7,
      purple1,
    },
  } = theme.useToken();

  const {
    tableUpdated,
    handleSettingsClose,
    isRegenerateQrModalVisible,
    CloseRegenerateQrModal,
    selectedTableList,
    closeEditView,
    updateTableAdded,
    activeTab,
    setActiveTab,
  } = useTableContext();

  let restaurant_id: number | null = null;
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("lono_restaurant_id");
    if (storedId) {
      restaurant_id = parseInt(storedId, 10);
    }
  }

  const {
    data,
    loading,
    error: tableError,
    refetch,
  } = useQuery<any>(GET_ALL_TABLES, {
    variables: { restaurant_id: restaurant_id },
  });

  const {
    data: isTableDeletable,
    loading: isTableDeletableLoading,
    refetch: refetchIsTableDeletable,
  } = useQuery<any>(IS_TABLE_DELETABLE, {
    variables: {
      tableInput: {
        ids: selectedTableList,
      },
    },
    onError(_error) {},
  });

  useEffect(() => {
    refetch();
  }, [tableUpdated]);

  const tableNumbers =
    data && data?.getTables?.map((table: any) => table.table_number);

  const tableDetails = data && data?.getTables;

  const availableTables =
    data &&
    tableDetails.filter(
      (table: { is_available: boolean }) => table.is_available
    );
  const unavailableTables =
    data &&
    tableDetails.filter(
      (table: { is_available: boolean }) => !table.is_available
    );

  const qrDetails:
    | { table_number: string; qr_code: string }[]
    | { table_number: any; qr_code: any }[] = [];

  data &&
    data.getTables.forEach((table: { table_number: any; qr_code: any }) => {
      const tablesDetails = {
        table_number: table.table_number,
        qr_code: table.qr_code,
      };
      qrDetails.push(tablesDetails);
    });

  const [IsUpdateTableModalVisible, setIsUpdateTableModalVisible] =
    useState(false);
  const [IsViewTableModalVisible, setIsViewTableModalVisible] = useState(false);
  const [clickedTable, setClickedTable] = useState<any>();
  const [isDeleteTableClicked, setIsDeleteTableCliked] = useState(false);
  const [isTableStatusClicked, setIsTableStatusClicked] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isErrorOfflineodalVisible, setIsErrorOfflineModalVisible] =
    useState(false);
  const [isDeleteBtnClicked, setIsDeleteBtnClicked] = useState(false);
  const [isTableStatusBtnClicked, setIsTableStatusBtnClicked] = useState(false);

  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [modalKey, setModalKey] = useState(0);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { isTableEditClicked } = useTableContext();

  const handleViewTableClick = (table?: any) => {
    setIsViewTableModalVisible(true);
    setClickedTable(table);
    setModalKey((prevKey) => prevKey + 1); // Increment the key
  };

  const handleUpdateTableClick = (table?: any) => {
    setIsUpdateTableModalVisible(!IsUpdateTableModalVisible);
    setClickedTable(table);
  };

  const closeModal = () => {
    setIsViewTableModalVisible(false);
  };

  const closeModalUpdate = () => {
    setIsUpdateTableModalVisible(!IsUpdateTableModalVisible);
  };

  // const handleDeleteTableClick = async () => {
  //   if (selectedTableList.length != 0) {
  //     if (deletable) {
  //       setIsDeleteModalVisible(true);
  //     } else {
  //       setIsDeleteTableCliked(!isDeleteTableClicked);
  //     }
  //   }
  // };

  const handleDeleteTableClick = async () => {
    if (isDeleteTableClicked) {
      setIsDeleteTableCliked(false);
    }
    if (isTableStatusClicked) {
      setIsTableStatusClicked(false);
    }
    if (selectedTableList.length != 0) {
      setIsDeleteBtnClicked(true);
      const isDeletable = await refetchIsTableDeletable();
      if (isDeletable) {
        if (!isDeletable.data.isTableDeletable) {
          setIsDeleteModalVisible(true);
          setIsDeleteBtnClicked(false);
        } else {
          setIsDeleteTableCliked(!isDeleteTableClicked);
          setIsDeleteBtnClicked(false);
        }
      } else {
        setIsDeleteBtnClicked(false);
      }
    }
  };
  const handleTablesStatus = async () => {
    if (isDeleteTableClicked) {
      setIsDeleteTableCliked(false);
    }
    if (isTableStatusClicked) {
      setIsTableStatusClicked(false);
    }
    if (selectedTableList.length != 0) {
      setIsTableStatusBtnClicked(true);
      const isDeletable = await refetchIsTableDeletable();
      if (isDeletable) {
        if (!isDeletable.data.isTableDeletable) {
          setIsErrorOfflineModalVisible(true);
          setIsTableStatusBtnClicked(false);
        } else {
          setIsTableStatusClicked(!isTableStatusClicked);
          setIsTableStatusBtnClicked(false);
        }
      } else {
        setIsTableStatusBtnClicked(false);
      }
    }
  };

  const [deleteTables, { loading: deleteLoading }] = useMutation(DELETE_TABLES);
  const [moveTables, { loading: moveTableLoading }] =
    useMutation(MOVE_TABLES_OFFLINE);

  useEffect(() => {
    let timer: any;
    if (isNotificationVisible) {
      timer = setTimeout(() => {
        setIsNotificationVisible(false);
      }, 3000);
    }

    // Clear the timer when the component unmounts or when isVisible changes to false
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isNotificationVisible]);

  const handleDeleteTables = async (table_Ids: string[]) => {
    try {
      await deleteTables({
        variables: {
          tableInput: {
            ids: table_Ids,
          },
        },
      });
      setNotificationText("Table deleted permanently");
      setIsNotificationVisible(true);
    } catch (_error) {}
  };

  const handleMoveTables = async (table_Ids: string[], status: Boolean) => {
    try {
      await moveTables({
        variables: {
          tableInput: {
            ids: table_Ids,
            status: status,
          },
        },
      });
      if (status) {
        setNotificationText("Tables Moved to online");
      } else {
        setNotificationText("Tables Moved to offline");
      }

      setIsNotificationVisible(true);
    } catch (_error) {}
  };

  const handleCancelClick = () => {
    setIsDeleteModalVisible(false);
  };

  const handleOfflineModelCancelClick = () => {
    setIsErrorOfflineModalVisible(false);
  };

  const handleTableDelete = async () => {
    await handleDeleteTables(selectedTableList);
    updateTableAdded();
    closeEditView();
    setIsDeleteTableCliked(false);
  };

  const handleMoveTable = async (status: Boolean) => {
    await handleMoveTables(selectedTableList, status);
    updateTableAdded();
    closeEditView();
    setIsTableStatusClicked(false);
  };

  // const handleViewChange = () => {
  //   setIsInGridView(!isInGridView);
  // };

  const handleTabClicked = (clickedBtnValue: string) => {
    if (clickedBtnValue === "available") {
      setActiveTab("available");
    } else if (clickedBtnValue === "unavailable") {
      setActiveTab("unavailable");
    }
    setIsDeleteTableCliked(false);
  };

  const moveButtonRef: any = useRef(null);
  const deleteButtonRef: any = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        moveButtonRef.current &&
        !moveButtonRef.current.contains(event.target)
      ) {
        setIsTableStatusClicked(false);
      }
      if (
        deleteButtonRef.current &&
        !deleteButtonRef.current.contains(event.target)
      ) {
        setIsDeleteTableCliked(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const tableCardSkeleton = (count: number) => {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      skeletons.push(
        <Skeleton.Button
          active={true}
          style={{ width: 132, height: 132 }}
          key={i}
        />
      );
      // skeletons.push(<TableCardSkeleton key={i} />);
    }
    return skeletons;
  };
  const handleBackgroundClick = () => {
    handleSettingsClose();
    CloseRegenerateQrModal();
  };

  const handleRetryClick = () => {
    refetch();
  };

  const { lg, xl } = useBreakpoint();

  return (
    <Content
      style={{
        background: colorBgBase,
        padding: "1rem",
        height: "90vh",
        overflow: "hidden",
      }}
    >
      <TableHeader
        tableNumbers={tableNumbers}
        qrDetails={qrDetails}
        tableRefetch={refetch}
      />
      <div
        style={{
          backgroundColor: colorBgContainer,
          borderRadius: "15px",
          width: "100%",
          height: "75vh",
        }}
        onClick={handleBackgroundClick}
        id="background-click"
      >
        {tableError ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 200,
            }}
          >
            <LoadingErrorHandler
              handleRetryClick={handleRetryClick}
              text={"table content"}
            />
          </div>
        ) : (
          <>
            <div
              style={{
                paddingTop: "1rem",
                marginRight: "2rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: !isTableEditClicked
                  ? "flex-end"
                  : "space-between",
              }}
            >
              {!loading && tableDetails ? (
                <Flex
                  vertical={false}
                  style={{
                    width: "100%",
                    paddingRight: "1.5rem",
                    paddingLeft: "1.5rem",
                    position: "relative",
                  }}
                  justify={"space-between"}
                >
                  <Flex vertical={false} gap={"1rem"}>
                    <div
                      onClick={() => handleTabClicked("available")}
                      style={{
                        borderBottom:
                          activeTab === "available"
                            ? `1px solid ${colorTextBase}`
                            : `none`,
                        color:
                          activeTab === "available"
                            ? colorTextBase
                            : colorTextDisabled,
                        cursor: "pointer",
                        padding: "0.5rem 0",
                      }}
                      id="available-tab"
                    >
                      Available
                    </div>
                    <div
                      onClick={() => handleTabClicked("unavailable")}
                      style={{
                        borderBottom:
                          activeTab === "unavailable"
                            ? `1px solid ${colorTextBase}`
                            : `none`,
                        color:
                          activeTab === "unavailable"
                            ? colorTextBase
                            : colorTextDisabled,
                        cursor: "pointer",
                        padding: "0.5rem 0",
                      }}
                      id="unavailable-tab"
                    >
                      Unavailable
                    </div>
                  </Flex>
                  {isNotificationVisible && (
                    <Flex vertical={false}>
                      <div style={{ color: purple1, padding: "0.5rem 0" }}>
                        {notificationText}
                      </div>
                    </Flex>
                  )}
                  {isTableEditClicked && (
                    <Flex vertical={false} gap={"1rem"}>
                      <Flex
                        vertical={false}
                        gap={"0.2rem"}
                        align="center"
                        style={{
                          color: colorInfoTextHover,
                          paddingRight: "8px",
                        }}
                      >
                        <IoIosInformationCircleOutline fontSize={"1.2rem"} />
                        <span style={{ color: colorTextQuaternary }}>
                          Occupied tables cannot be edited
                        </span>
                      </Flex>
                      <Flex
                        align="center"
                        style={{
                          borderRadius: "10px",
                          paddingRight: "1rem",
                          paddingLeft: "1rem",
                          cursor: "pointer",
                          backgroundColor: blue7,
                        }}
                      >
                        {activeTab === "available" ? (
                          <>
                            {" "}
                            <IoMdRedo
                              style={{
                                marginRight: 6,
                                fontSize: 16,
                                color: geekblue6,
                              }}
                            />
                            <p
                              style={{
                                margin: 0,
                                fontSize: 14,
                                color: geekblue6,
                                fontWeight: 500,
                                cursor: "pointer",
                              }}
                              onClick={handleTablesStatus}
                            >
                              Move to offline{" "}
                              {isTableStatusBtnClicked && (
                                <Spin style={{ marginLeft: "1rem" }} />
                              )}
                            </p>
                          </>
                        ) : (
                          <>
                            {" "}
                            <IoMdUndo
                              style={{
                                marginRight: 6,
                                fontSize: 16,
                                color: geekblue6,
                              }}
                            />
                            <p
                              style={{
                                margin: 0,
                                fontSize: 14,
                                color: geekblue6,
                                fontWeight: 500,
                                cursor: "pointer",
                              }}
                              onClick={handleTablesStatus}
                            >
                              Move to online{" "}
                              {isTableStatusBtnClicked && (
                                <Spin style={{ marginLeft: "1rem" }} />
                              )}
                            </p>
                          </>
                        )}
                      </Flex>
                      <Flex
                        align="center"
                        style={{
                          borderRadius: "10px",
                          paddingRight: "1rem",
                          paddingLeft: "1rem",
                          cursor: "pointer",
                          backgroundColor: blue7,
                        }}
                        onClick={handleDeleteTableClick}
                        id="delete-table-btn"
                      >
                        <RiDeleteBinFill
                          style={{
                            marginRight: 6,
                            fontSize: 16,
                            color: geekblue6,
                          }}
                        />

                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            color: geekblue6,
                            fontWeight: 500,
                          }}
                        >
                          Delete{" "}
                          {isDeleteBtnClicked && (
                            <Spin style={{ marginLeft: "1rem" }} />
                          )}
                        </p>
                      </Flex>
                      <Flex
                        style={{
                          position: "absolute",
                          right: "16px",
                          bottom: "-140%",
                          zIndex: 100,
                        }}
                      >
                        <>
                          {isTableStatusClicked &&
                            selectedTableList.length != 0 && (
                              <>
                                {" "}
                                {activeTab === "available" ? (
                                  <Button
                                    ref={moveButtonRef}
                                    htmlType="button"
                                    size="large"
                                    style={{
                                      backgroundColor: red10,
                                      width: "fit-content",
                                    }}
                                    block
                                    onClick={() => handleMoveTable(false)}
                                  >
                                    <b>Move to offline </b>
                                    {moveTableLoading && (
                                      <Spin style={{ marginLeft: "1rem" }} />
                                    )}
                                  </Button>
                                ) : (
                                  <Button
                                    ref={moveButtonRef}
                                    htmlType="button"
                                    size="large"
                                    style={{
                                      backgroundColor: red10,
                                      width: "fit-content",
                                    }}
                                    block
                                    onClick={() => handleMoveTable(true)}
                                  >
                                    <b>Move to online </b>
                                    {moveTableLoading && (
                                      <Spin style={{ marginLeft: "1rem" }} />
                                    )}
                                  </Button>
                                )}
                              </>
                              // <Modal
                              //   style={{
                              //     backgroundColor: red10,
                              //     width: "fit-content",
                              //   }}
                              //   width={"fit-content"}
                              //   open={true}
                              //   onCancel={handleCancelClick}
                              //   footer={null}
                              // >
                              //   <Button onClick={handleTableDelete}>
                              //     {"Delete"}
                              //   </Button>
                              // </Modal>
                            )}
                          {isDeleteTableClicked &&
                            selectedTableList.length != 0 && (
                              <Button
                                ref={deleteButtonRef}
                                htmlType="button"
                                size="large"
                                style={{
                                  backgroundColor: red10,
                                  width: "fit-content",
                                }}
                                block
                                onClick={handleTableDelete}
                              >
                                <b>Delete Tables Permanently</b>
                                {deleteLoading && (
                                  <Spin style={{ marginLeft: "1rem" }} />
                                )}
                              </Button>
                              // <Modal
                              //   style={{
                              //     backgroundColor: red10,
                              //     width: "fit-content",
                              //   }}
                              //   width={"fit-content"}
                              //   open={true}
                              //   onCancel={handleCancelClick}
                              //   footer={null}
                              // >
                              //   <Button onClick={handleTableDelete}>
                              //     {"Delete"}
                              //   </Button>
                              // </Modal>
                            )}
                        </>
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              ) : tableError ? null : (
                <div style={{ display: "flex", gap: 20 }}>
                  <SkeletonButtonCuztomizable height={30} width={80} />
                  <SkeletonButtonCuztomizable height={30} width={80} />
                </div>
              )}
            </div>
            {!loading && tableDetails ? (
              activeTab === "available" ? (
                <div
                  style={{
                    padding: "1rem",
                    height: "74vh",
                    overflowY: "scroll",
                  }}
                >
                  {availableTables.length < 1 ? (
                    <div
                      style={{ color: geekblue7, ...style.noTableContainer }}
                    >
                      <p style={style.noTableText1}>
                        There are no tables added to display
                      </p>
                      <p style={style.noTableText2}>
                        Please start by adding a new table
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.7rem",
                      }}
                    >
                      {/* {availableTables.map((table: any, index: number) => (
              <TableItem
                key={index}
                tableNumber={table.table_number}
                // status={table.status?.toLowerCase() === "occupied" ?? false}
                tableDetails={table}
                action={() => handleViewTableClick(table)}
                updateAction={() => handleUpdateTableClick(table)}
              />
            ))} */}
                      {availableTables
                        .sort((a: any, b: any) => {
                          if (
                            a.status === "occupied" &&
                            b.status !== "occupied"
                          ) {
                            return -1;
                          } else if (
                            a.status !== "occupied" &&
                            b.status === "occupied"
                          ) {
                            return 1;
                          } else {
                            return a.table_number - b.table_number;
                          }
                        })
                        .map((table: any, index: number) => (
                          <TableItem
                            key={index}
                            tableNumber={table.table_number}
                            tableDetails={table}
                            action={() => handleViewTableClick(table)}
                            updateAction={() => handleUpdateTableClick(table)}
                            setIsDeleteTableCliked={setIsDeleteTableCliked}
                          />
                        ))}

                      {/* {availableTables
              .sort((a: any, b: any) => a.table_number - b.table_number) // Sort the tables in ascending order based on table_number
              .map((table: any, index: number) => (
                <TableItem
                  key={index}
                  tableNumber={table.table_number}
                  tableDetails={table}
                  action={() => handleViewTableClick(table)}
                  updateAction={() => handleUpdateTableClick(table)}
                />
              ))} */}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    padding: "1rem",
                    height: "74vh",
                    overflowY: "scroll",
                  }}
                >
                  {unavailableTables.length < 1 ? (
                    <div
                      style={{ color: geekblue7, ...style.noTableContainer }}
                    >
                      <p style={style.noTableText2}>
                        There are no unavailable tables to display
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.7rem",
                      }}
                    >
                      {unavailableTables.map((table: any, index: number) => (
                        <TableItem
                          key={index}
                          tableNumber={table.table_number}
                          // status={table.status?.toLowerCase() === "occupied" ?? false}
                          tableDetails={table}
                          action={() => handleViewTableClick(table)}
                          updateAction={() => handleUpdateTableClick(table)}
                          setIsDeleteTableCliked={setIsDeleteTableCliked}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            ) : tableError ? null : (
              <>
                <div
                  style={{
                    padding: "1rem",
                    height: "74vh",
                    overflowY: "scroll",
                  }}
                >
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.7rem" }}
                  >
                    {tableCardSkeleton(8)}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <Modal
        title="View Orders"
        style={{
          top: 80,
          right: xl ? "-27%" : lg ? "-23%" : "-15%",
          minHeight: "570px",
        }}
        width={"fit-content"}
        open={IsViewTableModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {clickedTable && !isTableEditClicked && (
          <ViewOrdersModal
            key={modalKey} // Add this key prop
            clickedTable={clickedTable}
            closeModal={closeModal}
            isModalOpen={IsViewTableModalVisible}
          />
        )}
      </Modal>

      {clickedTable && !isTableEditClicked && (
        <UpdateExistingTable
          IsUpdateTableModalVisible={IsUpdateTableModalVisible}
          tableDetails={clickedTable}
          closeModal={closeModalUpdate}
          tableNumbers={tableNumbers}
        />
      )}
      {isRegenerateQrModalVisible && <RegenQR qrDetails={qrDetails} />}
      {/* <Modal
        title="Update Table"
        style={{ top: 200, right: "-30%", minHeight: "570px" }}
        width={"fit-content"}
        open={IsUpdateTableModalVisible}
        onCancel={closeModalUpdate}
        footer={null}
      >
        {clickedTable && (
          <UpdateExistingTable
            tableDetails={clickedTable}
            closeModal={closeModalUpdate}
          />
        )}
      </Modal> */}
      {isTableDeletable && !isTableDeletableLoading && (
        <MessageModalCentered
          modalTitle={"Delete table"}
          modalVisibility={isDeleteModalVisible}
          messageOne={`Sorry, these tables cannot be deleted.`}
          messageTwo={`They are being used in active orders.`}
          btnCancelText="Close"
          handleCancelClick={handleCancelClick}
        />
      )}
      {isErrorOfflineodalVisible && !isTableDeletableLoading && (
        <MessageModalCentered
          modalTitle={"Move to offline Table"}
          modalVisibility={isErrorOfflineodalVisible}
          messageOne={`Sorry, these tables cannot be move to offline.`}
          messageTwo={`They are being used in active orders.`}
          btnCancelText="Close"
          handleCancelClick={handleOfflineModelCancelClick}
        />
      )}

      {/* <DeleteCheckModal
          modalTitle={modalTitle}
          modalVisibility={isDeleteCheckVisible}
          itemId={id}
          type={type}
          messageOne={`Sorry, this ${type} cannot be deleted.`}
          messageTwo={`It is being used in an active order.`}
          btnCancelText="Close"
          handleCancelClick={closeIsDeletableModal}
          handleShowDeleteModal={handleShowDeleteModal}
          isDeleteProhibited={isDeleteProhibited}
          setIsDeleteProhibited={setIsDeleteProhibited}
        /> */}
    </Content>
  );
}

export default TableContents;
