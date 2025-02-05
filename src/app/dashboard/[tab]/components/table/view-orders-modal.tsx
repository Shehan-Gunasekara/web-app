import React from "react";
import { Button, theme } from "antd";
import style from "@/styles/table/view-orders-modal";
import ViewOrderMiddle from "./order-item-table-middle";
import { GET_ORDERS_DESCRIPTION_OF_TABLE } from "@/lib/queries/orders";
import { useQuery } from "@apollo/client";
import SkeletonTableViewModal from "@/app/components/skeletons/table/table-view-modal";

interface ViewOrdersModalProps {
  clickedTable: any;
  closeModal: () => void;
  isModalOpen: boolean;
}

// function ViewOrdersModal({ tableDetails, closeModal }: UpdateTableProps) {
function ViewOrdersModal({ clickedTable, closeModal }: ViewOrdersModalProps) {
  const {
    token: {
      colorBorder,
      colorTextBase,
      colorBgBase,
      colorInfoText,
      colorTextQuaternary,
    },
  } = theme.useToken();

  //Get all order of the table query
  const { data, loading } = useQuery<any>(GET_ORDERS_DESCRIPTION_OF_TABLE, {
    variables: {
      table_id: clickedTable.id,
      resturant_id:
        localStorage.getItem("lono_restaurant_id") &&
        parseInt(localStorage.getItem("lono_restaurant_id")!),
    },
    onError: (error: any) => {
      console.log("error", error);
    },
    fetchPolicy: "network-only",
  });

  // useEffect(() => {
  //   if (isModalOpen) {
  //     console.log("Modal opened, setting shouldFetch to true");
  //     setShouldFetch(true);
  //   }
  // }, [isModalOpen]);

  // useEffect(() => {
  //   // if (shouldFetch) {
  //   console.log("Refetching data...");
  //   refetch().then(() => {
  //     console.log("Refetch complete");
  //     // setShouldFetch(false);
  //   });
  //   // }
  // }, [isModalOpen]);

  const getTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format

    const timeString = `${formattedHours}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${ampm}`;

    return timeString;
  };

  return (
    <>
      {loading ? (
        <SkeletonTableViewModal />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "35rem",
              minWidth: "412px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "3.5rem",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  color: colorTextBase,
                  backgroundColor: colorInfoText,
                  width: "92px",
                  height: "90px",
                  display: "flex",
                  flexDirection: "column" as "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "15px",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    margin: 0,
                    padding: 0,
                  }}
                >
                  Table
                </p>
                <p
                  style={{
                    fontSize: "32px",
                    fontWeight: 600,
                    margin: 0,
                    padding: 0,
                    lineHeight: 1.1,
                  }}
                >
                  {clickedTable.table_number < 10
                    ? `0${clickedTable.table_number}`
                    : clickedTable.table_number}
                </p>
              </div>

              <div style={{ display: "flex", gap: "2rem", flex: 1 }}>
                {/* col 1 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    flex: 1,
                  }}
                >
                  <div style={style.addTableStatus}>
                    <span
                      style={{
                        color: colorTextQuaternary,
                        ...style.updateLabelF,
                      }}
                    >
                      started
                    </span>
                    <span style={{ color: colorBorder, ...style.updateLabel }}>
                      {/* 09:02 PM */}
                      {getTime(clickedTable.session_start_time)}
                    </span>
                  </div>

                  <div style={style.addTableStatus}>
                    <span
                      style={{
                        color: colorTextQuaternary,
                        ...style.updateLabelF,
                      }}
                    >
                      diners
                    </span>
                    <span style={{ color: colorBorder, ...style.updateLabel }}>
                      {data.getOrderDetailsOfTable.diners}
                    </span>
                  </div>
                </div>
                {/* col 2 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    flex: 1,
                  }}
                >
                  <div style={style.addTableStatus}>
                    <span
                      style={{
                        color: colorTextQuaternary,
                        ...style.updateLabelF,
                      }}
                    >
                      active orders
                    </span>
                    <span style={{ color: colorBorder, ...style.updateLabel }}>
                      {data.getOrderDetailsOfTable.active_orders}
                    </span>
                  </div>

                  <div style={style.addTableStatus}>
                    <span
                      style={{
                        color: colorTextQuaternary,
                        ...style.updateLabelF,
                      }}
                    >
                      total orders
                    </span>
                    <span style={{ color: colorBorder, ...style.updateLabel }}>
                      {data.getOrderDetailsOfTable.total_orders}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ORDERS ROW */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                marginTop: "1.5rem",
                flex: 1,
                overflowY: "auto",
                marginRight: "-1rem",
                paddingRight: "1rem",
              }}
            >
              {data.getOrderDetailsOfTable.orders &&
              data.getOrderDetailsOfTable.orders.length > 0 ? (
                data.getOrderDetailsOfTable.orders.map(
                  (order: any, index: number) => (
                    <div key={index}>
                      <ViewOrderMiddle
                        orderDetails={order}
                        timeFunction={getTime}
                      />
                    </div>
                  )
                )
              ) : (
                <div
                  style={{
                    color: colorTextBase,
                    ...style.noOrdersText,
                  }}
                >
                  No orders available
                </div>
              )}
            </div>

            {/* BUTTON ROW */}
            <Button
              style={{
                marginTop: "1.5rem",
                marginBottom: "1rem",
                width: "100%",
                height: "2.5rem",
                backgroundColor: colorTextBase,
                color: colorBgBase,
                fontSize: 16,
                fontWeight: 700,
                alignSelf: "flex-end",
              }}
              onClick={closeModal}
              name="closeModal"
            >
              Back
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export default ViewOrdersModal;
