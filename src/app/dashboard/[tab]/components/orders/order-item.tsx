import style from "@/styles/orders/order-item";
import { Button, Col, Flex, Row, theme, Card } from "antd";
import { IoMdArrowForward, IoMdCloseCircle } from "react-icons/io";
// import { LuPencil } from "react-icons/lu";
import { RiPencilFill } from "react-icons/ri";
import React, { useEffect, useState } from "react";
// import { BiUndo } from "react-icons/bi";
// import { BiRedo } from "react-icons/bi";
// import { MdOutlinePrint } from "react-icons/md";
import OrderCancel from "./order-cancel";
import EditOrder from "./edit-order";
import { UPDATE_ORDER_STATUS } from "@/lib/mutations/orders";
import { useMutation, useLazyQuery } from "@apollo/client";
import { BsThreeDots } from "react-icons/bs";
import { Spin } from "antd";
import { useOrderContext } from "@/app/providers/OrderProvider";
import { useWindowWidth } from "@react-hook/window-size/throttled";

import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { PiArrowArcRightBold } from "react-icons/pi";
import { PiArrowArcLeftBold } from "react-icons/pi";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { GET_TABLE_ORDER_COUNT } from "@/lib/queries/orders";
import { Order } from "@/utils/interfaces";

/*interface GroupedItemOption {
  type: string;
  titles: string[];
}*/

/*interface ItemOption {
  id: number;
  type: string;
  title: string;
  choices: {
    label: number;
    price: number;
  };
}*/

interface OrderItemProps {
  order: Order;
  action?: (table: any) => any;
  handleIsScrolled?: (state: boolean) => any;
  isScrolled?: boolean;
  filteredIndex?: number;
  changeCurrentPage?: (orderIndex?: number) => void;
}
function OrderItem({
  order,
  isScrolled,
  handleIsScrolled,
  filteredIndex,
  changeCurrentPage,
}: OrderItemProps) {
  const {
    id,
    table,
    customer,
    order_no,
    status,
    // orderStatusChange,
    date,
    is_bumped,
    items,
    orderDetails,
    amount,
    cancelled_reason,
    is_active,
    bounce_reset,
  } = order;
  const { sidebarCollapsed } = useThemeContext();
  const {
    token: {
      colorBgContainer,
      colorTextBase,
      colorText,
      colorTextDescription,
      colorFillContent,
      colorFillSecondary,
      colorFillAlter,
      colorInfoText,
      green3,
      yellow1,
      yellow4,
      purple3,
      blue2,
      blue5,
      blue7,
      red3,
      colorTextLightSolid,
      colorBgBase,
      orange1,
      colorPrimaryBg,
      green5,
      orange10,
      colorBgContainerDisabled,
      geekblue8,
      colorWhite,
      cyan10,
      cyan9,
      geekblue7,
      purple4,
    },
  } = theme.useToken();

  // function groupItemOptions(items: any): GroupedItemOption[] {
  //   const groupedOptions: { [type: string]: string[] } = {};

  //   items.forEach((item: any) => {
  //     if (item.item_options) {
  //       item.item_options.forEach((option: any) => {
  //         if (groupedOptions[option.type]) {
  //           if (!groupedOptions[option.type].includes(option.title)) {
  //             groupedOptions[option.type].push(option.title);
  //           }
  //         } else {
  //           groupedOptions[option.type] = [option.title];
  //         }
  //       });
  //     }
  //   });

  //   const groupedItemOptions: GroupedItemOption[] = [];
  //   for (const type in groupedOptions) {
  //     if (Object.prototype.hasOwnProperty.call(groupedOptions, type)) {
  //       groupedItemOptions.push({ type, titles: groupedOptions[type] });
  //     }
  //   }

  //   return groupedItemOptions;
  // }

  /*const groupItemOptions = (itemOptions: any): GroupedItemOption[] => {
    const groupedOptions: { [type: string]: string[] } = {};

    itemOptions.forEach((option: any) => {
      if (groupedOptions[option.type]) {
        if (!groupedOptions[option.type].includes(option.title)) {
          groupedOptions[option.type].push(option.title);
        }
      } else {
        groupedOptions[option.type] = [option.title];
      }
    });

    const groupedItemOptions: GroupedItemOption[] = [];
    for (const type in groupedOptions) {
      if (Object.prototype.hasOwnProperty.call(groupedOptions, type)) {
        groupedItemOptions.push({ type, titles: groupedOptions[type] });
      }
    }

    return groupedItemOptions;
  };*/

  const [getOrders, { }] = useLazyQuery<any>(GET_TABLE_ORDER_COUNT, {
    fetchPolicy: "network-only", // or 'no-cache'
  });

  let orderStatusColor = green3;
  if (status.toLowerCase() === "fulfilled" && !is_active) {
    orderStatusColor = purple4;
  } else if (status.toLowerCase() == "new") {
    orderStatusColor = yellow1;
  } else if (status.toLowerCase() === "preparing") {
    orderStatusColor = blue2;
  } else if (status.toLowerCase() === "fulfilled") {
    orderStatusColor = green5;
  } else if (status.toLowerCase() === "cancelled") {
    orderStatusColor = red3;
  } else {
    orderStatusColor = "red";
  }

  const deviceWidth = useWindowWidth();
  // const [isMobile, setIsMobile] = useState<any>(null);

  const [isExpandClicked, setIsExpandClicked] = useState(false);
  // const [moreItemCount, setMoreItemCount] = useState(0);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [editModalVisibility, setEditModalVisibility] = useState(false);
  const [isPressUpdate, setIsPressUpdate] = useState(false);
  const [customerNameLength, setCustomerNameLength] = useState("");
  const {
    setActiveTab,
    handleIsOrderUpdated,
    handleUpdateOrderClick,
    setOrderIndividual,
    closeModalTrigger,
    setCloseModalTrigger,
    isInEditOrder,
    handleIsInOrderEdit,
    currentlyEditingOrder,
    handleCurrentlyOrderEdit,
    previousSelectedTable,
    handleSelectNameCard,
    handlePreviousSelectedTable,
    statusUpdatedOrder,
    setStatusUpdatedOrder,
    setIsOrderStatUpdating,
  } = useOrderContext();

  // const [isMediumScreen, setIsMediumScreen] = useState(false);
  // const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (deviceWidth < 1285) {
          // setIsMediumScreen(deviceWidth < 1285);
        } else if (deviceWidth < 821) {
          // setIsSmallScreen(deviceWidth < 821);
        } else if (deviceWidth <= 767) {
          // setIsMobile(deviceWidth <= 767);
        }
      }, 500);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [deviceWidth]);

  useEffect(() => {
    if (deviceWidth < 825 && !sidebarCollapsed) {
      setCustomerNameLength("35vw");
    } else if (deviceWidth < 825 && sidebarCollapsed) {
      setCustomerNameLength("13vw");
    } else if (deviceWidth < 900 && !sidebarCollapsed) {
      setCustomerNameLength("8vw");
    } else if (deviceWidth < 900 && sidebarCollapsed) {
      setCustomerNameLength("13vw");
    } else if (deviceWidth < 950 && !sidebarCollapsed) {
      setCustomerNameLength("10vw");
    } else if (deviceWidth < 950 && sidebarCollapsed) {
      setCustomerNameLength("15vw");
    } else if (deviceWidth < 1000 && !sidebarCollapsed) {
      setCustomerNameLength("13vw");
    } else if (deviceWidth < 1050 && sidebarCollapsed) {
      setCustomerNameLength("18vw");
    } else if (deviceWidth < 1200 && sidebarCollapsed) {
      setCustomerNameLength("7vw");
    } else if (deviceWidth < 1100 && !sidebarCollapsed) {
      setCustomerNameLength("17vw");
    } else if (deviceWidth < 1300 && sidebarCollapsed) {
      setCustomerNameLength("10vw");
    } else if (deviceWidth < 1200 && !sidebarCollapsed) {
      setCustomerNameLength("19vw");
    } else if (deviceWidth < 1270 && !sidebarCollapsed) {
      setCustomerNameLength("6vw");
    } else if (deviceWidth < 1350 && !sidebarCollapsed) {
      setCustomerNameLength("8vw");
    } else if (deviceWidth < 1500 && sidebarCollapsed) {
      setCustomerNameLength("13vw");
    } else if (deviceWidth < 1450 && !sidebarCollapsed) {
      setCustomerNameLength("10vw");
    } else if (deviceWidth < 2000 && sidebarCollapsed) {
      setCustomerNameLength("15vw");
    } else if (deviceWidth < 1900 && !sidebarCollapsed) {
      setCustomerNameLength("12vw");
    } else if (deviceWidth < 2500 && !sidebarCollapsed) {
      setCustomerNameLength("16vw");
    } else {
      setCustomerNameLength("20vw");
    }
  }, [deviceWidth, sidebarCollapsed]);
  let expandButton = false;
  let moreItemCount = 0;

  // const handleEditClick = () => {
  //   // setEditClicked(!editClicked);
  // };
  const handleEditClose = () => {
    // if (editClicked) {
    //   setEditClicked(!editClicked);
    // }
  };
  if (items.length > 4) {
    expandButton = true;
    moreItemCount = items.length - 4;
  }

  const handleExpandClick = () => {
    setIsExpandClicked(true);

    setTimeout(() => {
      setIsExpandClicked(false);
    }, 20000);
  };

  const [updateOrderStatus, { loading }] = useMutation(UPDATE_ORDER_STATUS);

  const handleUpdateOrderStatus = async (
    orderId: number,
    newStatus: string,
    isBubmped?: boolean,
    bounceReset?: boolean,
    isActive?: boolean,
    tableId?: number
  ) => {
    try {
      setStatusUpdatedOrder(orderId);
      setIsOrderStatUpdating(true);
      await updateOrderStatus({
        variables: {
          orderInput: {
            id: orderId,
            status: newStatus,
            is_bumped: isBubmped,
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
      handleIsOrderUpdated();
    } catch (_error) {
      console.log(_error);
    }
  };

  const handleOrderButtonClick = async (
    _orderId: number,
    _orderStatus: string,
    tableID: number
  ) => {
    switch (_orderStatus.toLowerCase()) {
      case "new":
        if (is_bumped) {
          await handleUpdateOrderStatus(
            _orderId,
            "preparing",
            false,
            true,
            true,
            tableID
          );
          changeCurrentPage && changeCurrentPage(filteredIndex);
        } else {
          await handleUpdateOrderStatus(
            _orderId,
            "preparing",
            false,
            false,
            true,
            tableID
          );
          changeCurrentPage && changeCurrentPage(filteredIndex);
        }
        break;
      case "preparing":
        if (is_bumped) {
          handleUpdateOrderStatus(
            _orderId,
            "fulfilled",
            false,
            true,
            true,
            tableID
          );
        } else {
          handleUpdateOrderStatus(
            _orderId,
            "fulfilled",
            false,
            false,
            true,
            tableID
          );
        }
        break;
      case "fulfilled":
        await handleUpdateOrderStatus(
          _orderId,
          "fulfilled",
          false,
          false,
          false,
          tableID
        );

        setCloseModalTrigger(!closeModalTrigger);
        setActiveTab("tableview");
        setOrderIndividual(customer.id);
        //need to change
        try {
          console.log("table.id:---------------------", table.id);
          console.log(
            "type of table.id:---------------------",
            typeof table.id
          );
          const restID =
            localStorage.getItem("lono_restaurant_id") &&
            parseInt(localStorage.getItem("lono_restaurant_id")!);
          console.log("restID", restID);
          console.log("type of restID", typeof restID);
          const { data } = await getOrders({
            variables: {
              table_id: table.id,
              resturant_id:
                localStorage.getItem("lono_restaurant_id") &&
                parseInt(localStorage.getItem("lono_restaurant_id")!),
            },
          });
          console.log("Orders data:---------------------", data);
          console.log(
            "Orders data:---------------------",
            data.getTableOrderCount
          );
          if (data.getTableOrderCount > 0) {
            handleUpdateOrderClick(table.id);
          }
          // Handle the response data here
        } catch (error) {
          console.error("Error fetching order count :", error);
        }

        if (previousSelectedTable != table.id || previousSelectedTable == 0) {
          handlePreviousSelectedTable(table.id);
        } else {
          handleSelectNameCard();
        }

        // handleUpdateOrderStatus(_orderId, "fulfilled",false,false,false);
        break;
      // case "delivered":
      //   // finish order
      //   break;

      default:
        break;
    }
  };

  const handleBumpClick = (_orderId: number, _orderStatus: string) => {
    if (_orderStatus.toLowerCase() === "preparing") {
      handleUpdateOrderStatus(_orderId, "new", true, false, true);
    } else {
      handleUpdateOrderStatus(_orderId, "preparing", true, false, true);
    }
  };

  const handleCancelOrderClick = () => {
    // if (editClicked) {
    //   setEditClicked(!editClicked);
    // }
    setDeleteModalVisibility(!deleteModalVisibility);
  };

  const handleEditOrderClick = () => {
    if (isScrolled) {
      handleIsScrolled && handleIsScrolled(false);
    }

    handleCurrentlyOrderEdit(id);
    setEditModalVisibility(!editModalVisibility);
    handleIsInOrderEdit(); // need to change
  };

  const handleMoveToFulfilled = async () => {
    if (is_bumped) {
      await handleUpdateOrderStatus(id, "fulfilled", false, true, true);
      changeCurrentPage && changeCurrentPage(filteredIndex);
    } else {
      await handleUpdateOrderStatus(id, "fulfilled", false, false, true);
      changeCurrentPage && changeCurrentPage(filteredIndex);
    }
    handleIsOrderUpdated();
  };
  useEffect(() => {
    if (isScrolled) {
      if (editModalVisibility) {
        setEditModalVisibility(!editModalVisibility);
        handleIsScrolled && handleIsScrolled(false);
        handleIsInOrderEdit();
      }

      // handleIsScrolled && handleIsScrolled();
    }
  }, [isScrolled]);

  const dateObj = new Date(date);
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // const handleEditedOrderSubmit = () => {};

  const newStatus: MenuProps["items"] = [
    {
      key: "CancelOrder",
      label: (
        <div style={style.cancelOrder} onClick={handleCancelOrderClick}>
          <IoMdCloseCircle style={{ marginRight: 6, fontSize: 16 }} />
          <p
            style={{
              margin: 0,
              fontSize: 14,
              marginTop: "auto",
              marginBottom: "auto",
            }}
          >
            cancel the order
          </p>
        </div>
      ),
    },
    {
      key: "EditItems",
      label: (
        <div style={style.editItems} onClick={handleEditOrderClick}>
          <p
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              fontSize: 14,
            }}
          >
            {" "}
            <RiPencilFill style={{ marginRight: 6, fontSize: 16 }} />
            edit items
          </p>
        </div>
      ),
    },
    {
      key: "MoveToServed",
      label: (
        <div style={style.editItems} onClick={handleMoveToFulfilled}>
          <p
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              fontSize: 14,
            }}
          >
            {" "}
            <PiArrowArcRightBold style={{ marginRight: 6, fontSize: 16 }} />
            move to fulfilled
          </p>
        </div>
      ),
    },
  ];

  const menuNewStatusProps = {
    items: newStatus,
    backgroundColor: colorBgContainerDisabled,
  };

  const inProgressOrFullFilledStatus: MenuProps["items"] = [
    {
      key: "CancelOrder",
      label: (
        <div
          style={style.cancelOrder}
          onClick={() => handleBumpClick(id, status)}
        >
          <PiArrowArcLeftBold
            style={{ marginRight: 6, fontSize: 16, marginTop: -10 }}
          />
          <p
            style={{
              margin: 0,
              fontSize: 14,
              marginTop: -10,
              marginBottom: "auto",
            }}
          >
            Send back
          </p>
        </div>
      ),
    },
  ];
  const menuInProgressOrFullFilledStatusProps = {
    items: inProgressOrFullFilledStatus,
    backgroundColor: colorBgContainerDisabled,
  };

  const completedMenuProps = {
    items: [],
    backgroundColor: colorBgContainerDisabled,
  };

  function ShortenName({ name }: { name: string }) {
    return (
      <span
        style={{
          color: status.toLowerCase() === "new" ? colorTextLightSolid : cyan10,
          fontSize: "17px",
          fontWeight: "600",
          lineHeight: "20.57px",
          textOverflow: "ellipsis",
          overflow: "hidden",
          width: customerNameLength,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
    );
  }

  return (
    <Card
      style={{
        background:
          status.toLowerCase() === "new"
            ? is_bumped
              ? orange10
              : yellow4
            : colorBgContainer,
        opacity: isInEditOrder //need to change
          ? editModalVisibility && currentlyEditingOrder === id
            ? 1
            : status.toLowerCase() === "new"
              ? 0.2
              : 1
          : 1,
        border: is_bumped ? (is_active ? `1px solid ${orange1}` : "") : "",
        ...style.orderItemContainer,
        transition:
          loading && statusUpdatedOrder === id
            ? "all 1.5s ease-in-out"
            : "none",
        transform:
          loading && statusUpdatedOrder === id
            ? "scaleY(1) translateY(-300%)"
            : "scaleY(1) translate(0, 0)",
        // width: loading && statusUpdatedOrder === id ? 0 : "100%",
        // height: loading && statusUpdatedOrder === id ? 0 : "100%",
        // overflow: "hidden",
      }}
      onClick={handleEditClose}
      size="small"
      bordered={false}
      actions={[
        <div
          key="footer-of-card"
          style={{ margin: "0 12px 7px 12px", height: "89px" }}
        >
          {!editModalVisibility ? (
            <div style={style.orderBottomSection}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!editModalVisibility && (
                  <div
                    style={{
                      backgroundColor: colorFillAlter,
                      marginTop:
                        status.toLowerCase() === "cancelled" ||
                          (status.toLowerCase() === "fulfilled" && !is_active)
                          ? "3.1rem"
                          : "0rem",
                      ...style.horizontalLine,
                    }}
                  />
                )}
                {expandButton && !isExpandClicked && (
                  <div
                    style={{
                      color: colorTextLightSolid,
                      background: purple3,
                      ...style.expandButton,
                    }}
                    onClick={handleExpandClick}
                  >
                    {moreItemCount} MORE ITEMS
                  </div>
                )}
              </div>
              {status.toLowerCase() === "cancelled" ? (
                <span style={{ textAlign: "right" }}>
                  <span
                    style={{
                      color: cyan9,
                      fontSize: "14px",
                      fontWeight: "400",
                    }}
                  >
                    Cancelled due to
                    <span> {cancelled_reason}</span>
                  </span>
                </span>
              ) : (
                <>
                  <div style={style.totalRow}>
                    <span
                      style={{
                        color:
                          status.toLowerCase() === "new"
                            ? colorTextLightSolid
                            : colorPrimaryBg,
                        ...style.totalRowText,
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        color:
                          status.toLowerCase() === "new"
                            ? colorTextLightSolid
                            : colorPrimaryBg,
                        ...style.totalRowText,
                      }}
                    >
                      ${amount ? amount.toFixed(2) : null}
                    </span>
                  </div>
                  {status.toLowerCase() === "fulfilled" && !is_active ? (
                    <></>
                  ) : (
                    <Flex
                      align="center"
                      gap={16}
                      style={{ margin: "-13.5px 0px 0 0px" }}
                    >
                      {
                        status.toLowerCase() != "cancelled" && (
                          <Dropdown
                            menu={
                              status.toLowerCase() === "new"
                                ? menuNewStatusProps
                                : status.toLowerCase() === "preparing" ||
                                  status.toLowerCase() === "fulfilled"
                                  ? menuInProgressOrFullFilledStatusProps
                                  : completedMenuProps
                            }
                            placement="topLeft"
                            arrow
                          >
                            <div
                              style={{
                                color:
                                  status.toLowerCase() === "new"
                                    ? colorBgBase
                                    : colorTextBase,
                                border:
                                  status.toLowerCase() === "new"
                                    ? `2px solid ${colorBgBase}`
                                    : `1px solid ${colorTextBase}`,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "30%",
                                padding: "0.5rem",
                                cursor: "pointer",
                              }}
                            >
                              <BsThreeDots />
                            </div>
                          </Dropdown>
                        )
                        // )
                      }
                      <div style={style.closeBtnContainer}>
                        <Button
                          // onClick={action}
                          style={{
                            background:
                              status.toLowerCase() === "new"
                                ? colorBgBase
                                : !is_active
                                  ? blue7
                                  : colorFillContent,
                            color:
                              status.toLowerCase() === "new"
                                ? colorText
                                : !is_active
                                  ? blue5
                                  : colorTextLightSolid,
                            ...style.closeBtn,
                          }}
                          disabled={!is_active || loading}
                          onClick={() =>
                            handleOrderButtonClick(id, status, table.id)
                          }
                          block
                        >
                          {/* {statusChange} */}
                          {status.toLowerCase() === "new"
                            ? "Preparing"
                            : status.toLowerCase() === "preparing"
                              ? "Fulfilled"
                              : status.toLowerCase() === "fulfilled" && is_active
                                ? "Close"
                                : "Closed"}
                          {loading ? (
                            <Spin style={{ marginLeft: "0.5rem" }} />
                          ) : (
                            is_active && (
                              <IoMdArrowForward
                                style={{ ...style.arrowIcon }}
                              />
                            )
                          )}
                        </Button>
                      </div>
                    </Flex>
                  )}
                </>
              )}
            </div>
          ) : (
            <div style={style.orderBottomSection}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: colorFillAlter,
                  ...style.horizontalLine,
                  marginTop: "1.4rem",
                }}
              />

              <Flex style={{ marginTop: "0rem" }} justify="space-between">
                <Button
                  htmlType="button"
                  size="large"
                  block
                  onClick={handleEditOrderClick}
                  style={{
                    border: `1px solid ${geekblue8}`,
                    backgroundColor: "transparent",
                    color: geekblue8,
                    width: "116px",
                    height: "36px",
                    fontWeight: "700",
                  }}
                >
                  Cancel
                </Button>

                <Button
                  htmlType="button"
                  size="large"
                  style={{
                    width: "150px",
                    height: "36px",
                    backgroundColor: geekblue8,
                    color: colorWhite,
                  }}
                  block
                  onClick={() => setIsPressUpdate(true)}
                  disabled={isPressUpdate}
                >
                  <b>
                    {isPressUpdate ? (
                      <>
                        Update <Spin style={{ marginLeft: "0.5rem" }} />
                      </>
                    ) : (
                      "Update"
                    )}
                  </b>
                </Button>
              </Flex>
            </div>
          )}
        </div>,
      ]}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginLeft: "4px",
          marginRight: "0.9px",
        }}
      >
        <div style={{ padding: "0 0px", ...style.orderItemHeader }}>
          {/* tablle no */}
          <div
            style={{
              fontSize: "1.125rem",
              minWidth: "65px",
              height: "57.77px",
              color: colorPrimaryBg,
              backgroundColor:
                status.toLowerCase() === "new" ? colorBgBase : colorInfoText,
              ...style.orderItemNo,
            }}
          >
            <p style={{ ...style.tableOrderHeaderText }}>Table</p>
            <p
              style={{
                fontSize: "22px",
                fontWeight: 600,
                margin: 0,
              }}
            >
              {table.table_number < 10
                ? `0${table.table_number}`
                : table.table_number}
            </p>
          </div>

          {/* order name */}
          <div
            style={{
              width: "100%",
              marginLeft: "-3px",
              marginTop: "-6px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
              }}
            >
              <ShortenName name={customer.name} />

              <span
                style={{
                  color:
                    status.toLowerCase() === "new"
                      ? colorTextLightSolid
                      : colorTextDescription,
                  fontSize: "15px",
                  fontWeight: 400,
                  lineHeight: "18.15px",
                  marginTop: "-4.00px",
                }}
              >
                Seat {customer.index}
              </span>
            </div>
          </div>

          {/* order status */}
          <div
            style={{
              // width: 84,
              height: 24,
              color: colorBgBase,
              padding: "0.5rem 1rem",
              fontSize: "11px",
              fontWeight: 700,
              lineHeight: "15.73px",

              backgroundColor:
                is_bumped && !bounce_reset && is_active
                  ? orange1
                  : orderStatusColor,
              ...style.orderStatus,
              minWidth: "95px",
            }}
          >
            {is_bumped && !bounce_reset && is_active
              ? "Bounced"
              : !is_active && status.toLowerCase() === "fulfilled"
                ? "Closed"
                : status == "preparing"
                  ? "Preparing"
                  : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </div>
        </div>

        {/* order date */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
            marginBottom: "13px",
          }}
        >
          <span
            style={{
              color:
                status.toLowerCase() === "new" ? colorTextLightSolid : cyan9,
              ...style.orderDate,
            }}
          >
            Order #{order.order_no}{" "}
          </span>
          <span
            style={{
              color:
                status.toLowerCase() === "new" ? colorTextLightSolid : cyan9,
              ...style.orderDate,
              marginLeft: "auto",
              marginRight: "5px",
            }}
          >
            {formattedDate.toUpperCase()}{" "}
          </span>
          <span
            style={{
              color:
                status.toLowerCase() === "new"
                  ? colorTextLightSolid
                  : colorFillSecondary,
              ...style.orderTime,
            }}
          >
            {formattedTime}
          </span>
        </div>

        <div
          style={{
            height: "1px",
            width: "100%",
            backgroundColor: colorFillAlter,
            marginBottom: "13.5px",
            marginTop: "-9.51px",
          }}
        />

        {editModalVisibility && !isScrolled ? (
          <EditOrder
            orderId={id}
            orderItems={items}
            orderDetails={orderDetails}
            handleEditModalVisibility={handleEditOrderClick}
            isPressUpdate={isPressUpdate}
            setIsPressUpdate={setIsPressUpdate}
          />
        ) : (
          <Col
            style={{
              padding: "0",
            }}
          >
            <Row justify={"space-between"} style={{ marginBottom: -4 }}>
              <Col
                style={{
                  color:
                    status.toLowerCase() === "new"
                      ? colorTextLightSolid
                      : geekblue7,
                  fontSize: "12px",
                  textAlign: "start",
                  fontWeight: "400",
                  width: "80%",
                  lineHeight: "14.52px",
                  //border: "1px solid blue",
                }}
              >
                Items
              </Col>
              <Col
                style={{
                  width: "20%",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "13px",
                  fontWeight: "400",
                  //border: "1px solid red",
                }}
              >
                <Col
                  style={{
                    color:
                      status.toLowerCase() === "new"
                        ? colorTextLightSolid
                        : geekblue7,
                    fontSize: "12px",
                    textAlign: "right",
                    fontWeight: 400,
                    lineHeight: "14.52px",
                    // marginLeft: 20,
                  }}
                >
                  Qty
                </Col>
                <Col
                  style={{
                    color:
                      status.toLowerCase() === "new"
                        ? colorTextLightSolid
                        : geekblue7,
                    fontSize: "12px",
                    textAlign: "right",
                    fontWeight: 400,
                    lineHeight: "14.52px",
                    marginRight: "20px",
                  }}
                >
                  Price
                </Col>
              </Col>
            </Row>
            {isExpandClicked
              ? orderDetails.map((orderDetail, index) => {
                const item = items.filter(
                  (item1) => item1.id === orderDetail.item_id
                )[0];
                return (
                  <Row
                    key={index}
                    justify={"space-between"}
                    style={{ padding: "8px 2px 0px 0px" }}
                  >
                    <div
                      style={{
                        width: "65%",
                        color:
                          status.toLowerCase() === "new"
                            ? colorBgBase
                            : colorPrimaryBg,
                        textAlign: "start",
                        // fontWeight: status.toLowerCase() === "new" ? 600 : 0,
                        // border: "1px solid red",
                        wordWrap: "break-word",
                        boxSizing: "border-box",
                        fontSize: "16px",
                        fontWeight: 500,
                        lineHeight: "14px",
                      }}
                    >
                      {/* {isSmallScreen && item.name.length > 16
                    ? `${item.name.slice(0, 13)}...`
                    : isMediumScreen && item.name.length > 22
                    ? `${item.name.slice(0, 19)}...`
                    : item.name} */}
                      {item.name}
                      <>
                        {item.item_options &&
                          item.item_options.length > 0 && (
                            <>
                              {orderDetail.order_item_options.map(
                                (orderItemOptionDetail, indexOption) => {
                                  const option = item.item_options.filter(
                                    (itemOption) =>
                                      itemOption.id ===
                                      orderItemOptionDetail.item_option_id
                                  )[0];
                                  const choice =
                                    option.choices[
                                    orderItemOptionDetail.choice_index
                                    ];
                                  return (
                                    <div
                                      key={indexOption}
                                      style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        marginTop: "9px",
                                        marginLeft: "18px",
                                        color:
                                          status.toLowerCase() === "new"
                                            ? colorBgBase
                                            : cyan9,
                                      }}
                                    >
                                      <div
                                        style={{
                                          marginTop: "1.5px",
                                          fontSize: "12px",
                                          fontWeight: 400,
                                          lineHeight: "16.94px",
                                          minWidth: "85px",
                                        }}
                                      >
                                        {option.type.toUpperCase()}
                                      </div>

                                      {" : "}

                                      <div
                                        style={{
                                          marginTop: "0.5px",
                                          fontSize: "13px",
                                          fontWeight: 500,
                                          lineHeight: "16.94px",
                                          marginLeft: "8px",
                                        }}
                                      >
                                        {choice.label}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </>
                          )}
                      </>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "16px",
                        // gap: 6,
                        // fontWeight: status.toLowerCase() === "new" ? 700 : 0,
                        fontSize: "15px",
                        fontWeight: 600,
                      }}
                    >
                      <div
                        style={{
                          color:
                            status.toLowerCase() === "new"
                              ? colorBgBase
                              : colorPrimaryBg,
                          textAlign: "right",
                          // fontWeight: status.toLowerCase() === "new" ? 700 : 0,
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        {
                          orderDetails.find(
                            (itemDetail) => itemDetail.item_id === item.id
                          )?.quantity
                        }
                      </div>
                      <div
                        style={{
                          color:
                            status.toLowerCase() === "new"
                              ? colorBgBase
                              : colorPrimaryBg,
                          textAlign: "right",
                          // fontWeight: status.toLowerCase() === "new" ? 700 : 0,
                          minWidth: "3rem",
                          fontSize: "14px",
                          fontWeight: 400,
                        }}
                      >
                        ${/* {item.price} */}
                        {`${item.price?.toFixed(2) ?? 0}`}
                      </div>
                    </div>
                  </Row>
                );
              })
              : orderDetails.slice(0, 4).map((orderDetail, index) => {
                const item = items.filter(
                  (item1) => item1.id === orderDetail.item_id
                )[0];
                return (
                  <>
                    {item && (
                      <Row
                        key={index}
                        justify={"space-between"}
                        style={{ padding: "8px 2px 0px 0px" }}
                      >
                        <div
                          style={{
                            width: "65%",
                            color:
                              status.toLowerCase() === "new"
                                ? colorBgBase
                                : colorPrimaryBg,
                            textAlign: "start",
                            // fontWeight: status.toLowerCase() === "new" ? 700 : 0,

                            wordWrap: "break-word",
                            boxSizing: "border-box",
                            fontSize: "14px",
                            fontWeight: 500,
                            lineHeight: "18px",
                          }}
                        >
                          {/* {isSmallScreen && item.name.length > 16
                      ? `${item.name.slice(0, 13)}...`
                      : isMediumScreen && item.name.length > 22
                      ? `${item.name.slice(0, 19)}...`
                      : item.name} */}
                          {item.name}
                          <>
                            {item.item_options &&
                              item.item_options.length > 0 && (
                                <>
                                  {orderDetail.order_item_options.map(
                                    (orderItemOptionDetail, indexOption) => {
                                      const option = item.item_options.filter(
                                        (itemOption) =>
                                          itemOption.id ===
                                          orderItemOptionDetail.item_option_id
                                      )[0];
                                      const choice =
                                        option?.choices[
                                        orderItemOptionDetail.choice_index
                                        ];
                                      return (
                                        <div
                                          key={indexOption}
                                          style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            marginTop: "9px",
                                            marginLeft: "18px",
                                            color:
                                              status.toLowerCase() === "new"
                                                ? colorBgBase
                                                : cyan9,
                                          }}
                                        >
                                          <div
                                            style={{
                                              marginTop: "1.5px",
                                              fontSize: "12px",
                                              fontWeight: 400,
                                              lineHeight: "16.94px",
                                              minWidth: "85px",
                                            }}
                                          >
                                            {option?.type.toUpperCase()}
                                          </div>

                                          {" : "}

                                          <div
                                            style={{
                                              marginTop: "0.5px",
                                              fontSize: "13px",
                                              fontWeight: 500,
                                              lineHeight: "16.94px",
                                              marginLeft: "8px",
                                            }}
                                          >
                                            {choice.label}
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </>
                              )}
                          </>
                          {/* <>
                      {item.item_options && item.item_options.length > 0 && (
                        <>
                          {item.item_options.map((option, index) => (
                            <div key={index} style={{ display: "flex" }}>
                              <div>{option.type}</div>
                              {" : "}
                              <div>{option.title}</div>
                            </div>
                          ))}
                        </>
                      )}
                    </> */}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "16px",
                            // gap: 6,
                            // fontWeight: status.toLowerCase() === "new" ? 700 : 0,
                            fontSize: "15px",
                            fontWeight: 600,
                          }}
                        >
                          <div
                            style={{
                              color:
                                status.toLowerCase() === "new"
                                  ? colorBgBase
                                  : "#DBDBDB",
                              textAlign: "right",
                              lineHeight: "18px",
                              // fontWeight: status.toLowerCase() === "new" ? 700 : 0,
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                          >
                            {
                              orderDetails.find(
                                (itemDetail) => itemDetail.item_id === item.id
                              )?.quantity
                            }
                          </div>
                          <div
                            style={{
                              color:
                                status.toLowerCase() === "new"
                                  ? colorBgBase
                                  : "#DBDBDB",
                              textAlign: "right",
                              // fontWeight: status.toLowerCase() === "new" ? 700 : 0,
                              minWidth: "3rem",
                              fontSize: "14px",
                              fontWeight: 400,
                            }}
                          >
                            ${/* {item.price} */}
                            {`${item.price?.toFixed(2) ?? 0}`}
                          </div>
                        </div>
                      </Row>
                    )}
                  </>
                );
              })}
          </Col>
        )}
      </div>

      <OrderCancel
        modalVisibility={deleteModalVisibility}
        action={handleCancelOrderClick}
        orderId={id}
        orderNo={order_no}
        orderName={customer.name}
        tableID={table.id}
      />
    </Card>
  );
}

export default OrderItem;
