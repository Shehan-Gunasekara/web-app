"use client";
import React from "react";
import HomePage from "./home/home";
// import AccountingPage from "./accounting/accounting";
import MenuPage from "./menu/menu";
import OrdersPage from "./orders/orders";
import SettingsPage from "./settings/settings";
import TablePage from "./table/table";
import ProfilePage from "./profile/profile";
import Handwave from "./handwave/handwave";

function PageContent({ tab }: { tab: string }) {
  switch (tab) {
    // case "dashboard":
    //   return <HomePage />;
    // case "accounting":
    //   return <AccountingPage />;
    case "menu":
      return <MenuPage />;
    case "orders":
      return <OrdersPage />;
    case "settings":
      return <SettingsPage />;
    case "table":
      return <TablePage />;
    case "profile":
      return <ProfilePage />;
    case "handwave":
      return <Handwave />;
    default:
      return <HomePage />;
  }
}

export default PageContent;
