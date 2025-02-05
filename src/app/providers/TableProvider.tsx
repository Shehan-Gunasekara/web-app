"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const TableContext = createContext<any>(null);

export function TableProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("available");
  const [tableUpdated, setTableUpdated] = useState(false);
  const [isTableEditClicked, setIsTableEditClicked] = useState(false);
  const [isEditBlurred, setIsEditBlurred] = useState(false);
  const [selectedTableList, setSelectedTableList] = useState<any>([]);
  const [isSettingClicked, setIsSettingClicked] = useState(false);
  const [isRegenerateQrModalVisible, setIsRegenerateQrModalVisible] =
    useState(false);

  const handleSettingsClick = () => {
    setIsSettingClicked(!isSettingClicked);
  };

  const handleSettingsClose = () => {
    setIsSettingClicked(false);
  };

  const updateTableAdded = () => {
    setTableUpdated(!tableUpdated);
  };

  const handleEditTableClick = () => {
    setSelectedTableList([]);
    setIsTableEditClicked(!isTableEditClicked);
    setIsSettingClicked(false);
    setIsEditBlurred(!isEditBlurred);
  };

  const addItemToSelectedList = (itemToAdd: any) => {
    setSelectedTableList((prevList: any) => [...prevList, itemToAdd]);
  };

  const removeItemFromSelectedList = (tableIdToRemove: string) => {
    setSelectedTableList((prevList: any[]) =>
      prevList.filter((item) => item !== tableIdToRemove)
    );
  };

  const handleRegenerateQrModal = () => {
    setIsRegenerateQrModalVisible(!isRegenerateQrModalVisible);
    setIsSettingClicked(false);
  };

  const CloseRegenerateQrModal = () => {
    setIsRegenerateQrModalVisible(false);
  };

  const closeEditView = () => {
    if (isEditBlurred && isTableEditClicked) {
      setIsEditBlurred(false);
      setIsTableEditClicked(false);
    }
  };
  useEffect(() => {
    setSelectedTableList([]);
  }, [activeTab]);

  return (
    <TableContext.Provider
      value={{
        tableUpdated,
        setTableUpdated,
        updateTableAdded,
        isTableEditClicked,
        handleEditTableClick,
        isEditBlurred,
        setIsEditBlurred,
        selectedTableList,
        addItemToSelectedList,
        removeItemFromSelectedList,
        isSettingClicked,
        handleSettingsClick,
        handleSettingsClose,
        isRegenerateQrModalVisible,
        handleRegenerateQrModal,
        CloseRegenerateQrModal,
        closeEditView,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTableContext() {
  return useContext(TableContext);
}
