import { Row, Layout, Col, theme, Input, Select, ConfigProvider } from "antd";
import styles from "@/styles/orders/order-header";
import settingsStyles from "@/styles/orders/order-item";
import { IoMdSearch } from "react-icons/io";
import { MdTableRestaurant } from "react-icons/md";
// import { MdOutlinePrint } from "react-icons/md";
import { VscSettings } from "react-icons/vsc";
import { ChangeEvent, useEffect, useState } from "react";
import { GrDocumentText } from "react-icons/gr";
import { useOrderContext } from "@/app/providers/OrderProvider";
import { Button } from "antd";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import { useSettingsContext } from "@/app/providers/SettingsProvider";
import { useRouter } from "next/navigation";
interface OrderHeaderProps {
  isLoading?: boolean;
  handleTabChange: (tab: any) => any;
  handleSearch: (tab: any) => any;
  handleFilterChange: (tab: any) => any;
  orderCounts: any;
}

interface OrderCounts {
  [key: string]: number;
}
function OrderHeader({
  handleTabChange,
  handleSearch,
  orderCounts,
  handleFilterChange,
}: // orderCountAll,
OrderHeaderProps) {
  const {
    token: {
      colorBgBase,
      yellow1,
      blue2,
      green5,
      colorPrimaryBg,
      colorBgContainer,
      colorTextBase,
      red10,
      colorWhite,
      // colorInfoText,
      colorBgContainerDisabled,
      geekblue6,
    },
  } = theme.useToken();

  const { xl } = useBreakpoint();
  const deviceWidth = useWindowWidth();

  const [isCountEnlarged, setIsCountEnlarged] = useState(false);

  const handleButtonClick = () => {
    setIsCountEnlarged(true);
    setTimeout(() => {
      setIsCountEnlarged(false);
    }, 500); // Adjust the duration of the animation here
  };

  // const { orderId, orderStatus } = orderDetails;
  const { activeTab, setActiveTab, setIsInEditOrder } = useOrderContext();
  // const [isSettingClicked, setIsSettingClicked] = useState(false);
  // const [activeTab, setActiveTab] = useState("new");
  const [previousOrderCount, setPreviousOrderCount] = useState<OrderCounts>({});
  const isTabActive = (tab: any) => activeTab === tab;
  const { changeSettingActiveTab } = useSettingsContext();
  const router = useRouter();

  // const handleSettingsClick = () => {
  //   setIsSettingClicked(!isSettingClicked);
  // };
  const handleOrderSettingsClick = () => {
    changeSettingActiveTab("2");
    router.push(`/dashboard/settings`);
  };

  let circleColor;

  // const handleCancelledExpand = () => {
  //   setIsCancelledExpand(true);
  //   setTimeout(() => {
  //     setIsCancelledExpand(false);
  //   }, 6000);
  // };

  const handleTabClick = (tab: any) => {
    if (
      previousOrderCount.new > orderCounts.new ||
      orderCounts.new == undefined
    ) {
      setPreviousOrderCount((prevPreviousOrderCount: any) => ({
        ...prevPreviousOrderCount,
        new: orderCounts.new,
      }));
    }
    if (
      previousOrderCount.preparing > orderCounts.preparing ||
      orderCounts.preparing == undefined
    ) {
      setPreviousOrderCount((prevPreviousOrderCount: any) => ({
        ...prevPreviousOrderCount,
        preparing: orderCounts.preparing,
      }));
    }
    if (
      previousOrderCount.fulfilled > orderCounts.fulfilled ||
      orderCounts.fulfilled == undefined
    ) {
      setPreviousOrderCount((prevPreviousOrderCount: any) => ({
        ...prevPreviousOrderCount,
        fulfilled: orderCounts.fulfilled,
      }));
    }
    if (tab == "new") {
      setPreviousOrderCount((prevPreviousOrderCount: any) => ({
        ...prevPreviousOrderCount,
        new: orderCounts.new,
      }));
      circleColor = yellow1;
    } else if (tab == "preparing") {
      setPreviousOrderCount((prevPreviousOrderCount: any) => ({
        ...prevPreviousOrderCount,
        preparing: orderCounts.preparing,
      }));
      circleColor = blue2;
    } else if (tab == "fulfilled") {
      setPreviousOrderCount((prevPreviousOrderCount: any) => ({
        ...prevPreviousOrderCount,
        fulfilled: orderCounts.fulfilled,
      }));
      circleColor = green5;
    }
    setActiveTab(tab);
    handleTabChange(tab);
    setIsInEditOrder(false);
  };
  useEffect(() => {
    if (previousOrderCount == undefined) {
      setPreviousOrderCount(orderCounts);
    }
    setPreviousOrderCount((prevPreviousOrderCount: any) => ({
      ...prevPreviousOrderCount,
      new: orderCounts.new,
    }));
    setPreviousOrderCount((prevPreviousOrderCount: any) => ({
      ...prevPreviousOrderCount,
      preparing: orderCounts.preparing,
    }));
    setPreviousOrderCount((prevPreviousOrderCount: any) => ({
      ...prevPreviousOrderCount,
      fulfilled: orderCounts.fulfilled,
    }));
  }, []);

  useEffect(() => {
    handleButtonClick();
  }, [orderCounts]);

  const renderTab = (tab: any, label: string, count?: number) => {
    let circleTextColor = colorBgBase;
    if (orderCounts.new == 0) {
      setPreviousOrderCount((prevPreviousOrderCount: any) => ({
        ...prevPreviousOrderCount,
        new: orderCounts.new,
      }));
    }
    if (orderCounts.preparing == 0) {
      setPreviousOrderCount((prevPreviousOrderCount: any) => ({
        ...prevPreviousOrderCount,
        preparing: orderCounts.preparing,
      }));
    }
    if (orderCounts.fulfilled == 0) {
      setPreviousOrderCount((prevPreviousOrderCount: any) => ({
        ...prevPreviousOrderCount,
        fulfilled: orderCounts.fulfilled,
      }));
    }
    switch (tab) {
      case "new":
        if (previousOrderCount.new < (count || 0)) {
          circleColor = red10;
          circleTextColor = colorWhite;
        } else {
          if (previousOrderCount.new == undefined && (count || 0) > 0) {
            circleColor = red10;
            circleTextColor = colorWhite;
          } else {
            circleColor = yellow1;
          }
        }

        break;
      case "preparing":
        if (previousOrderCount.preparing < (count || 0)) {
          circleColor = red10;
          circleTextColor = colorWhite;
        } else {
          if (previousOrderCount.preparing == undefined && (count || 0) > 0) {
            circleColor = red10;
            circleTextColor = colorWhite;
          } else {
            circleColor = blue2;
          }
        }
        break;
      case "fulfilled":
        if (previousOrderCount.fulfilled < (count || 0)) {
          circleColor = red10;
          circleTextColor = colorWhite;
        } else {
          if (previousOrderCount.fulfilled == undefined && (count || 0) > 0) {
            circleColor = red10;
            circleTextColor = colorWhite;
          } else {
            circleColor = green5;
          }
        }
        break;
      case "all":
        circleColor = "purple";
        break;
      default:
        circleColor = "red";
    }

    // if (circleColor == red10) {
    //   handleButtonClick();
    // }

    return (
      <div
        style={{
          color: isTabActive(tab) ? colorBgBase : colorTextBase,
          background: isTabActive(tab) ? colorTextBase : colorBgBase,
          minWidth: "120px",
          height: "30px",
          ...styles.menuHeaderLeft,
          padding: "8px 0px",
        }}
        onClick={() => handleTabClick(tab)}
      >
        {count != null && count > 0 && (
          <div>
            <div
              className={
                circleColor == red10 && isCountEnlarged ? "enlarge glow" : ""
              }
              style={{
                backgroundColor: circleColor,
                ...styles.headerItems,
                width: "20px",
                height: "20px",
                outline: "0 solid rgba(255, 255, 255, 0.5)",
                borderRadius:
                  count >= 1000 ? "30%" : count >= 100 ? "40%" : "50%",
              }}
            >
              <span
                style={{ color: circleTextColor, ...styles.headerItemsText }}
              >
                {count}
              </span>
            </div>
          </div>
        )}

        {label}
      </div>
    );
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  const items: MenuProps["items"] = [
    {
      key: "OrderSettings",
      label: (
        <div
          style={settingsStyles.editItems}
          onClick={handleOrderSettingsClick}
        >
          <GrDocumentText style={settingsStyles.settingIcons} />
          <p style={settingsStyles.settingTexts}>Order Settings</p>
        </div>
      ),
    },
  ];

  const menuProps = {
    items,
    backgroundColor: colorBgContainerDisabled,
  };

  return (
    <Layout
      style={{
        background: colorBgBase,
        padding: "0px 1rem 0 1rem",
        marginBottom: -1,
        marginTop: -1,
        // position: "fixed",
      }}
    >
      <Row>
        {/* status */}
        <Col md={14}>
          <div
            style={{
              background: colorBgContainer,
              marginBottom: "0.5rem",
              padding: "5px",
              ...styles.menuHeaderLeftStatus,
              width: "514px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "8px",
                fontSize: "14px",
                fontWeight: 600,
                width: "120px",
                height: "30px",
              }}
            >
              {renderTab("new", "New", orderCounts.new)}
              {/* {renderTab("cooking", "Cooking", orderCounts.Cooking)} */}
              {renderTab("preparing", "Preparing", orderCounts.preparing)}
              {renderTab("fulfilled", "Fulfilled", orderCounts.fulfilled)}
              {renderTab("all", "All", 0)}
              {activeTab == "all" && (
                <ConfigProvider
                  theme={{
                    components: {
                      Select: {
                        optionSelectedBg: "transparent",
                        optionHeight: 36,
                      },
                    },
                  }}
                >
                  <Select
                    placeholder={"Filter"}
                    style={{
                      minWidth: "116px",
                      fontSize: "13px",
                      backgroundColor: colorBgContainer,
                      borderRadius: "15px",
                      marginLeft: "22px",
                      textAlign: "center",
                      color: geekblue6,
                    }}
                    dropdownStyle={{
                      backgroundColor: colorBgContainer,
                      fontSize: "13px",
                      color: geekblue6,
                    }}
                    variant="borderless"
                    options={[
                      { value: "all", label: "All Orders" },
                      { value: "new", label: "New" },
                      { value: "preparing", label: "Preparing" },
                      { value: "fulfilled", label: "Fulfilled" },
                      { value: "cancelled", label: "Cancelled" },
                      { value: "closed", label: "Closed" },
                    ]}
                    onChange={(val) => {
                      handleFilterChange(val);
                    }}
                  />
                </ConfigProvider>
              )}

              {/* <div onClick={handleCancelledExpand}>
                {isCancelledExpand ? (
                  renderTab("cancelled", "Cancelled")
                ) : (
                  <div
                    style={{
                      color: colorTextBase,
                      background: colorBgBase,
                      ...styles.menuHeaderLeft,
                      minWidth: xl ? "90px" : "65px",
                    }}
                  >
                    <IoIosArrowForward />
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </Col>

        {/* view */}
        <Col
          md={deviceWidth > 1170 ? 10 : 24}
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              // ...styles.menuHeaderMiddleBtn,
              // marginTop: 10,
              display: "flex",
              alignItems: "center",
              width: "fit-content",
              height: 50,
              borderRadius: "15px",
              margin: xl ? "10px 0px 0px 0px" : "10px 0px 0px auto",
              padding: xl ? "0 1rem 0.5rem 1rem" : "0 0.5rem 0.5rem 0.5rem",
              gap: xl ? "20px" : "10px",
            }}
          >
            {/* <Space size={20}> */}
            <div
              onClick={() => handleTabClick("tableview")}
              style={{
                color: isTabActive("tableview")
                  ? colorBgContainer
                  : colorTextBase,
                background: isTabActive("tableview")
                  ? colorTextBase
                  : "transparent",
                border: `1px solid ${colorTextBase}`,
                ...styles.tableContainer,
              }}
            >
              <MdTableRestaurant style={styles.tableText} />
              <p style={styles.tableTextCollapse}>Table View</p>
            </div>

            <Dropdown menu={menuProps} placement="bottomLeft" arrow>
              <Button
                style={{
                  width: "36px",
                  height: "36px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <VscSettings
                  style={{
                    width: "18.4px",
                    height: "18.4px",
                    marginLeft: "-7px",
                    marginTop: "3px",
                  }}
                />
              </Button>
            </Dropdown>
            {/* </Space> */}
          </div>
          {
            <Row>
              <div
                style={{
                  background: colorBgContainer,
                  ...styles.menuHeaderRight,
                }}
              >
                {/* <Search
                    placeholder="Search a name, order"
                    style={{
                      backgroundColor: colorPrimaryBg,
                    }}
                  /> */}

                <Input
                  placeholder={"Search name or order"}
                  style={{
                    background: colorPrimaryBg,
                    ...styles.searchBar,
                    fontSize: "12px",
                    color: colorBgBase,
                  }}
                  onChange={(e) => handleSearchInput(e)}
                  suffix={
                    <IoMdSearch
                      style={{
                        ...styles.searchIcon,
                      }}
                    />
                  }
                />
              </div>
            </Row>
          }
        </Col>
      </Row>
    </Layout>
  );
}

export default OrderHeader;
