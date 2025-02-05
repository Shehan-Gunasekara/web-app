import React from "react";
import PageLayout from "./components/page-layout";

export function generateStaticParams() {
  return [
    { tab: "menu" },
    { tab: "orders" },
    { tab: "settings" },
    { tab: "table" },
    { tab: "handwave" },
    { tab: "profile" },
    { tab: "error" },
  ];
}

const Dashboard = ({ params: { tab } }: { params: { tab: string } }) => {
  return <PageLayout tab={tab} />;
};

export default Dashboard;
