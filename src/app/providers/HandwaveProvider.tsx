"use client";

import React, { createContext, useContext, useState } from "react";

const HandwaveContext = createContext<any>(null);

export function HandwaveProvider({ children }: { children: React.ReactNode }) {
  const [handwaves, setHandwaveHook] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>("new");
  const [isNeedToRefetchHandWave, setIsNeedToRefetchHandWave] =
    useState<boolean>(false);

  const refetchHandWaveRequest = () => {
    setIsNeedToRefetchHandWave(true);
  };

  return (
    <HandwaveContext.Provider
      value={{
        handwaves,
        isNeedToRefetchHandWave,
        setHandwaveHook,
        refetchHandWaveRequest,
        activeTab,
        setActiveTab,
        setIsNeedToRefetchHandWave,
      }}
    >
      {children}
    </HandwaveContext.Provider>
  );
}

export function useHandwaveContext() {
  return useContext(HandwaveContext);
}
