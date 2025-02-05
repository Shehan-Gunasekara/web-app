import React, { useEffect, useState } from "react";
import { Button, theme, Flex, Row, Col, ConfigProvider, Tooltip } from "antd";
import style from "@/styles/orders/order-details";
import RowModalOrder from "./order-modal-row";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { GET_ORDERS_BY_TABLE_ID } from "@/lib/queries/orders";
import { GET_ORDERS_BY_TABLE_AND_CUSTOMER } from "@/lib/queries/orders";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import SkeletonOrderTableModal from "@/app/components/skeletons/order/order-table-modal";
import "@/styles/orders/custom/CustomSegmented.css";
import SkeletonOrderIndividualBtn from "@/app/components/skeletons/order/order-individual-btn";
import SkeletonIndividualOrderRow from "@/app/components/skeletons/order/order-individual-order";
import SkeletonIndividualLastRow from "@/app/components/skeletons/order/order-individual-last-row";
import { useOrderContext } from "@/app/providers/OrderProvider";
import LoadingErrorHandler from "@/app/components/errors/loadingErrorHandler";
import { UPDATE_DINER } from "@/lib/mutations/orders";

interface ViewOrderProps {
  tableId: string;

  // action?: (table: any) => any;
}
function ViewOrder({ tableId }: ViewOrderProps) {
  const {
    token: {
      colorInfoText,
      cyan9,
      colorTextDisabled,
      geekblue6,

      colorBgBase,
      blue8,
      colorTextBase,
      colorInfoBorder,
      colorWhite,
    },
  } = theme.useToken();

  const {
    clikedOrder,
    clickedOrder,
    closeModalTrigger,
    setCloseModalTrigger,
    orderIndividual,
    setOrderIndividual,
    selectedTab,
    setSelectedTab,
    isSelectNameCard,
    isOrderUpdated,
    closeUpdateOrderModal,
  } = useOrderContext();
  const [currentTab, setCurrentTab] = useState(0);
  const isTabActive = (tab: any) => orderIndividual === tab;

  const [isCloseEnabled, setIsCloseEnabled] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [getOrdersByTableAndCustomer, { data: individualOrdersData }] =
    useLazyQuery(GET_ORDERS_BY_TABLE_AND_CUSTOMER, {
      fetchPolicy: "network-only", // or 'no-cache'
    });

  const fetchIndividualOrders = (table_Id: string, customer_Id: string) => {
    getOrdersByTableAndCustomer({
      variables: {
        input: {
          table_id: table_Id,
          customer_id: customer_Id,
        },
      },
    });
  };

  const handleCloseOrderTableClick = () => {
    closeUpdateOrderModal();
  };

  //Get all order of the table query
  const {
    data: ordersDataReturn,
    error,
    loading: orderLoading,
    refetch,
  } = useQuery<any>(GET_ORDERS_BY_TABLE_ID, {
    variables: {
      id: tableId ? tableId : clickedOrder,
    },
  });
  let ordersData: any = undefined;
  if (ordersDataReturn) {
    const sortedCustomers = ordersDataReturn.getOrdersByTable.orders
      .map((order: any) => order.customer)
      .sort((a: any, b: any) => a.id - b.id);
    const updatedOrders = ordersDataReturn.getOrdersByTable.orders.map(
      (order: any) => {
        const customerIndex =
          sortedCustomers.findIndex(
            (customer: any) => customer.id === order.customer.id
          ) + 1;
        return {
          ...order,
          customer: {
            ...order.customer,
            index: customerIndex,
          },
        };
      }
    );
    ordersData = {
      getOrdersByTable: {
        ...ordersDataReturn.getOrdersByTable,
        orders: updatedOrders,
      },
    };
  }

  //group the orders by customer
  const groupedOrdersByCustomers: {
    customer_id: string;
    name: string;
    started_time: string;
    table_No: string;
    status: string;
    tax: number;
    orders: any[];
  }[] = [];

  const handleTabClick = (tab: any) => {
    setOrderIndividual(tab);

    if (tableId) {
      if (closeModalTrigger == true) {
        fetchIndividualOrders(
          tableId,
          groupedOrdersByCustomers &&
            groupedOrdersByCustomers[tab] &&
            groupedOrdersByCustomers[tab].customer_id
        );
        isTabActive(
          groupedOrdersByCustomers.findIndex(
            (customer) => customer.customer_id === orderIndividual
          )
        );
        setCloseModalTrigger(false);
      } else {
        if (groupedOrdersByCustomers[tab]) {
          fetchIndividualOrders(
            tableId,
            groupedOrdersByCustomers &&
              groupedOrdersByCustomers[tab].customer_id
          );
        }
      }
    }
  };

  useEffect(() => {
    refetch().then(() => {
      handleTabClick(0);
    });
  }, [isOrderUpdated]);

  const [updateDiner] = useMutation(UPDATE_DINER);

  const handleUpdateDiner = async (isIndividual: boolean) => {
    if (isIndividual) {
      await updateDiner({
        variables: {
          updateDinerInput: {
            table_id: tableId,
            customer_id:
              groupedOrdersByCustomers &&
              groupedOrdersByCustomers[orderIndividual].customer_id,
          },
        },
      });
      setIsClosing(false);

      handleCloseOrderTableClick();
    } else {
      await updateDiner({
        variables: {
          updateDinerInput: {
            table_id: tableId,
            customer_id: null,
          },
        },
      });
      setIsClosing(false);

      handleCloseOrderTableClick();
    }
  };

  //Get the orders by table

  const individualOrder =
    individualOrdersData && individualOrdersData.getOrdersByTableAndCustomer;
  const allOrdersInTable = ordersData && ordersData.getOrdersByTable;

  ordersData &&
    ordersData.getOrdersByTable &&
    ordersData.getOrdersByTable.orders &&
    ordersData.getOrdersByTable.orders.forEach((order: any) => {
      const { customer_id } = order;
      const name = order.customer.name;
      const started_time = order.table.session_start_time;
      const table_No = order.table.table_number;
      const tax = order.table.tax;
      const status = order.table.status;
      const customerIndex =
        customer_id &&
        groupedOrdersByCustomers.findIndex(
          (customers) => customers.customer_id === customer_id
        );

      if (customerIndex === -1) {
        groupedOrdersByCustomers.push({
          customer_id: customer_id,
          name: name,
          started_time: started_time,
          table_No: table_No,
          status: status,
          tax: tax,
          orders: [order],
        });
      } else {
        groupedOrdersByCustomers[customerIndex].orders.push(order);
      }
    });
  //end of group the orders by customer

  //time formaating
  const dateObject =
    groupedOrdersByCustomers[0] &&
    new Date(
      ordersData &&
        groupedOrdersByCustomers[0] &&
        groupedOrdersByCustomers[0].started_time
    );
  const hours = dateObject && dateObject.getHours();
  const minutes = dateObject && dateObject.getMinutes();
  const amPm = hours && hours >= 12 ? "PM" : "AM";
  const formattedHours =
    hours && (hours % 12 || 12).toString().padStart(2, "0"); // Convert to 12-hour format with leading zero

  const formattedMinutes = minutes && minutes.toString().padStart(2, "0"); // Add leading zero to minutes if needed

  const formattedTime =
    formattedHours &&
    formattedMinutes &&
    amPm &&
    `${formattedHours}:${formattedMinutes} ${amPm}`;
  //end of time formaating

  const tax_rate =
    selectedTab == 0
      ? allOrdersInTable && allOrdersInTable.orders[0].tax / 100
      : individualOrder && individualOrder.orders[0].tax / 100;
  const totalPrice =
    selectedTab == 0
      ? allOrdersInTable && allOrdersInTable.total.toFixed(2)
      : individualOrder && individualOrder.total.toFixed(2);
  const initialPrice = parseFloat(totalPrice) / (1 + tax_rate);
  const taxPrice = parseFloat(totalPrice) - initialPrice;

  //handle invidual customer name tab click

  //handle the main tab click logic
  const handleOrderDetailTab = async () => {
    if (selectedTab == 0) {
      setSelectedTab(1);
      if (closeModalTrigger == true) {
        (await ordersData) &&
          handleTabClick(
            ordersData &&
              groupedOrdersByCustomers &&
              groupedOrdersByCustomers.findIndex(
                (customer) => customer.customer_id === orderIndividual
              )
          );
      } else {
        handleTabClick(0);
      }
    } else if (selectedTab == 1) {
      setSelectedTab(0);
    }
  };

  //handle the all orders/individual tab click
  const handleTabsClick = () => {
    handleOrderDetailTab();
    if (currentTab == 0) {
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  };

  useEffect(() => {
    // if (ordersData.getOrdersByTable.orders.length === 0) {
    //   // handleCloseOrderTableClick();
    // }
    setCurrentTab(0);
    setSelectedTab(0);
    if (orderIndividual) {
      fetchIndividualOrders(clikedOrder, orderIndividual);
    }
    if (closeModalTrigger == true && ordersData) {
      handleOrderDetailTab();
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  }, [isSelectNameCard]);

  useEffect(() => {
    if (selectedTab == 0) {
      if (
        allOrdersInTable &&
        allOrdersInTable.orders &&
        allOrdersInTable.orders.length > 0
      ) {
        setIsCloseEnabled(
          allOrdersInTable.orders.every(
            (order: any) =>
              order.status.toLowerCase() == "fulfilled" ||
              order.status.toLowerCase() == "cancelled"
          )
        );
      }
    }
  }, [allOrdersInTable]);

  useEffect(() => {
    if (selectedTab == 1) {
      if (
        individualOrder &&
        individualOrder.orders &&
        individualOrder.orders.length > 0
      ) {
        setIsCloseEnabled(
          individualOrder.orders.every(
            (order: any) =>
              order.status.toLowerCase() == "fulfilled" ||
              order.status.toLowerCase() == "cancelled"
          )
        );
      }
    }
  }, [individualOrder]);

  const handleRetryClick = () => {
    refetch();
  };

  const handleCloseClick = (isIndividual: boolean) => {
    handleUpdateDiner(isIndividual);

    setTimeout(() => {
      setIsClosing(true);
    }, 1000);
  };

  if (orderLoading) {
    return <SkeletonOrderTableModal />;
  }

  // if (orderIndividualLoading) {
  //   return <SkeletonOrderIndividualModal />;
  // }

  return (
    <Flex vertical={true} style={{ height: "783px", marginLeft: "-8px" }}>
      <Row>
        <Col span={11}>
          <span
            style={{
              color: blue8,
              fontSize: "18px",
              fontWeight: "700",
              marginLeft: "4px",
            }}
          >
            Close Table/Diner
          </span>
        </Col>
        {/* <Segmented
          style={{ marginBottom: 8, marginRight: "2.5rem" }}
          onChange={handleOrderDetailTab}
          options={["All Orders", "Individual Order"]}
          size={"large"}
          // value={selectedTab}
          defaultValue={closeModalTrigger?"Individual Order":selectedTab}
        /> */}
        <Col span={13} style={{ marginLeft: "-31px" }}>
          <div
            onClick={handleTabsClick}
            style={{
              position: "absolute",
              color: selectedTab == 0 ? colorBgBase : colorTextBase,
              background: selectedTab == 0 ? colorTextBase : colorBgBase,
              border:
                selectedTab == 0 ? "0px" : `1px solid ${colorInfoBorder} `,
              height: selectedTab == 0 ? "34px" : "32px",
              borderRadius: "10px",
              width: "109px",

              zIndex: selectedTab == 0 ? 1 : 0,
              ...style.orderTabs,
            }}
            id="all-orders"
          >
            All Orders
          </div>
          <div
            onClick={handleTabsClick}
            style={{
              position: "relative",
              zIndex: selectedTab == 1 ? 1 : 0,
              marginLeft: "98px",
              color: selectedTab == 1 ? colorBgBase : colorTextBase,
              background: selectedTab == 1 ? colorTextBase : colorBgBase,
              border:
                selectedTab == 1 ? "0px" : `1px solid ${colorInfoBorder} `,
              height: selectedTab == 1 ? "34px" : "32px",
              borderRadius: "10px",
              width: "157px",
              ...style.orderTabs,
            }}
            id="individual-orders"
          >
            Individual Order
          </div>
        </Col>
      </Row>
      {error ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "2rem",
          }}
        >
          <LoadingErrorHandler
            handleRetryClick={handleRetryClick}
            text={"table orders"}
          />
        </div>
      ) : (
        <Flex style={style.rowStyle}>
          <div style={{ background: colorInfoText, ...style.topRowTileOne }}>
            <span
              style={{
                color: colorWhite,
                ...style.textTableNo,
              }}
            >
              Table
            </span>
            <span style={{ color: colorWhite, ...style.textTableNo2 }}>
              {groupedOrdersByCustomers[0] &&
              groupedOrdersByCustomers[0].table_No
                ? groupedOrdersByCustomers[0].table_No.toString().length > 1
                  ? groupedOrdersByCustomers[0].table_No
                  : `0${groupedOrdersByCustomers[0].table_No}`
                : ""}
            </span>
          </div>

          <div
            style={{
              marginTop: "16px",
              marginLeft: "10px",

              ...style.topStatusRowTile,
            }}
          >
            <span
              style={{
                color: colorTextDisabled,
                ...style.textOne,
              }}
            >
              Status
            </span>
            {groupedOrdersByCustomers[0] && (
              <span style={{ ...style.textTwo }}>
                {groupedOrdersByCustomers[0] &&
                groupedOrdersByCustomers[0].status === "occupied"
                  ? "Active"
                  : "Inactive"}
              </span>
            )}
          </div>

          <div
            style={{
              ...style.topRowTileTime,
              marginTop: "16px",
              width: "110px",
            }}
          >
            <span
              style={{
                color: colorTextDisabled,
                ...style.textOne,
              }}
            >
              Started
            </span>
            {formattedTime && (
              <span style={{ ...style.textTwo }}>{formattedTime}</span>
            )}
          </div>

          <div
            style={{ marginTop: "16px", width: "110px", ...style.topRowTile }}
          >
            <span
              style={{
                color: colorTextDisabled,
                ...style.textOne,
              }}
            >
              Diners
            </span>
            <span style={{ ...style.textTwo }}>
              {groupedOrdersByCustomers.length.toString().length > 1
                ? groupedOrdersByCustomers.length
                : `0${groupedOrdersByCustomers.length}`}
            </span>
          </div>
          <Flex
            vertical={false}
            style={{
              position: "relative",
              marginTop: "5px",
            }}
          >
            <div style={style.topRowTile}>
              <span
                style={{
                  color: colorTextDisabled,
                  ...style.textOne,
                }}
              >
                Active
              </span>
              <span style={{ ...style.textTwo }}>
                {(
                  allOrdersInTable &&
                  allOrdersInTable.orders.filter(
                    (order: any) =>
                      order.status == "New" || order.status == "Preparing"
                  ).length
                ).toString().length > 1
                  ? allOrdersInTable &&
                    allOrdersInTable.orders.filter(
                      (order: any) =>
                        order.status == "New" || order.status == "Preparing"
                    ).length
                  : `0${
                      allOrdersInTable &&
                      allOrdersInTable.orders.filter(
                        (order: any) =>
                          order.status == "New" || order.status == "Preparing"
                      ).length
                    }`}
                {/* {cardData.orders[0].orderItems.reduce(
                  (total, item) => total + item.quantity,
                  0
                )} */}
              </span>
            </div>
            <div style={{ ...style.topRowTile }}>
              <span
                style={{
                  color: colorTextDisabled,
                  ...style.textOne,
                }}
              >
                Total
              </span>
              <span style={{ ...style.textTwo }}>
                {(
                  allOrdersInTable && allOrdersInTable.orders?.length
                ).toString().length > 1
                  ? allOrdersInTable && allOrdersInTable.orders?.length
                  : `0${allOrdersInTable && allOrdersInTable.orders?.length}`}
                {/* {cardData.orders[0].orderItems.reduce(
                  (total, item) => total + item.quantity,
                  0
                )} */}
              </span>
            </div>
          </Flex>
        </Flex>
      )}

      {/* individual name button */}
      {selectedTab == 1 && (
        <Flex gap={"0.5rem"} style={{ marginTop: "9px", marginBottom: "3px" }}>
          {groupedOrdersByCustomers ? (
            <>
              {groupedOrdersByCustomers.map((customer, index) => (
                <div
                  style={{
                    color: isTabActive(index) ? colorBgBase : colorTextBase,
                    background: isTabActive(index)
                      ? colorTextBase
                      : "transparent",
                    border: isTabActive(index)
                      ? ""
                      : `1px solid ${colorInfoBorder} `,
                    cursor: isClosing ? "not-allowed" : "pointer",
                    ...style.orderIndividual,
                  }}
                  onClick={() => {
                    if (!isClosing) {
                      handleTabClick(index);
                    }
                  }}
                  key={index}
                >
                  {customer.name.split(" ")[0]}
                </div>
              ))}
            </>
          ) : (
            <SkeletonOrderIndividualBtn />
          )}
        </Flex>
      )}

      {!error && (
        <div
          style={{
            height: "483px",
            width: "645px",
            overflowY: "scroll",
            overflowX: "hidden",
            paddingRight: "7px",
            marginBottom: "34px",
          }}
        >
          {selectedTab == 0 ? (
            <Flex vertical={true}>
              {allOrdersInTable &&
                allOrdersInTable.orders?.map((order: any, index: number) => (
                  <RowModalOrder key={index} order={order} />
                ))}
            </Flex>
          ) : (
            <Flex vertical={true}>
              {individualOrdersData ? (
                <>
                  {
                    //   groupedOrdersByCustomers.find(customer=>customer.customer_id===orderIndividualId)?.orders.map((customer_orders:any,index)=>(
                    //     <RowModalOrder key={index} order={customer_orders} />
                    // ))
                    individualOrdersData &&
                      individualOrder &&
                      individualOrder.orders.map(
                        (customer_orders: any, index: number) => (
                          <RowModalOrder key={index} order={customer_orders} />
                        )
                      )
                  }
                </>
              ) : (
                <SkeletonIndividualOrderRow />
              )}
            </Flex>
          )}
        </div>
      )}

      {error ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "2rem",
          }}
        >
          <LoadingErrorHandler
            handleRetryClick={handleRetryClick}
            text={"table orders"}
          />
        </div>
      ) : selectedTab == 1 ? (
        <>
          {individualOrdersData ? (
            <Row style={{ width: "645px", marginTop: "" }}>
              <Col span={4}>
                <Row style={{ marginLeft: "24px" }}>
                  {" "}
                  <span
                    style={{
                      color: colorTextDisabled,
                      fontSize: 12,
                      fontWeight: 400,
                    }}
                  >
                    Total items
                  </span>
                </Row>
                <Row style={{ marginLeft: "24px" }}>
                  {" "}
                  <span style={{ fontSize: "22px", fontWeight: "700px" }}>
                    {selectedTab == 0
                      ? allOrdersInTable && allOrdersInTable.item_count
                      : individualOrder && individualOrder.item_count}
                  </span>
                </Row>
              </Col>

              <Col span={9}>
                <Row
                  style={{
                    marginLeft: "18px",
                    gap: "15px",
                    marginBottom: "5px",
                  }}
                >
                  <Col span={12}>
                    {" "}
                    <span
                      style={{
                        color: colorTextDisabled,
                        fontSize: "12px",
                      }}
                    >
                      Subtotal Before Tax
                    </span>
                  </Col>
                  <Col span={10}>
                    {" "}
                    <span style={style.textTwoThree}>
                      ${initialPrice.toFixed(2)}
                    </span>
                  </Col>
                </Row>
                <Row style={{ gap: "15px" }}>
                  {" "}
                  <Col span={12}>
                    {" "}
                    <span
                      style={{
                        color: colorTextDisabled,
                        fontSize: "12px",
                      }}
                    >
                      Estimated GST/HST
                    </span>
                  </Col>
                  <Col span={10}>
                    {" "}
                    <span style={style.textTwoThree}>
                      ${taxPrice.toFixed(2)}
                    </span>
                  </Col>{" "}
                </Row>
                <Row style={{ gap: "15px" }}>
                  {" "}
                  <Col
                    span={11}
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <span
                      style={{
                        color: colorWhite,
                        fontSize: "12px",
                        textAlign: "right",
                        marginTop: "12px",
                      }}
                    >
                      Total
                    </span>
                  </Col>
                  <Col span={11}>
                    {" "}
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        marginLeft: "10px",
                      }}
                    >
                      ${totalPrice}
                    </span>
                  </Col>{" "}
                </Row>
              </Col>
              <Col span={11} style={{ marginTop: "-16px" }}>
                <Row
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: "25px",
                  }}
                >
                  {" "}
                  <span
                    style={{
                      color: geekblue6,
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Closing is irreversible.
                  </span>{" "}
                </Row>
                <Row
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: "25px",
                  }}
                >
                  {" "}
                  <span
                    style={{
                      color: geekblue6,
                      fontSize: "12px",
                      fontWeight: 300,
                    }}
                  >
                    Please confirm payment before proceeding.
                  </span>
                </Row>
                <Row
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: "8px",
                    marginTop: "-8px",
                  }}
                >
                  <div
                    style={{
                      width: "fit-content",
                      height: 55,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center", // Fixed to center alignment
                      margin: "1rem",
                    }}
                  >
                    <ConfigProvider
                      theme={{
                        token: {
                          colorBgContainerDisabled: colorBgBase, // Black background for disabled
                          colorTextDisabled: colorTextBase, // White text for disabled
                        },
                      }}
                    >
                      <Tooltip
                        title={
                          !isCloseEnabled
                            ? "Warning: some orders from this table are still open"
                            : ""
                        }
                        defaultOpen={false}
                      >
                        <Button
                          disabled={isClosing} // Disable only if animated
                          style={{
                            background: isCloseEnabled
                              ? colorTextBase
                              : colorBgBase,
                            color: isCloseEnabled ? colorBgBase : colorTextBase,
                            cursor: !isCloseEnabled ? "not-allowed" : "pointer",
                            position: "relative",
                            overflow: "hidden",
                            border: "2px solid black",
                            padding: "8px 16px", // Standard button padding
                            ...style.btnCloseTable,
                          }}
                          onClick={() =>
                            handleCloseClick(selectedTab == 0 ? false : true)
                          }
                          name="close-btn"
                        >
                          {selectedTab === 0 ? "Close Table" : "Close Diner"}
                        </Button>
                      </Tooltip>
                    </ConfigProvider>
                  </div>
                </Row>
              </Col>
            </Row>
          ) : (
            <SkeletonIndividualLastRow />
          )}
        </>
      ) : (
        <Row style={{ width: "100%", marginTop: "" }}>
          <Col span={4}>
            <Row style={{ marginLeft: "24px" }}>
              {" "}
              <span
                style={{
                  color: colorTextDisabled,
                  fontSize: 12,
                  fontWeight: 400,
                }}
              >
                Total items
              </span>
            </Row>
            <Row style={{ marginLeft: "24px" }}>
              {" "}
              <span style={{ fontSize: "22px", fontWeight: "700px" }}>
                {selectedTab == 0
                  ? allOrdersInTable && allOrdersInTable.item_count
                  : individualOrder && individualOrder.item_count}
              </span>
            </Row>
          </Col>

          <Col span={9}>
            <Row style={{ gap: "15px", marginBottom: "5px" }}>
              <Col span={12}>
                {" "}
                <span
                  style={{
                    color: colorTextDisabled,
                    fontSize: "12px",
                  }}
                >
                  Subtotal Before Tax
                </span>
              </Col>
              <Col span={10}>
                {" "}
                <span style={style.textTwoThree}>
                  ${initialPrice.toFixed(2)}
                </span>
              </Col>
            </Row>
            <Row style={{ gap: "15px" }}>
              {" "}
              <Col span={12}>
                {" "}
                <span
                  style={{
                    color: colorTextDisabled,
                    fontSize: "12px",
                  }}
                >
                  Estimated GST/HST
                </span>
              </Col>
              <Col span={10}>
                {" "}
                <span style={style.textTwoThree}>${taxPrice.toFixed(2)}</span>
              </Col>{" "}
            </Row>
            <Row style={{ gap: "15px" }}>
              {" "}
              <Col
                span={11}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <span
                  style={{
                    color: colorWhite,
                    fontSize: "12px",
                    textAlign: "right",
                    marginTop: "12px",
                  }}
                >
                  Total
                </span>
              </Col>
              <Col span={11}>
                {" "}
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    marginLeft: "10px",
                  }}
                >
                  ${totalPrice}
                </span>
              </Col>{" "}
            </Row>
          </Col>
          <Col span={11} style={{ marginTop: "-16px" }}>
            <Row
              style={{
                display: "flex",
                justifyContent: "flex-end",
                //paddingRight: "25px",
              }}
            >
              {" "}
              <span
                style={{
                  color: geekblue6,
                  fontSize: "12px",
                  fontWeight: 700,
                  paddingRight: "25px",
                }}
              >
                Closing is irreversible.
              </span>{" "}
            </Row>
            <Row
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: "25px",
              }}
            >
              {" "}
              <span
                style={{
                  color: geekblue6,
                  fontSize: "12px",
                  fontWeight: 300,
                }}
              >
                Please confirm payment before proceeding.
              </span>
            </Row>
            <Row
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: "8px",
                marginTop: "-8px",
              }}
            >
              <div
                style={{
                  width: "fit-content",
                  height: 55,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center", // Fixed to center alignment
                  margin: "1rem",
                }}
              >
                <ConfigProvider
                  theme={{
                    token: {
                      colorBgContainerDisabled: colorBgBase, // Black background for disabled
                      colorTextDisabled: colorTextBase, // White text for disabled
                    },
                  }}
                >
                  <Tooltip
                    title={
                      !isCloseEnabled
                        ? "Warning: some orders from this table are still open"
                        : ""
                    }
                    defaultOpen={false}
                  >
                    <Button
                      disabled={isClosing} // Disable only if animated
                      style={{
                        background: isCloseEnabled
                          ? colorTextBase
                          : colorBgBase,
                        color: isCloseEnabled ? colorBgBase : colorTextBase,
                        cursor: !isCloseEnabled ? "not-allowed" : "pointer",
                        position: "relative",
                        overflow: "hidden",
                        border: "2px solid black",
                        padding: "8px 16px", // Standard button padding
                        ...style.btnCloseTable,
                      }}
                      onClick={() =>
                        handleCloseClick(selectedTab == 0 ? false : true)
                      }
                      name="close-btn"
                    >
                      {selectedTab === 0 ? "Close Table" : "Close Diner"}
                    </Button>
                  </Tooltip>
                </ConfigProvider>
              </div>
            </Row>
          </Col>
        </Row>
      )}

      {!error && (
        <Flex
          justify="center"
          align="center"
          gap={"5px"}
          style={{ width: "640px" }}
        >
          <IoIosInformationCircleOutline color={cyan9} fontSize={"14px"} />
          <span style={{ color: cyan9, ...style.textBottomRow }}>
            Tables should not be closed until all orders are fulfilled or
            cancelled
          </span>
        </Flex>
      )}
    </Flex>
  );
}

export default ViewOrder;
