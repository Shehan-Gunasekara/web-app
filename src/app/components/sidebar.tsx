"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Divider, theme } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useThemeContext } from "../providers/ThemeProvider";
import { useAuthContext } from "@/app/providers/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_RESTAURANT } from "@/lib/queries/restaurants";
import {
  useWindowHeight,
  useWindowWidth,
} from "@react-hook/window-size/throttled";
import { MdRestaurant, MdTableRestaurant, MdWavingHand } from "react-icons/md";
import { useSettingsContext } from "../providers/SettingsProvider";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiMoreHorizontal } from "react-icons/fi";
import ConfirmationModal from "./confirmation-modal";
import HandwaveNotification from "../dashboard/[tab]/components/handwave/handwave-notification";
import { useHandwaveContext } from "@/app/providers/HandwaveProvider";
import { useWebSocketContext } from "@/app/providers/WebSocketProvider";
import { useOrderContext } from "@/app/providers/OrderProvider";
import { GET_HANDWAVES_BY_RESTAURANT_ID } from "@/lib/queries/notifications";
const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function AppSidebar({ tab }: { tab: string }) {
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { signOutUser } = useAuthContext();
  const { changeSettingActiveTab } = useSettingsContext();
  const { isDarkMode, handleSideBarCollapse } = useThemeContext();
  const [isLogoutModelVisible, setIsLogoutModelVisible] = useState(false);
  const deviceWidth = useWindowWidth();
  const deviceHeight = useWindowHeight();
  const [isNotifyHandWave, setIsNotifyHandWave] = useState(false);
  const [isNotifyOrders, setIsNotifyOrders] = useState(false);
  const currentNoOfRequest = useRef<any>(null);
  const currentOrderNumber = useRef<any>(null);

  const [newRequestCount, setNewRequestCount] = useState<any>(null);
  const [newOrderCount, setNewOrderCount] = useState<any>(null);

  const {
    handwaves,
    setHandwaveHook,
    isNeedToRefetchHandWave,
    setIsNeedToRefetchHandWave,
  } = useHandwaveContext();

  const { orderData } = useOrderContext();
  const { message } = useWebSocketContext();
  const {
    token: { colorBgContainer, colorTextBase, colorBgBase, green8 },
  } = theme.useToken();

  let restaurant_id: number | null = null;
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("lono_restaurant_id");
    if (storedId) {
      restaurant_id = parseInt(storedId, 10);
    }
  }

  const {
    data: HandwaveData,

    refetch: refetchHandWaveRequest,
  } = useQuery<any>(GET_HANDWAVES_BY_RESTAURANT_ID, {
    variables: { id: restaurant_id },
    onCompleted: (handwaveData) => {
      setHandwaveHook(handwaveData.getAllNotificationsByRestaurantId);
    },
    onError: (error: any) => {
      console.error("[GraphQL error]:", error);
      if (error.networkError) {
        console.error(`[Network error]: ${error.networkError}`);
      }
    },
  });

  useEffect(() => {
    if (orderData.length > 0) {
      if (currentOrderNumber.current === null) {
        currentOrderNumber.current = orderData.length;
        setNewOrderCount(orderData.length);
      } else {
        if (currentOrderNumber.current < orderData.length && tab != "orders") {
          setIsNotifyOrders(true);
          setNewOrderCount(orderData.length - currentOrderNumber.current);
        } else if (tab === "orders") {
          setIsNotifyOrders(false);
          currentOrderNumber.current = orderData.length;
        }
      }
    }
  }, [orderData, tab]);

  useEffect(() => {
    if (HandwaveData) {
      setHandwaveHook(HandwaveData.getAllNotificationsByRestaurantId);
    }
  }, [HandwaveData]);

  useEffect(() => {
    if (handwaves.newRequest) {
      if (currentNoOfRequest.current === null) {
        currentNoOfRequest.current = handwaves.newRequest.length;
        setNewRequestCount(handwaves.newRequest.length);
      } else {
        if (
          currentNoOfRequest.current < handwaves.newRequest.length &&
          tab != "handwave"
        ) {
          setIsNotifyHandWave(true);
          setNewRequestCount(handwaves.newRequest.length);
          currentNoOfRequest.current = handwaves.newRequest.length;
        } else if (tab === "handwave") {
          setIsNotifyHandWave(false);
          setNewRequestCount(handwaves.newRequest.length);
          currentNoOfRequest.current = handwaves.newRequest.length;
        }
      }
    }
  }, [handwaves, tab]);

  useEffect(() => {
    if (message) {
      if (message.type === "new_handwave_request") {
        refetchHandWaveRequest();
      } else if (message.type === "new_order") {
        //refetchOrder(); <--breaks, maybe sidebar is higher than orderProvider?
      }
    }
  }, [message]);

  useEffect(() => {
    if (isNeedToRefetchHandWave) {
      refetchHandWaveRequest();
      setIsNeedToRefetchHandWave(false);
    }
  }, [isNeedToRefetchHandWave]);

  useEffect(() => {
    if (deviceWidth <= 1024) {
      setCollapsed(deviceWidth <= 1024);
    } else {
      const isCollapsed = localStorage.getItem("isCollapsed") == "true";
      setCollapsed(isCollapsed);
    }
    setIsContentLoaded(true);
  }, [deviceWidth]);

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key == "settings") {
      changeSettingActiveTab("1");
    }
    router.push(`/dashboard/${e.key}`);
  };

  const handleLogoutPopup = () => {
    setIsLogoutModelVisible(!isLogoutModelVisible);
  };

  const logout = (e: any) => {
    e.preventDefault();
    signOutUser().then(() => {
      router.replace("/auth/sign-in");
    });
  };

  // const logout: MenuProps["onClick"] = (_e) => {
  //   signOutUser().then(() => {
  //     router.replace("/auth/sign-in");
  //   });
  // };

  const profileClick = (_e: any) => {
    router.push("/dashboard/profile");
  };

  const handleIsCollapsed = (val: boolean) => {
    setCollapsed(val);
    localStorage.setItem("isCollapsed", val.toString());
    handleSideBarCollapse(val);
  };

  function Profile({ profession }: { profession: string }) {
    const { data, loading } = useQuery<any>(GET_RESTAURANT, {
      variables: {
        id: restaurant_id,
      },
    });
    const restaurantData = data && data.getRestaurant;
    return loading && !restaurantData ? (
      <></>
    ) : (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 0.5rem",
          padding: "0.5rem",
          borderRadius: "1rem",
          backgroundColor: tab == "profile" ? colorTextBase : colorBgBase,
          cursor: "pointer",
        }}
        onClick={profileClick}
        id="profileDiv"
      >
        <Image
          src={
            restaurantData?.image && !restaurantData?.image.startsWith("http")
              ? process.env.NEXT_PUBLIC_IMAGES_URL + restaurantData?.image
              : "/assets/chef-restuarant.png"
          }
          alt="Restuarant logo"
          width={50}
          height={50}
          style={{ borderRadius: "100%" }}
        />
        {!collapsed && (
          <div
            style={{
              marginLeft: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
                color: tab == "profile" ? colorBgBase : colorTextBase,
              }}
            >
              {restaurantData?.name ?? null}
            </span>
            <span
              style={{ color: tab == "profile" ? colorBgBase : colorTextBase }}
            >
              {profession}
            </span>
          </div>
        )}
      </div>
    );
  }
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  const handIcon = (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {" "}
      <p>Handwave</p>{" "}
      {isNotifyHandWave && (
        <p
          style={{
            marginLeft: "10px",
            marginTop: "24px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HandwaveNotification
            count={newRequestCount}
            isNotify={isNotifyHandWave}
          />
        </p>
      )}
    </div>
  );

  const handIconCollapsed = (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {" "}
      <p>
        <MdWavingHand size={18} />
      </p>{" "}
      {isNotifyHandWave && (
        <p
          style={{
            // marginLeft: "10px",
            marginTop: "-14px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HandwaveNotification
            count={newRequestCount}
            isNotify={isNotifyHandWave}
          />
        </p>
      )}
    </div>
  );

  const orderIcon = (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {" "}
      <p>Orders</p>{" "}
      {isNotifyOrders && (
        <p
          style={{
            marginLeft: "10px",
            marginTop: "24px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HandwaveNotification
            count={newOrderCount}
            isNotify={isNotifyOrders}
          />
        </p>
      )}
    </div>
  );

  const orderIconCollapsed = (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {" "}
      <p>
        <FileTextOutlined size={18} />
      </p>{" "}
      {isNotifyOrders && (
        <p
          style={{
            // marginLeft: "10px",
            marginTop: "-14px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HandwaveNotification
            count={newOrderCount}
            isNotify={isNotifyOrders}
          />
        </p>
      )}
    </div>
  );

  const childCollapedItems: MenuItem[] = [
    getItem("Table", "table", <MdTableRestaurant size={18} />),
    getItem("Orders", "orders", orderIconCollapsed),
    getItem("Menu", "menu", <MdRestaurant size={18} />),
    getItem("Handwave", "handwave", handIconCollapsed),
    getItem("Settings", "settings", <SettingOutlined />),
  ];

  const items: MenuItem[] = [
    getItem("Table", "table", <MdTableRestaurant size={18} />),
    getItem(orderIcon, "orders", <FileTextOutlined size={16} />),
    getItem("Menu", "menu", <MdRestaurant size={18} />),
    getItem(handIcon, "handwave", <MdWavingHand size={18} />),
    getItem("Settings", "settings", <SettingOutlined />),
  ];
  useEffect(() => {
    if (deviceHeight <= 390 + 40 * items.length) {
      setCollapsed(true);
    } else {
      const isCollapsed = localStorage.getItem("isCollapsed") == "true";
      setCollapsed(isCollapsed);
    }
    setIsContentLoaded(true);
  }, [deviceHeight]);
  const calculateLength = (itemHeight: number, offset: number): number => {
    return Math.max(0, Math.floor((window.innerHeight - offset) / itemHeight));
  };

  const setDefaultMenu = () => {
    const length = calculateLength(40, 400); // 40px per item, starting from 390px offset
    let menuItem = [];
    for (let i = 0; i < length && i < items.length; i++) {
      menuItem.push(items[i]);
    }
    return menuItem;
  };

  const setCollapsMenu = () => {
    const length = calculateLength(40, 360); // 40px per item, 390-40 offset for ... more
    var collapsItem: any[] = [];
    for (let i = 0; i < length && i < childCollapedItems.length; i++) {
      collapsItem.push(childCollapedItems[i]);
    }
    if (collapsItem.length < childCollapedItems.length) {
      //too short, add ...
      collapsItem.pop(); //make room for ...
      collapsItem.push({
        key: "sub1",
        icon: <FiMoreHorizontal style={{ color: "white" }} />,
        label: "More",
        children: [
          {
            key: "1-1",
            type: "group",
            children: [],
          },
        ],
      });
      const imp = collapsItem.length - 1;
      for (let i = collapsItem.length - 1; i < childCollapedItems.length; i++) {
        collapsItem[imp].children[0].children.push(childCollapedItems[i]);
      }
    }
    return collapsItem;
  };

  const profileItems: MenuItem[] = [
    getItem("Logout", "logout", <LogoutOutlined />),
  ];

  if (!isContentLoaded) return <></>;

  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => handleIsCollapsed(value)}
        trigger={null}
        style={{
          // position: deviceWidth < 890 ? "absolute" : "relative",
          // zIndex: 1000,
          backgroundColor: colorBgContainer,
          minHeight: "100vh",
          maxHeight: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "20px 28px",
          }}
        >
          {collapsed ? (
            <Image src={"/assets/logo.svg"} alt="Logo" width={30} height={44} />
          ) : (
            <Image
              src={
                isDarkMode
                  ? "/assets/lonovm_logo.svg"
                  : "/assets/lonovm_logo.svg"
              }
              alt="Logo"
              width={120}
              height={40}
            />
          )}
        </div>
        <div
          style={{
            margin:
              window.innerHeight < 680
                ? "0px 28px 0px 28px"
                : "50px 28px 40px 28px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: 4,
              border: `1px solid ${green8}`,
              cursor: "pointer",
              borderRadius: "4px",
              color: green8,
            }}
            onClick={() => handleIsCollapsed(!collapsed)}
          >
            {collapsed ? (
              <IoIosArrowForward size={18} />
            ) : (
              <IoIosArrowBack size={18} />
            )}
          </div>
        </div>{" "}
        {collapsed ? (
          <Menu
            defaultSelectedKeys={[tab]}
            mode="vertical"
            style={{
              backgroundColor: colorBgContainer,
              fontWeight: "bold",
              height: "20px",
              marginTop: window.innerHeight < 426 ? "0px" : "-20px",
            }}
            items={setCollapsMenu()}
            onClick={onClick}
            id="menuGeneral2"
          />
        ) : (
          <Menu
            defaultSelectedKeys={[tab]}
            mode="inline"
            style={{
              backgroundColor: colorBgContainer,
              fontWeight: "bold",
            }}
            items={setDefaultMenu()}
            onClick={onClick}
            id="menuGeneral"
          />
        )}
        <div style={{ position: "absolute", bottom: "0", width: "100%" }}>
          <div style={{ margin: "0 1rem", display: "none" }}>
            <Divider style={{ backgroundColor: colorBgBase }} />
          </div>
          <Profile profession="Owner" />
          <Menu
            mode="inline"
            selectable={false}
            style={{ backgroundColor: colorBgContainer, fontWeight: "bold" }}
            items={profileItems}
            onClick={handleLogoutPopup}
            id="menuGeneral3"
          />
        </div>
        <ConfirmationModal
          modalTitle={"Are you sure?"}
          modalVisibility={isLogoutModelVisible}
          message={`Are you sure you want to log out?`}
          btnCancelText="Cancel"
          btnConfirmText="Yes"
          handleCancelClick={handleLogoutPopup}
          handleConfirmClick={(e) => logout(e)}
        />
      </Sider>
    </>
  );
}

export default AppSidebar;
