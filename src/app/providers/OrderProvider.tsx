"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_LIMITED_ORDERS } from "@/lib/queries/orders";

const OrderContext = createContext<any>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [isOrderUpdated, setIsOrderUpdated] = useState(false);
  const [activeTab, setActiveTab] = useState("new");
  const [isSelectNameCard, setIsSelectNameCard] = useState(false);
  const [orderIndividual, setOrderIndividual] = useState(0);
  const [clickedOrder, setClickedOrder] = useState(() => ({}));
  const [selectedTab, setSelectedTab] = useState(0);
  const [previousSelectedTable, setPreviousSelectedTable] = useState(0);
  const [currentTable, setCurrentTable] = useState(0);
  //orders by table detail view modal tab controls  orders > tables

  const [allTabInView, setAllTabInView] = useState(true);
  const [closeModalTrigger, setCloseModalTrigger] = useState(false);

  //order by table detail view modal
  const [IsUpdateOrderModalVisible, setIsUpdateOrderModalVisible] =
    useState(false);

  const [isInEditOrder, setIsInEditOrder] = useState(false);
  const [currentlyEditingOrder, setCurrentlyEditingOrder] = useState(0);
  const [statusUpdatedOrder, setStatusUpdatedOrder] = useState(-1);
  const [isOrderStatUpdating, setIsOrderStatUpdating] = useState(false);

  let restaurant_id: number | null = null;
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("lono_restaurant_id");
    if (storedId) {
      restaurant_id = parseInt(storedId, 10);
    }
  }

  const pageSize = 1000;
  const [page, setPage] = useState(1);
  const [ordersMore, setOrdersMore] = useState(false);

  // Get all (paginated) orders of the restaurant
  const [orderData, setOrderData] = useState<any>([]);
  const {
    data: orderDataReturn,
    loading: orderLoading,
    error: orderError,
    refetch: refetchOrder,
  } = useQuery<any>(GET_LIMITED_ORDERS, {
    variables: {
      restaurant_id: restaurant_id,
      page: page,
      size: pageSize,
    },
    onError: (err) => {
      console.log("Failed to load order data!");
      console.log(err);
      if (err.graphQLErrors) {
        console.log(err.graphQLErrors);
      }
    },
  });

  useEffect(() => {
    if (orderDataReturn) {
      console.log("ORDER DATA RECEIVED!", orderDataReturn.getLimitedOrders);
      const tempOrders = [
        ...orderData,
        ...orderDataReturn.getLimitedOrders.orders,
      ];
      const uniqueOrders = tempOrders.reduce((acc: any[], order: any) => {
        if (!acc.some((o) => o.id === order.id)) {
          acc.push(order);
        }
        return acc;
      }, []);
      const sortedCustomers = uniqueOrders
        .map((order: any) => order.customer)
        .sort((a: any, b: any) => a.id - b.id);
      const updatedOrders = uniqueOrders.map((order: any) => {
        const customerIndex =
          sortedCustomers.findIndex(
            (customer: any) => customer.id === order.customer.id
          ) + 1;
        return {
          ...order,
          customer: {
            ...order.customer,
            index: customerIndex,
          },
        };
      });
      setOrderData(
        updatedOrders.sort((a: any, b: any) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime(); // Sort in ascending order (oldest first)
        })
      );
      setOrdersMore(orderDataReturn.getLimitedOrders.hasMore);
    }
  }, [orderDataReturn]);

  const [refetchingOrders, setRefetchingOrders] = useState(false);
  const fetchOrders = async (pageTarget: number) => {
    if (refetchingOrders) return;
    setRefetchingOrders(true);
    await refetchOrder({
      restaurant_id: restaurant_id,
      page: pageTarget,
      size: pageSize,
    });
    setPage(pageTarget);
    setRefetchingOrders(false);
  };

  const handleSelectNameCard = () => {
    setIsSelectNameCard(!isSelectNameCard);
  };

  const handlePreviousSelectedTable = (tableId: any) => {
    setPreviousSelectedTable(tableId);
  };
  const closeUpdateOrderModal = () => {
    setIsUpdateOrderModalVisible(!IsUpdateOrderModalVisible);
    setClickedOrder(currentTable);

    if (closeModalTrigger == true) {
      setSelectedTab(1);
    } else {
      setSelectedTab(0);
    }
  };
  const handleUpdateOrderClick = (tableId?: any) => {
    setCurrentTable(tableId);
    setIsUpdateOrderModalVisible(!IsUpdateOrderModalVisible);
    setClickedOrder(tableId);

    if (closeModalTrigger == true) {
      setSelectedTab(1);
    } else {
      setSelectedTab(0);
    }
  };

  const handleIsOrderUpdated = () => {
    setIsOrderStatUpdating(!isOrderStatUpdating);
    setIsOrderUpdated(!isOrderUpdated);
  };

  const handleIsInOrderEdit = () => {
    setIsInEditOrder(!isInEditOrder);
  };
  const handleCurrentlyOrderEdit = (id: number) => {
    setCurrentlyEditingOrder(id);
  };

  const addOrder = (newOrder: any) => {
    newOrder.items.map((item: any) => {
      item.price = parseInt(item.price);
      return item;
    });
    console.log("ADDING NEW ORDER: ", newOrder);
    const tempOrderData = [...orderData, newOrder];
    console.log("TEMP ORDER DATA: ", tempOrderData);
    const sortedCustomers = tempOrderData
      .map((order: any) => order.customer)
      .sort((a: any, b: any) => a.id - b.id);
    const updatedOrders = tempOrderData.map((order: any) => {
      const customerIndex =
        sortedCustomers.findIndex(
          (customer: any) => customer.id === order.customer.id
        ) + 1;
      return {
        ...order,
        customer: {
          ...order.customer,
          index: customerIndex,
        },
      };
    });
    const newOrderData = updatedOrders.sort((a: any, b: any) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime(); // Sort in ascending order (oldest first)
    });
    console.log("NEW ORDER DATA: ", newOrderData);
    setOrderData(newOrderData);
  };

  return (
    <OrderContext.Provider
      value={{
        isOrderUpdated,
        handleIsOrderUpdated,
        activeTab,
        setActiveTab,
        orderIndividual,
        setOrderIndividual,
        allTabInView,
        setAllTabInView,
        clickedOrder,
        IsUpdateOrderModalVisible,
        handleUpdateOrderClick,
        selectedTab,
        setSelectedTab,
        closeModalTrigger,
        setCloseModalTrigger,
        isInEditOrder,
        handleIsInOrderEdit,
        setIsInEditOrder,
        currentlyEditingOrder,
        handleCurrentlyOrderEdit,
        isSelectNameCard,
        handleSelectNameCard,
        previousSelectedTable,
        handlePreviousSelectedTable,
        closeUpdateOrderModal,
        statusUpdatedOrder,
        setStatusUpdatedOrder,
        isOrderStatUpdating,
        setIsOrderStatUpdating,
        orderData,
        orderLoading,
        orderError,
        fetchOrders,
        ordersMore,
        page,
        addOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  return useContext(OrderContext);
}
