"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/providers/AuthProvider";
import React from "react";
import { Layout } from "antd";
import AppSidebar from "../../../components/sidebar";
import PageContent from "./page-content";
import PageHeader from "./page-header";
import MobileNotice from "@/app/components/mobile-notice";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import { OrderProvider } from "@/app/providers/OrderProvider";
import { TableProvider } from "@/app/providers/TableProvider";
import { HandwaveProvider } from "@/app/providers/HandwaveProvider";
import { WebSocketProvider } from "@/app/providers/WebSocketProvider";
function PageLayout({ tab }: { tab: string }) {
  const { getCurrentSession } = useAuthContext();
  const { replace } = useRouter();
  const [isMobile, setIsMobile] = useState<any>(null);

  const deviceWidth = useWindowWidth();

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsMobile(deviceWidth <= 767);
      }, 500);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [deviceWidth]);

  useEffect(() => {
    const handleCollapsed = () => {
      const isCollapsed = localStorage.getItem("isCollapsed");

      if (!isCollapsed) {
        localStorage.setItem("isCollapsed", "false");
      }
    };

    handleCollapsed();
  }, []);

  useEffect(() => {
    try {
      getCurrentSession()
        .then((user: any) => {
          if (!user) {
            replace("/auth/sign-in");
          }
        })
        .catch((_error: any) => {});
    } catch (_error) {}
  }, []);

  return (
    <Layout>
      {" "}
      <WebSocketProvider>
        <HandwaveProvider>
          <OrderProvider>
            <AppSidebar tab={tab} />
            {isMobile ? (
              <Layout>
                <MobileNotice />
              </Layout>
            ) : (
              <Layout>
                <TableProvider>
                  <PageHeader tab={tab} />
                  <PageContent tab={tab} />{" "}
                </TableProvider>
              </Layout>
            )}{" "}
          </OrderProvider>
        </HandwaveProvider>
      </WebSocketProvider>
    </Layout>
  );
}

export default PageLayout;
