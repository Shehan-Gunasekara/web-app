import React, { useState } from "react";
import { Layout, theme } from "antd";
import MenuHeader from "./menu-header";
import LeftContent from "./left-content";
import { MenuProvider } from "@/app/providers/MenuProvider";

const { Content } = Layout;

function MenuPage() {
  const {
    token: { colorBgBase },
  } = theme.useToken();

  const [menuLoading, setMenuLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [itemLoading, setItemLoading] = useState(true);
  const [menuError, setMenuError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [itemError, setItemError] = useState(false);
  const [callRetry, setCallRetry] = useState(false);

  return (
    <Content style={{ background: colorBgBase }}>
      <MenuProvider>
        <div
          style={{ height: "90vh", overflowY: "scroll", overflowX: "hidden" }}
        >
          <MenuHeader
            menuLoading={menuLoading}
            itemLoading={itemLoading}
            categoryLoading={categoryLoading}
            menuError={menuError}
            categoryError={categoryError}
            itemError={itemError}
            setCallRetry={setCallRetry}
            callRetry={callRetry}
          />
          <div style={{ padding: "0 1rem" }}>
            <LeftContent
              setMenuLoading={setMenuLoading}
              setCategoryLoading={setCategoryLoading}
              setItemLoading={setItemLoading}
              setMenuError={setMenuError}
              setCategoryError={setCategoryError}
              setItemError={setItemError}
              callRetry={callRetry}
            />

            {/* <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <LeftContent />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <RightContent cardDetails={cardDetails} />
            </Col>
          </Row> */}
          </div>
        </div>
      </MenuProvider>
    </Content>
  );
}

export default MenuPage;
