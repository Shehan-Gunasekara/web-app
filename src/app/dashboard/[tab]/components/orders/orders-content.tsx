"use client";
import React, { useEffect, useState } from "react";
import { Col, Row, Modal } from "antd";
import OrderItem from "./order-item";
import OrderHeader from "./order-header";
import OrderItemTable from "./order-item-table";
import style from "../../../../../styles/orders/order-components";
import { Order } from "@/utils/interfaces";
import NewOrders from "./new-orders";
import { useOrderContext } from "@/app/providers/OrderProvider";
import SkeletonOrders from "@/app/components/skeletons/order/orders";
import NoOrders from "./no-orders";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import ViewOrder from "./order-details";
import { useWebSocketContext } from "@/app/providers/WebSocketProvider";
import OrderItemSkeleton from "@/app/components/skeletons/order-item-card";

function OrdersContent() {
  const [orderCounts, setOrderCounts] = useState({});
  const { wsRef, message } = useWebSocketContext();
  const {
    activeTab,
    setActiveTab,
    _isOrderUpdated,
    handleIsOrderUpdated,
    clickedOrder,
    IsUpdateOrderModalVisible,
    closeUpdateOrderModal,
    statusUpdatedOrder,
    isOrderStatUpdating,
    orderData,
    orderLoading,
    ordersMore,
    page,
    fetchOrders,
    addOrder,
  } = useOrderContext();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [isOptionClicked, setIsOptionClicked] = useState(false);
  const [menuFilter, setMenuFilter] = useState("");
  // const [orderLoading, setOrderLoading] = useState(true);
  const [refetchKey, setRefetchKey] = useState(0);
  // const [activeOrderLoading, setActiveOrderLoading] = useState(true);
  const { sidebarCollapsed } = useThemeContext();
  const [groupedOrders, setGroupedOrders] = useState<any[]>([]);

  const [orderDetails, setOrderDetails] = useState<any>([]);
  useEffect(() => {
    setOrderDetails(orderData ?? []);
  }, [orderData]);

  const handleCloseOrderTableClick = (event: any) => {
    event.stopPropagation();

    closeUpdateOrderModal();
  };

  useEffect(() => {
    const orders = orderData;
    if (orders) {
      const newGroupedOrders: any[] = [];

      orders.forEach((order: any) => {
        const { table_id, table } = order;
        const tableNo = table.table_number;

        // Find the index of the table in newGroupedOrders array
        const tableIndex = newGroupedOrders.findIndex(
          (tables) => tables.tableId === table_id
        );

        // If the table doesn't exist yet, create it and push it to newGroupedOrders array
        if (tableIndex === -1) {
          newGroupedOrders.push({
            tableId: table_id,
            tableNo: tableNo,
            orders: [order],
          });
        } else {
          // If the table already exists, push the order to its orders array
          newGroupedOrders[tableIndex].orders.push(order);
        }
      });

      // Update the groupedOrders state with the newGroupedOrders array
      setGroupedOrders(newGroupedOrders);
    }
  }, [orderData]);

  const [ordersPerPage, setOrdersPerPage] = useState(3);
  const deviceWidth = useWindowWidth();

  useEffect(() => {
    if (!sidebarCollapsed && deviceWidth < 825) {
      setOrdersPerPage(1);
    } else if (deviceWidth < 825 && sidebarCollapsed) {
      setOrdersPerPage(2);
    } else if (deviceWidth <= 1050) {
      setOrdersPerPage(2);
    } else if (deviceWidth < 1200 && !sidebarCollapsed) {
      setOrdersPerPage(2);
    } else {
      setOrdersPerPage(3);
    }
  }, [deviceWidth, sidebarCollapsed]);

  //handle active bar
  const handleActiveTab = (tab: any) => {
    if (activeTab == tab) return;
    setIsSearching(false);
    setMenuFilter("all");

    setActiveTab(tab);
  };

  const handleFilterChange = (filter: any) => {
    setIsSearching(false);
    setMenuFilter(filter);
  };

  //order seach bar
  const searchOrders = (input: string) => {
    setIsSearching(true);
    if (orderDetails) {
      const filteredOrders = orderDetails.filter((order: any) => {
        const matchesOrderName = order.customer.name
          .toLowerCase()
          .includes(input.toLowerCase());
        const matchesOrderId = order.order_no.toString().startsWith(input);

        return matchesOrderName || matchesOrderId;
      });
      setSearchResults(filteredOrders);
    }
  };

  //Check whether the option modal is clicked
  const handleOptionClick = () => {
    setIsOptionClicked(!isOptionClicked);
  };

  //count the orders for each orderstatus
  useEffect(() => {
    const calculateOrderCounts = () => {
      if (orderDetails) {
        const counts: { [key: string]: number } = {};

        orderDetails.forEach((order: any) => {
          if (order.status == "fulfilled") {
            if (order.is_active) {
              const status = order.status.toLowerCase();
              counts[status] = (counts[status] || 0) + 1;
            }
          } else {
            const status = order.status.toLowerCase();
            counts[status] = (counts[status] || 0) + 1;
          }
        });
        setOrderCounts(counts);
      }
    };
    calculateOrderCounts();
  }, [orderDetails]);

  useEffect(() => {
    if (isOrderStatUpdating && statusUpdatedOrder) {
      const prevOrders =
        orderDetails &&
        orderDetails.filter((order: any) => order.id !== statusUpdatedOrder);
      if (prevOrders) {
        setOrderDetails(prevOrders);
      }
    }
  }, [isOrderStatUpdating]);

  // Refetching the active orders
  // Not sure we need this or not as the websocket is connected
  /*useEffect(() => {
    if (isOrderUpdated) {
      refetchTable();
      refetch().then(() => handleIsOrderUpdated());
    } else {
      refetchTable();
      refetch();
    }
  }, [isOrderUpdated]);
  */

  // Gets latest changes about web socket connection
  // Processes ws messages here
  useEffect(() => {
    const handleWSmessage = () => {
      console.log("WS message will be handled here!");
      try {
        setRefetchKey((prev) => prev + 1);
        handleIsOrderUpdated();
      } catch (error) {
        console.error("Error handling WebSocket message: ", error);
      }
      // handle other messages related to orders
    };
    console.log("WS connection details: ", wsRef);

    if (wsRef.current) {
      wsRef.current.onmessage = handleWSmessage;
    }
  }, [wsRef]);

  useEffect(() => {
    if (message) {
      console.log("Message: ", message);
      if (message.type === "new_order") {
        console.log("New order: ", message.data.newOrder);
        addOrder(message.data.newOrder);
      }
    }
  }, [message]);

  const inProgressOrders =
    orderDetails &&
    orderDetails.filter(
      (order: any) => order.status.toLowerCase() === "preparing"
    );

  const newOrders =
    orderDetails &&
    orderDetails.filter((order: any) => order.status.toLowerCase() === "new");

  const fulfilledOrders =
    orderDetails &&
    orderDetails
      .filter(
        (order: any) =>
          (order.status.toLowerCase() === "fulfilled" ||
            order.status.toLowerCase() === "closed") &&
          order.is_active
      )
      .sort((a: any, b: any) =>
        a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1
      );

  const cancelledOrders =
    orderDetails &&
    orderDetails.filter(
      (order: any) => order.status.toLowerCase() === "cancelled"
    );

  const closedOrders: Order[] =
    orderDetails &&
    orderDetails.filter(
      (order: any) =>
        order.is_active == false && order.status.toLowerCase() !== "cancelled"
    );

  //lazy load inactive orders
  const handleScroll = (e: any) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    const hasReachedBottom =
      scrollTop + clientHeight >= scrollHeight - clientHeight;
    if (hasReachedBottom && ordersMore) {
      fetchOrders(page + 1);
    }
  };

  if (orderLoading) return <SkeletonOrders />;
  // if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {orderDetails && (
        <div
          style={{ height: "90vh", overflowX: "hidden", overflowY: "hidden" }}
        >
          {orderCounts && (
            <OrderHeader
              orderCounts={orderCounts}
              handleTabChange={handleActiveTab}
              handleFilterChange={handleFilterChange}
              handleSearch={searchOrders}
              isLoading={orderLoading}
              // orderCountAll={orderDetails.length}
              // orderCountAll={orderDetails.length}
            />
          )}
          <div
            id="ordersContainer"
            style={{ height: "90vh", overflowY: "scroll", overflowX: "hidden" }}
            onScroll={handleScroll}
          >
            <div style={style.orderItemCard}>
              <Row gutter={[16, 16]}>
                {
                  // isInTableView ? (

                  // ) :
                  isSearching ? (
                    <>
                      {searchResults.map((order, index) => (
                        <Col
                          key={index}
                          xs={24}
                          sm={12}
                          md={ordersPerPage === 2 ? 12 : 8}
                          lg={8}
                          xl={8}
                        >
                          <OrderItem order={order} />
                        </Col>
                      ))}
                    </>
                  ) : activeTab === "new" ? (
                    <NewOrders
                      orders={orderDetails}
                      optionClicked={isOptionClicked}
                      handleOptionClicked={handleOptionClick}
                    />
                  ) : // <>
                  //   {orderDetails
                  //     .filter(
                  //       (order: any) => order.status.toLowerCase() === "new"
                  //     )
                  //     .map((order: any, index: number) => (
                  //       <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
                  //         <OrderItem
                  //           orderDetails={order}
                  //           action={handleUpdateOrderClick}
                  //         />
                  //       </Col>
                  //     ))}
                  // </>
                  activeTab === "preparing" ? (
                    <>
                      {inProgressOrders && inProgressOrders.length > 0 ? (
                        inProgressOrders.map((order: any, index: number) => (
                          <Col
                            key={index}
                            xs={12}
                            sm={12}
                            md={
                              !sidebarCollapsed && deviceWidth < 825 ? 24 : 12
                            }
                            lg={
                              !sidebarCollapsed
                                ? 12
                                : deviceWidth < 1050
                                ? 12
                                : 8
                            }
                            xl={8}
                          >
                            <OrderItem order={order} />
                          </Col>
                        ))
                      ) : (
                        <NoOrders text="Preparing" />
                      )}
                    </>
                  ) : activeTab === "tableview" ? (
                    <>
                      {groupedOrders && groupedOrders.length > 0 ? (
                        groupedOrders.map((table, index) => (
                          <Col
                            key={index}
                            xs={12}
                            sm={12}
                            md={
                              !sidebarCollapsed && deviceWidth < 825 ? 24 : 12
                            }
                            lg={
                              !sidebarCollapsed
                                ? 12
                                : deviceWidth < 1050
                                ? 12
                                : 8
                            }
                            xl={8}
                          >
                            <OrderItemTable
                              orderDetailsTable={table}
                              // action={handleUpdateOrderClick}
                            />
                          </Col>
                        ))
                      ) : (
                        <NoOrders text="Active" />
                      )}
                    </>
                  ) : activeTab === "fulfilled" ? (
                    <>
                      {fulfilledOrders && fulfilledOrders.length > 0 ? (
                        fulfilledOrders.map((order: any, index: number) => (
                          <Col
                            key={index}
                            xs={12}
                            sm={12}
                            md={
                              !sidebarCollapsed && deviceWidth < 825 ? 24 : 12
                            }
                            lg={
                              !sidebarCollapsed
                                ? 12
                                : deviceWidth < 1050
                                ? 12
                                : 8
                            }
                            xl={8}
                          >
                            <OrderItem order={order} />
                          </Col>
                        ))
                      ) : (
                        <NoOrders text="Fulfilled" />
                      )}
                    </>
                  ) : activeTab === "all" ? (
                    <>
                      {menuFilter == "all" ? (
                        <>
                          {orderDetails && orderDetails.length > 0 ? (
                            orderDetails.map((order: any, index: number) => (
                              <Col
                                key={index}
                                xs={12}
                                sm={12}
                                md={
                                  !sidebarCollapsed && deviceWidth < 825
                                    ? 24
                                    : 12
                                }
                                lg={
                                  !sidebarCollapsed
                                    ? 12
                                    : deviceWidth < 1050
                                    ? 12
                                    : 8
                                }
                                xl={8}
                              >
                                <OrderItem order={order} />
                              </Col>
                            ))
                          ) : (
                            <NoOrders text="Active" />
                          )}
                        </>
                      ) : (
                        <>
                          {menuFilter == "new" ? (
                            <>
                              {" "}
                              <>
                                {newOrders && newOrders.length > 0 ? (
                                  newOrders.map((order: any, index: number) => (
                                    <Col
                                      key={index}
                                      xs={12}
                                      sm={12}
                                      md={
                                        !sidebarCollapsed && deviceWidth < 825
                                          ? 24
                                          : 12
                                      }
                                      lg={
                                        !sidebarCollapsed
                                          ? 12
                                          : deviceWidth < 1050
                                          ? 12
                                          : 8
                                      }
                                      xl={8}
                                    >
                                      <OrderItem order={order} />
                                    </Col>
                                  ))
                                ) : (
                                  <NoOrders text="New" />
                                )}
                              </>
                            </>
                          ) : (
                            <>
                              {" "}
                              {menuFilter == "preparing" ? (
                                <>
                                  {inProgressOrders &&
                                  inProgressOrders.length > 0 ? (
                                    inProgressOrders.map(
                                      (order: any, index: number) => (
                                        <Col
                                          key={index}
                                          xs={12}
                                          sm={12}
                                          md={
                                            !sidebarCollapsed &&
                                            deviceWidth < 825
                                              ? 24
                                              : 12
                                          }
                                          lg={
                                            !sidebarCollapsed
                                              ? 12
                                              : deviceWidth < 1050
                                              ? 12
                                              : 8
                                          }
                                          xl={8}
                                        >
                                          <OrderItem order={order} />
                                        </Col>
                                      )
                                    )
                                  ) : (
                                    <NoOrders text="Preparing" />
                                  )}
                                </>
                              ) : (
                                <>
                                  {" "}
                                  {menuFilter == "fulfilled" ? (
                                    <>
                                      {fulfilledOrders &&
                                      fulfilledOrders.length > 0 ? (
                                        fulfilledOrders.map(
                                          (order: any, index: number) => (
                                            <Col
                                              key={index}
                                              xs={12}
                                              sm={12}
                                              md={
                                                !sidebarCollapsed &&
                                                deviceWidth < 825
                                                  ? 24
                                                  : 12
                                              }
                                              lg={
                                                !sidebarCollapsed
                                                  ? 12
                                                  : deviceWidth < 1050
                                                  ? 12
                                                  : 8
                                              }
                                              xl={8}
                                            >
                                              <OrderItem order={order} />
                                            </Col>
                                          )
                                        )
                                      ) : (
                                        <NoOrders text="Fulfilled" />
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      {menuFilter == "cancelled" ? (
                                        <>
                                          {cancelledOrders &&
                                          cancelledOrders.length > 0 ? (
                                            <>
                                              {cancelledOrders.map(
                                                (order: any, index: number) => (
                                                  <Col
                                                    key={index}
                                                    xs={12}
                                                    sm={12}
                                                    md={
                                                      !sidebarCollapsed &&
                                                      deviceWidth < 825
                                                        ? 24
                                                        : 12
                                                    }
                                                    lg={
                                                      !sidebarCollapsed
                                                        ? 12
                                                        : deviceWidth < 1050
                                                        ? 12
                                                        : 8
                                                    }
                                                    xl={8}
                                                  >
                                                    <OrderItem order={order} />
                                                  </Col>
                                                )
                                              )}
                                              {ordersMore && (
                                                <Col
                                                  key={"teo"}
                                                  xs={12}
                                                  sm={12}
                                                  md={
                                                    !sidebarCollapsed &&
                                                    deviceWidth < 825
                                                      ? 24
                                                      : 12
                                                  }
                                                  lg={
                                                    !sidebarCollapsed
                                                      ? 12
                                                      : deviceWidth < 1050
                                                      ? 12
                                                      : 8
                                                  }
                                                  xl={8}
                                                >
                                                  <OrderItemSkeleton />
                                                </Col>
                                              )}
                                            </>
                                          ) : (
                                            <NoOrders text="Cancelled" />
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {" "}
                                          {menuFilter == "closed" && (
                                            <>
                                              {closedOrders &&
                                              closedOrders.length > 0 ? (
                                                <>
                                                  {closedOrders.map(
                                                    (
                                                      order: any,
                                                      index: number
                                                    ) => (
                                                      <Col
                                                        key={index}
                                                        xs={12}
                                                        sm={12}
                                                        md={
                                                          !sidebarCollapsed &&
                                                          deviceWidth < 825
                                                            ? 24
                                                            : 12
                                                        }
                                                        lg={
                                                          !sidebarCollapsed
                                                            ? 12
                                                            : deviceWidth < 1050
                                                            ? 12
                                                            : 8
                                                        }
                                                        xl={8}
                                                      >
                                                        <OrderItem
                                                          order={order}
                                                        />
                                                      </Col>
                                                    )
                                                  )}
                                                  {ordersMore && (
                                                    <Col
                                                      key={"teo"}
                                                      xs={12}
                                                      sm={12}
                                                      md={
                                                        !sidebarCollapsed &&
                                                        deviceWidth < 825
                                                          ? 24
                                                          : 12
                                                      }
                                                      lg={
                                                        !sidebarCollapsed
                                                          ? 12
                                                          : deviceWidth < 1050
                                                          ? 12
                                                          : 8
                                                      }
                                                      xl={8}
                                                    >
                                                      <OrderItemSkeleton />
                                                    </Col>
                                                  )}
                                                </>
                                              ) : (
                                                <NoOrders text="Closed" />
                                              )}
                                            </>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <></>
                  )
                }
              </Row>
              {/* <Modal
              
              style={style.detailModal}
              width={"fit-content"}
              open={IsUpdateOrderModalVisible}
              onCancel={handleUpdateOrderClick}
              footer={null}
            >
              {clickedOrder && <ViewOrder />}
            </Modal> */}
            </div>
          </div>
        </div>
      )}
      <Modal
        key={refetchKey}
        // key={Date.now()}
        style={{
          top: 130,
          right: 22,
          border: `12px solid #202225`,
          height: "845px",
          borderRadius: "20px",
          position: "absolute",
          overflowX: "hidden",
          overflowY: "hidden",
        }}
        width={"696px"}
        open={IsUpdateOrderModalVisible}
        onCancel={handleCloseOrderTableClick}
        footer={null}
      >
        <ViewOrder key={refetchKey} tableId={clickedOrder} />
      </Modal>
    </>
  );
}

export default OrdersContent;
