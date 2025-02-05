"use client";

import React, { createContext, useContext, useState } from "react";

const SettingsContext = createContext<any>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [currentGMTValue, setCurrentGMTValue] = useState<string>("");
  const [settingActiveTab, setSettingActiveTab] = useState<string>("1");

  const changeSettingActiveTab = (value: string) => {
    setSettingActiveTab(value);
  };
  const setGMT = (value: string) => {
    setCurrentGMTValue(value);
  };

  return (
    <SettingsContext.Provider
      value={{
        currentGMTValue,
        setGMT,
        settingActiveTab,
        changeSettingActiveTab,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}
