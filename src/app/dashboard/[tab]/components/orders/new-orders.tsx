import { Col, Flex, Row, theme } from "antd";
import React, { useEffect, useState } from "react";
import OrderItem from "./order-item";
import { Order } from "@/utils/interfaces";
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import NoOrders from "./no-orders";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { useOrderContext } from "@/app/providers/OrderProvider";

interface NewOrdersProps {
  orders: Order[];
  // action: () => any;
  optionClicked: boolean;
  handleOptionClicked: () => any;
}

function NewOrders({ orders }: NewOrdersProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(1);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [ordersPerPage, setOrdersPerPage] = useState(3);
  const deviceWidth = useWindowWidth();
  const { sidebarCollapsed } = useThemeContext();

  const { isOrderStatUpdating, statusUpdatedOrder } = useOrderContext();

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

  // const ordersPerPage = deviceWidth < 890 ? 2 : 3;

  const filteredOrders = orders.filter(
    (order: any) => order.status.toLowerCase() === "new"
  );

  const filteredOrdersWithIndex = filteredOrders.map((order, index) => ({
    ...order,
    filteredIndex: index + 1,
  }));
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleIsScrolled = (state: boolean) => {
    setIsScrolled(state);
  };
  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
    setActiveTab(activeTab > 1 ? activeTab - 1 : activeTab);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    setActiveTab(activeTab > 1 ? activeTab + 1 : activeTab);
  };

  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const {
    token: { colorTextBase, geekblue10, geekblue9, purple1 },
  } = theme.useToken();

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      handleIsScrolled(true);
      const delta = event.deltaY;
      if (delta > 0 && currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      } else if (delta < 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    // Add event listener to the document
    document.addEventListener("wheel", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("wheel", handleScroll);
    };
  }, [currentPage, totalPages]);

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    setTouchEndX(event.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50 && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }

    if (touchStartX - touchEndX < -50 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (filteredOrders && filteredOrders.length === 0) {
    return <NoOrders text="new" />;
  }

  const changeCurrentPage = (orderIndex?: number) => {
    if (
      totalPages !== 1 &&
      orderIndex &&
      orderIndex % 3 == 1 &&
      currentPage === totalPages
    ) {
      if (orderIndex == filteredOrdersWithIndex.length) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div style={{ width: "100vw" }}>
      <div
        // style={{ overflowX: "hidden", whiteSpace: "nowrap" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Row
          gutter={[16, 16]}
          style={{ height: "70vh", width: "100%", marginLeft: "5px" }}
        >
          {filteredOrdersWithIndex
            .slice(startIndex, endIndex)
            .map((order, orderIndex) =>
              orderIndex === endIndex ? (
                // <Col key={orderIndex} xs={24} sm={12} md={16} lg={16} xl={16}>
                <Col
                  key={orderIndex}
                  xs={24}
                  sm={12}
                  md={ordersPerPage === 2 ? 12 : 8}
                  lg={8}
                  xl={8}
                >
                  <OrderItem
                    order={order}
                    isScrolled={isScrolled}
                    handleIsScrolled={handleIsScrolled}
                    filteredIndex={order.filteredIndex}
                    changeCurrentPage={changeCurrentPage}
                  />
                </Col>
              ) : (
                // <Col key={orderIndex} xs={24} sm={12} md={8} lg={8} xl={8}>
                <Col
                  key={orderIndex}
                  xs={12}
                  sm={12}
                  md={!sidebarCollapsed && deviceWidth < 825 ? 24 : 12}
                  lg={!sidebarCollapsed ? 12 : deviceWidth < 1050 ? 12 : 8}
                  xl={8}
                >
                  <OrderItem
                    order={order}
                    isScrolled={isScrolled}
                    handleIsScrolled={handleIsScrolled}
                    filteredIndex={order.filteredIndex}
                    changeCurrentPage={changeCurrentPage}
                  />
                </Col>
              )
            )}
        </Row>
      </div>
      <div style={{ position: "relative" }}>
        <Flex
          align="center"
          justify="space-between"
          style={{ padding: "0.4rem 1rem 0 1rem", marginTop: "13px" }}
        >
          <div></div>
          <Flex vertical={false} gap={"1rem"} style={{ marginLeft: "5.5rem" }}>
            {[...Array(totalPages)].map((_, index) => (
              <div
                key={index}
                style={{
                  height: "10px",
                  width: orders.length > 50 ? "10px" : "30px",
                  backgroundColor:
                    index + 1 === currentPage ? geekblue9 : "transparent",
                  border:
                    index + 1 === currentPage ? "" : `1px solid ${geekblue9}`,
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
                onClick={() => {
                  setCurrentPage(index + 1);
                }} // Update currentPage on click
              />
            ))}
          </Flex>
          <Flex align="center" gap={"31px"}>
            {
              currentPage > 1 ? (
                <IoIosArrowDropleftCircle
                  fontSize="1.5rem"
                  style={{
                    color: colorTextBase,
                  }}
                  onClick={handlePrevPage}
                />
              ) : (
                <IoIosArrowDropleft
                  style={{
                    color: geekblue10,
                  }}
                  fontSize="1.5rem"
                />
              )

              // <button onClick={handlePrevPage}>Previous</button>
            }

            <span style={{ color: colorTextBase, fontWeight: 500 }}>{`${
              filteredOrders.length - 3 * currentPage >= 0
                ? (filteredOrders.length - 3 * currentPage)
                    .toString()
                    .padStart(2, "")
                : "0"
            } More`}</span>
            {currentPage < totalPages ? (
              // <button >Next</button>
              <IoIosArrowDroprightCircle
                fontSize="1.5rem"
                style={{
                  color: colorTextBase,
                }}
                onClick={handleNextPage}
              />
            ) : (
              <IoIosArrowDropright
                style={{
                  color: geekblue10,
                }}
                fontSize="1.5rem"
              />
            )}
          </Flex>
        </Flex>
        {isOrderStatUpdating &&
          filteredOrders &&
          filteredOrders.some((order) => order.id == statusUpdatedOrder) && (
            <div
              style={{
                color: purple1,
                position: "absolute",
                bottom: 4,
                left: 32,
              }}
            >
              {"Orders Moved to Preparing"}
            </div>
          )}
      </div>
    </div>
  );
}

export default NewOrders;
