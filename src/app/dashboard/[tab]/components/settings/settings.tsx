import React from "react";
import { Tabs, Layout, theme } from "antd";
import type { TabsProps } from "antd";
import GeneralSettings from "./general-settings";

import OrderSettings from "./order-settings";
import { useQuery } from "@apollo/client";
import { GET_RESTAURANT } from "@/lib/queries/restaurants";
import { useSettingsContext } from "@/app/providers/SettingsProvider";
//import BankSettings from "./bank-settings";

const { Content } = Layout;

function SettingsPage() {
  const {
    token: { colorBgBase, colorBgContainer },
  } = theme.useToken();
  const onChange = (_key: string) => {};
  const { settingActiveTab } = useSettingsContext();

  let restaurant_id: number | null = null;
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("lono_restaurant_id");
    if (storedId) {
      restaurant_id = parseInt(storedId, 10);
    }
  }

  const { data, loading, refetch } = useQuery<any>(GET_RESTAURANT, {
    variables: {
      id: restaurant_id,
    },

    onError: (_error: any) => {},
  });
  // useEffect(() => {
  //   console.log("loading", loading);
  //   if (isUpdatingOrderStatus) {
  //     if (!loading) {
  //       setIsUpdatingOrderStatus(false);
  //     }
  //   }
  // }, [loading]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "General Settings",
      children: (
        <GeneralSettings
          generalSettingsData={data}
          generalSettingsDataLoading={loading}
          generalSettingsDataRefetch={refetch}
        />
      ),
    },
    {
      key: "2",
      label: "Order Settings",
      children: (
        <OrderSettings
          isOrderActive={data && data.getRestaurant.ordering_active}
          settingDataLoading={loading}
          settingsDataRefetch={refetch}
        />
      ),
    } /*
    {
      key: "3",
      label: "Bank Settings",
      children: (
        <BankSettings
          bankData={data}
          settingsDataLoading={loading}
          settingsDataRefetch={refetch}
        />
      ),
    },*/,
    // {
    //   key: "3",
    //   label: "Subscription Settings",
    //   children: "Content of Subscription Settings",
    // },
  ];
  return (
    <Content
      style={{
        background: colorBgBase,
        padding: "1rem",
        height: "90vh",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: colorBgContainer,
          borderRadius: "15px",
          padding: "0.8rem 2.5rem",
          width: "100%",
        }}
      >
        <Tabs
          defaultActiveKey={settingActiveTab}
          items={items}
          onChange={onChange}
        />
      </div>
    </Content>
  );
}
export default SettingsPage;
