"use client";

import React, { createContext, useContext, useState } from "react";
import { ConfigProvider, ThemeConfig } from "antd";

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean | null>(
    () => {
      if (typeof window !== "undefined") {
        // Check if localStorage is available
        const isCollapsed = localStorage.getItem("isCollapsed");
        return isCollapsed !== null ? JSON.parse(isCollapsed) : false;
      }
      return false;
    }
  );

  const handleSideBarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const lightTheme: ThemeConfig = {
    components: {
      Button: {},
      Switch: {
        handleSize: 35,
        trackHeight: 40,
        handleBg: "rgba(39, 125, 84, 1)",
        colorPrimary: "rgba(39, 125, 84, 1)",
        colorPrimaryActive: "rgba(39, 125, 84, 1)",
      },
      Menu: {
        itemMarginBlock: "1.5rem",
        itemColor: "#000000",
        itemSelectedBg: "#000000",
        itemSelectedColor: "#FFFFFF",
        itemHoverBg: "#000000",
        itemHoverColor: "#FFFFFF",
      },
      Select: {
        colorBorder: "rgba(159, 159, 159, 0.30)",
        optionSelectedBg: "transparent",
      },
      Spin: {
        colorPrimary: "#FFFFFF",
      },
      Form: {
        labelColor: "#9D9D9D",
        labelFontSize: 14,
        margin: 0,
        padding: 0,
      },
      Segmented: {
        itemActiveBg: "#202225",
        itemColor: "#FFF",
        itemSelectedBg: "#FFF",
        itemSelectedColor: "#202225",
        itemHoverBg: "FFF",
        itemHoverColor: "rgba(255, 255, 255)",
      },
      Checkbox: {
        // colorPrimary: "#FFFFFF",
        // colorIcon: "#000",
        // colorIconHover: "#000",
      },
    },
    token: {
      colorBgBase: "#0B0B13",
      colorBgContainer: "#FAFAFA",
      colorTextBase: "#0C0C0C",
      // colorTextSecondary: "#737373",
      colorSuccess: "#277D54",
      colorError: "#A12A3F",
      colorWarning: "#FFC107",
      colorTextLightSolid: "#FFFFFF",
      colorText: "#000000",
      colorTextDescription: "#464646",
      colorFillContent: "#000000",
      colorFillAlter: "rgba(215, 215, 215, 1)",
      colorFillSecondary: "#1A1A1A",
      colorBgContainerDisabled: "#484848",
      colorBorder: "#rgba(159, 159, 159, 0.30)",
      colorTextLabel: "#9A9A9A",
      colorBgSpotlight: "#68FFB7",
      colorInfoActive: "#828697",
      colorInfoText: "#444650",

      colorTextDisabled: "#9E9E9E",
      colorPrimaryBg: "#141414",
      boxShadow: "#E0E0E0",
      blue1: "#3b7ff2",
      blue2: "rgba(105, 198, 250, 1)",
      blue3: "#C0C2C8",
      blue4: "rgba(59, 127, 242, 1)",
      purple1: "#6A83F4",
      purple2: "#4A5FBC",
      purple3: "rgba(193, 204, 251, 1)",
      green1: "#68ffb7",
      green2: "#277D54",
      green3: "rgba(138, 199, 170, 1)",
      green4: "rgba(39, 125, 84, 1)",
      green5: "#8AC7AA",
      green6: "#C3E9DD",
      green7: "rgba(195, 233, 221,0.08)",
      green9: "#7ADCAD",
      green10: "#8AD79E",
      yellow1: "rgba(250, 209, 148, 1)",
      yellow2: "rgba(255, 224, 177, 1)",
      yellow3: "rgba(91, 91, 91, 1)",
      yellow4: "#FFEBCD",
      yellow5: "#FDC47E",
      yellow6: "#DFDFD5",
      red1: "#EB6B7A",
      red2: "#910000",
      colorIcon: "#000000",
      colorBorderBg: "#333333",
      colorWhite: "#FFFFFF",
      colorBorderSecondary: "rgba(157, 157, 157, 1)",
      colorTextHeading: "#0C0C0C",
      colorTextSecondary: "#0C0C0C",
      colorTextTertiary: "#8f8f8f",
      colorErrorBorder: "##b81414",
      blue10: "#AEB3CB",
      blue9: "#9D9D9D",
      blue5: "#62636A",
      orange1: "#FFA78B",
      red10: "#F1213A",
      colorInfoBg: "#F5F5F5",
      colorInfoTextHover: "#B7B7B7",
      colorInfoBorder: "#A3A5AD",
      blue8: "#C0C1C8",
      blue7: "#202225",
      blue6: "#898E97",
      geekblue10: "rgba(217, 217, 217,0.3)",
      geekblue9: "#AEB7BE",
      orange10: "#F3BDA6",
      red3: "#FF7E86",
      geekblue8: "#212326",
      geekblue7: "#959494",
      geekblue6: "#CCCCCC",
      cyan10: "#E5E5E5",
    },
  };

  const darkTheme: ThemeConfig = {
    components: {
      Collapse: {
        contentBg: "#2F3135",
        headerBg: "#2F3135",
        contentPadding: "#2F3135",
        headerPadding: "#2F3135",
      },
      Upload: {
        colorBgMask: "red",
        colorFillAlter: "red",
        colorPrimary: "red",
        actionsColor: "red",
        colorBorder: "red",
        colorPrimaryHover: "red",
      },
      Input: { colorBgContainer: "#202225" },
      DatePicker: {
        controlItemBgActive: "#2F3135",
      },
      Radio: {
        colorPrimaryHover: "#FFFFFF",
        colorPrimaryBorder: "#FFFFFF",
        // colorPrimary: "transparent",
        colorPrimary: "#FFFFFF",
        dotSize: 10,
        colorBorder: "#FFFFFF",
      },
      Divider: {
        colorSplit: "rgba(77, 80, 86, 0.5)",
      },
      Tabs: {
        itemSelectedColor: "#FFFFFF",
        itemHoverColor: "#FFFFFF",
        itemActiveColor: "#FFFFFF",
        itemColor: "rgba(166, 166, 166, 1)",
        inkBarColor: "#FFFFFF",
        titleFontSize: 16,
        colorBorderSecondary: "transparent",
      },
      Button: {
        colorPrimaryHover: "none",
      },
      Card: {
        actionsBg: "none",
        actionsLiMargin: "0",
        padding: 0,
        colorBorderSecondary: "transparent",
      },
      Switch: {
        handleSize: 24,
        trackHeight: 30,
        trackMinWidth: 44,
        colorPrimary: "rgba(39, 125, 84, 1)",
        colorPrimaryActive: "#277D54",
        colorPrimaryHover: "rgba(39, 125, 84, 1)",
        colorTextTertiary: "#4E525A",
        colorTextLightSolid: "#FFFFFF",
        colorTextQuaternary: "#4E525A",
      },
      Dropdown: {
        colorBgElevated: "#4E525A",
        sizePopupArrow: 0,
      },
      Menu: {
        itemMarginBlock: "1.5rem",
        itemColor: "#FFFFFF",
        itemSelectedBg: "#FFFFFF",
        itemSelectedColor: "#000000",
        itemHoverBg: "#FFFFFF",
        itemHoverColor: "#000000",
        subMenuItemBg: "red",
        horizontalItemSelectedBg: "red",
      },
      Select: {
        // optionSelectedBg: "transparent",
        optionSelectedBg: "#202225",
        colorBorder: "#959494",
        borderRadius: 10,
        // selectorBg: "#202225",
        colorTextDisabled: "#595A5D",

        colorBgContainerDisabled: "transparent",
      },
      Spin: {
        colorPrimary: "#838383",
      },
      Form: {
        labelColor: "#9D9D9D",
        labelFontSize: 14,
        margin: 0,
        padding: 0,
      },
      Segmented: {
        itemActiveBg: "#202225",
        itemColor: "#FFF",
        itemSelectedBg: "#FFF",
        itemSelectedColor: "#202225",
        itemHoverBg: "FFF",
        itemHoverColor: "rgba(255, 255, 255)",
      },
      Modal: {
        // headerBg: "rgba(47, 49, 53, 1)",
        // contentBg: "rgba(47, 49, 53, 1)",
        // footerBg: "rgba(47, 49, 53, 1)",

        headerBg: "#2F3135",
        contentBg: "#2F3135",
        footerBg: "#2F3135",
        colorIconHover: "rgba(0, 0, 0, 0.88)",
        borderRadiusSM: 50,
      },
      Checkbox: {
        controlItemBgHover: "#ffffff",
        controlItemBgActiveHover: "#ffffff",
        colorPrimary: "#FFFFFF",
        colorBorder: "#959494",
        colorWhite: "#000000",
        colorPrimaryHover: "#FFFFFF",
        borderRadiusSM: 7,
      },
    },
    token: {
      fontFamily: "Inter, latin",
      colorBgBase: "#0B0B13",
      colorBgContainer: "#2F3135",
      colorTextBase: "#FFFFFF",

      // colorTextSecondary: "#E4E4E4",

      colorSuccess: "#277D54",
      colorError: "#A12A3F",
      colorWarning: "#FFC107",
      colorTextLightSolid: "#000000",
      colorText: "#F3E9E9",
      colorTextDescription: "#E4E4E4",
      colorFillContent: "#F3E9E9",
      colorFillAlter: "rgba(72, 72, 72, 1)",
      colorFillSecondary: "#FFFFFF",
      colorBgContainerDisabled: "#484848",
      colorBorder: "#rgba(159, 159, 159, 0.30)",
      colorTextLabel: "#9A9A9A",
      colorBgSpotlight: "#68FFB7",
      colorInfoActive: "#828697",
      colorInfoText: "#444650",
      colorTextDisabled: "#9E9E9E",
      colorPrimaryBg: "#FFFFFF",
      boxShadow: "#202225",
      blue1: "#3b7ff2",
      blue2: "rgba(105, 198, 250, 1)",
      blue3: "#C0C2C8",
      blue4: "rgba(59, 127, 242, 1)",
      purple1: "#6A83F4",
      purple2: "#4A5FBC",
      purple3: "rgba(193, 204, 251, 1)",
      purple4: "#6A83F4",
      purple5: "#6A83F4",
      purple6: "#BBBEFA",
      green1: "#68ffb7",
      green2: "#277D54",
      green3: "rgba(138, 199, 170, 1)",
      green4: "rgba(39, 125, 84, 1)",
      green5: "#8AC7AA",
      green6: "#C3E9DD",
      green7: "rgba(195, 233, 221,0.08)",
      green8: "#61656C",
      green10: "#8AD79E",

      yellow1: "rgba(250, 209, 148, 1)",
      yellow2: "rgba(255, 224, 177, 1)",
      yellow3: "rgba(91, 91, 91, 1)",
      yellow4: "#FFEBCD",
      yellow6: "#DFDFD5",
      red1: "#EB6B7A",
      red2: "#910000",
      colorIcon: "#FFFFFF",
      colorBorderBg: "#333333",
      colorWhite: "#FFFFFF",

      // colorBlack: "rgba(32, 34, 37, 1)",

      colorTextHeading: "#e7e7e7",
      colorTextSecondary: "#e7e7e7",
      colorTextTertiary: "#8f8f8f",
      colorTextQuaternary: "#959595",
      colorErrorBorder: "##b81414",
      blue10: "#AEB3CB",
      blue9: "#9D9D9D",
      orange1: "#FFA78B",
      red10: "#F1213A",
      colorInfoBg: "#F5F5F5",
      colorInfoTextHover: "#B7B7B7",
      colorInfoBorder: "#4E525A",

      blue8: "#C0C1C8",
      blue7: "#202225",
      blue6: "#898E97",

      blue5: "#62636A",
      cyan1: "rgba(166, 166, 166, 1)",
      cyan2: "#5d616c",
      cyan3: "#D9D9D9",
      cyan4: "rgba(204, 204, 204, 1)",
      cyan5: "rgba(104, 106, 108, 1)",
      cyan6: "rgba(69, 71, 77, 1)",
      cyan7: "rgba(126, 126, 126, 1)",
      cyan8: "#3B3D43",
      cyan9: "#A6A6A6",
      cyan10: "#E5E5E5",

      geekblue10: "rgba(217, 217, 217,0.3)",
      geekblue9: "#AEB7BE",
      orange10: "#F3BDA6",
      red3: "#FF7E86",
      geekblue8: "#212326",
      geekblue7: "#959494",
      geekblue6: "#CCCCCC",
      geekblue5: "rgba(44, 45, 48, 1)",
      geekblue4: "rgba(106, 131, 244, 1)",
      geekblue3: "rgba(78, 82, 90, 1)",
      geekblue2: "rgba(130, 134, 151, 1)",
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        sidebarCollapsed,
        handleSideBarCollapse,
      }}
    >
      <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
