import { TbChefHat } from "react-icons/tb";
import { GiChickenOven } from "react-icons/gi";
import { PiForkKnifeFill } from "react-icons/pi";
import { Row, Layout, Col, theme, Input, Space } from "antd";
import style from "@/styles/menu/menu-header";
import { useMenuContext } from "@/app/providers/MenuProvider";
import MenuCardHeaderSkeleton from "@/app/components/skeletons/menu/menu-card-header";
import MenuSearchSkeleton from "@/app/components/skeletons/menu/menu-search";
import { IoMdSearch } from "react-icons/io";
import LoadingErrorHandler from "@/app/components/errors/loadingErrorHandler";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import { useEffect, useState } from "react";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { dashboardMetrics } from "@/constants/lonovm-constants";
// import type { SearchProps } from "antd/es/input/Search";

interface MenuItemProps {
  menuLoading: boolean;
  itemLoading: boolean;
  categoryLoading: boolean;
  menuError: boolean;
  categoryError: boolean;
  itemError: boolean;
  setCallRetry: (value: boolean) => void;
  callRetry: boolean;
}
function MenuHeader({
  menuLoading,
  itemLoading,
  categoryLoading,
  menuError,
  categoryError,
  itemError,
  setCallRetry,
  callRetry,
}: MenuItemProps) {
  const {
    token: {
      colorBgBase,
      // colorTextLabel,
      colorPrimaryBg,
      colorFillSecondary,
      colorBgContainerDisabled,
      colorBgContainer,
      colorTextLightSolid,
    },
  } = theme.useToken();
  const { sidebarCollapsed } = useThemeContext();

  const {
    menuCount,
    categoryCount,
    itemCount,
    specialMenuCount,
    specialCategoryCount,
    specialItemCount,
    selectedLabel,
    setSearchValue,
    archivedCategoryCount,
    archivedItemCount,
    archivedMenuCount,
  } = useMenuContext();

  // const [searchValue, setSearchValue] = useState("");
  const { md, lg, xl } = useBreakpoint();
  const deviceWidth = useWindowWidth();
  const [isLargerScreen, setisLargerScreen] = useState(false);

  useEffect(() => {
    if (deviceWidth >= 846) {
      setisLargerScreen(true);
    } else if (deviceWidth < 846) {
      setisLargerScreen(false);
    }
  }, [deviceWidth]);

  const handleSearchInput = (e: any) => {
    setSearchValue(e.target.value);
  };

  if (menuError || categoryError || itemError) {
    return (
      <div style={{ margin: "10px 16px 30px 16px" }}>
        <LoadingErrorHandler
          handleRetryClick={() => {
            setCallRetry(!callRetry);
          }}
          text="header counts"
        />
      </div>
    );
  }

  const renderTotalCount = (metric: string): number => {
    if (metric == dashboardMetrics.menu) {
      // This selected label should be read from a constant]
      //    not a hard coded string
      if (selectedLabel == "Specials")
        return specialMenuCount < 10
          ? `0${specialMenuCount}`
          : specialMenuCount;
      if (selectedLabel == "Archived")
        return archivedMenuCount < 10
          ? `0${archivedMenuCount}`
          : archivedMenuCount;

      return menuCount < 10 ? `0${menuCount}` : menuCount;
    } else if (metric == dashboardMetrics.category) {
      if (selectedLabel == "Specials")
        return specialCategoryCount < 10
          ? `0${specialCategoryCount}`
          : specialCategoryCount;
      if (selectedLabel == "Archived")
        return archivedCategoryCount < 10
          ? `0${archivedCategoryCount}`
          : archivedCategoryCount;

      return categoryCount < 10 ? `0${categoryCount}` : categoryCount;
    } else {
      if (selectedLabel == "Specials")
        return specialItemCount < 10
          ? `0${specialItemCount}`
          : specialItemCount;
      if (selectedLabel == "Archived")
        return archivedItemCount < 10
          ? `0${archivedItemCount}`
          : archivedItemCount;

      return itemCount < 10 ? `0${itemCount}` : itemCount;
    }
  };

  return (
    <Layout
      style={{
        background: colorBgBase,
        ...style.menuManagementHeader,
      }}
    >
      <Row>
        {/* {menuError ||
          categoryError ||
          itemError && (
            <LoadingErrorHandler
              handleRetryClick={() => {}}
              text="header counts"
            />
          ))} */}

        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 14 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
        >
          <Row style={style.rowSpaceBetween}>
            <>
              {!menuLoading && (menuCount || menuCount === 0) ? (
                <div
                  style={{
                    ...style.menuHeaderInfo,
                    marginLeft: -18,
                    padding: xl
                      ? "0 2rem"
                      : lg
                        ? deviceWidth < 1091
                          ? deviceWidth < 1007
                            ? "0 0.8rem"
                            : "0 1rem"
                          : "0 1.5rem"
                        : md
                          ? "0 1rem"
                          : "0 1rem",
                  }}
                >
                  <div style={style.menuHeaderInfoContent}>
                    <span
                      style={{
                        color: "#A1A1A1",
                        ...style.menuText,
                      }}
                    >
                      Menus
                    </span>
                  </div>
                  <div
                    style={{
                      ...style.menuHeaderInfoContentDown,
                      gap: lg ? "1.5rem" : isLargerScreen ? "1rem" : "0.5rem",
                    }}
                  >
                    <PiForkKnifeFill
                      fontSize={deviceWidth < 805 ? "1.5rem" : "2.5rem"}
                      color={"#A1A1A1"}
                    />
                    <span
                      style={{
                        color: colorFillSecondary,
                        fontSize: deviceWidth < 805 ? "1.5rem" : "24px",
                        ...style.menuTextSpan,
                      }}
                    >
                      {/* {menuCount < 10 ? `0${menuCount}` : menuCount} */}
                      {renderTotalCount(dashboardMetrics.menu)}
                    </span>
                  </div>
                </div>
              ) : (
                <div>{<MenuCardHeaderSkeleton />}</div>
              )}

              <div
                style={{
                  borderRight: `1px solid ${colorBgContainerDisabled}`,
                  ...style.verticalLine,
                }}
              ></div>

              {!categoryLoading && (categoryCount || categoryCount === 0) ? (
                <div
                  style={{
                    ...style.menuHeaderInfo,
                    padding: xl
                      ? "0 2rem"
                      : lg
                        ? deviceWidth < 1085
                          ? deviceWidth < 1007
                            ? "0 0.8rem"
                            : "0 1rem"
                          : "0 1.5rem"
                        : md
                          ? "0 1rem"
                          : "0 1rem",
                  }}
                >
                  <div style={style.menuHeaderInfoContent}>
                    <span
                      style={{
                        color: "#A1A1A1",
                        ...style.menuText,
                      }}
                    >
                      Categories
                    </span>
                  </div>
                  <div
                    style={{
                      ...style.menuHeaderInfoContentDown,
                      gap: lg ? "1.5rem" : isLargerScreen ? "1rem" : "0.5rem",
                    }}
                  >
                    <TbChefHat
                      fontSize={deviceWidth < 805 ? "1.5rem" : "2.5rem"}
                      color={"#A1A1A1"}
                    />
                    <span
                      style={{
                        color: colorFillSecondary,
                        fontSize: deviceWidth < 805 ? "1.5rem" : "24px",
                        ...style.menuTextSpan,
                      }}
                    >
                      {/* {categoryCount < 10 ? `0${categoryCount}` : categoryCount} */}
                      {renderTotalCount(dashboardMetrics.category)}
                    </span>
                  </div>
                </div>
              ) : (
                <MenuCardHeaderSkeleton />
              )}

              <div
                style={{
                  borderRight: `1px solid ${colorBgContainerDisabled}`,
                  ...style.verticalLine,
                }}
              ></div>

              {!itemLoading && (itemCount || itemCount === 0) ? (
                <div
                  style={{
                    ...style.menuHeaderInfo,
                    padding: xl
                      ? "0 2rem"
                      : lg
                        ? deviceWidth < 1085
                          ? deviceWidth < 1007
                            ? "0 0.8rem"
                            : "0 1rem"
                          : "0 1.5rem"
                        : md
                          ? "0 1rem"
                          : "0 1rem",
                  }}
                >
                  <div style={style.menuHeaderInfoContent}>
                    <span
                      style={{
                        color: "#A1A1A1",
                        ...style.menuText,
                      }}
                    >
                      Total Items
                    </span>
                  </div>
                  <div
                    style={{
                      ...style.menuHeaderInfoContentDown,
                      gap: lg ? "1.5rem" : isLargerScreen ? "1rem" : "0.5rem",
                    }}
                  >
                    <GiChickenOven
                      fontSize={deviceWidth < 805 ? "1.5rem" : "2.5rem"}
                      color={"#A1A1A1"}
                    />
                    <span
                      style={{
                        color: colorFillSecondary,
                        fontSize: deviceWidth < 805 ? "1.5rem" : "24px",
                        ...style.menuTextSpan,
                      }}
                    >
                      {/* {itemCount < 10 ? `0${itemCount}` : itemCount} */}
                      {renderTotalCount(dashboardMetrics.item)}
                    </span>
                  </div>
                </div>
              ) : (
                <MenuCardHeaderSkeleton />
              )}
            </>
          </Row>
        </Col>

        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 10 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
        >
          <Row>
            <div style={style.searchHeaderInfo}>
              <Space size={xl ? 40 : lg ? 20 : 10}>
                <div
                  style={{
                    background: colorBgContainer,
                    ...style.menuHeaderRight,
                    width: xl
                      ? 340
                      : lg
                        ? !sidebarCollapsed
                          ? 280
                          : 300
                        : deviceWidth > 805
                          ? !sidebarCollapsed
                            ? deviceWidth < 850
                              ? 170
                              : 200
                            : deviceWidth < 850
                              ? 230
                              : 250
                          : !sidebarCollapsed
                            ? 150
                            : 200,
                  }}
                >
                  {menuLoading || categoryLoading || itemLoading ? (
                    <MenuSearchSkeleton />
                  ) : (
                    // <Search
                    //   placeholder="input search text"
                    //   // onSearch={handleSearchInput}
                    //   onChange={handleSearchInput}
                    //   style={{
                    //     // background: colorPrimaryBg,
                    //     // color: colorTextLightSolid,
                    //     ...style.searchBar,
                    //   }}
                    // />

                    <>
                      <Input
                        placeholder={
                          deviceWidth < 995
                            ? "Search here..."
                            : "Search menu, category or item"
                        }
                        style={{
                          background: colorPrimaryBg,
                          color: colorTextLightSolid,
                          ...style.searchBar,
                        }}
                        onChange={(e: any) => handleSearchInput(e)}
                      />
                      <IoMdSearch style={style.searchIcon} />
                    </>
                  )}
                </div>
              </Space>
            </div>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}

export default MenuHeader;
