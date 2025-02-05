import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useHandwaveContext } from "@/app/providers/HandwaveProvider";
import style from "@/styles/handwaves/handwave-item";
import { Handwave } from "@/utils/interfaces";
import { theme } from "antd";
import HandwaveRawItem from "./handwave-raw-item";
import { FiArrowRight } from "react-icons/fi";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import { ATTEND_REQUEST } from "@/lib/mutations/notifications";
import { useMutation } from "@apollo/client";

function OrderItem({ handwave }: { handwave: Handwave }) {
  console.log("status", handwave);
  // const { id, table, customer, type, created, status } = handwave;

  const [attendRequest] = useMutation(ATTEND_REQUEST);

  const [displayActionButton, setDisplayActionButton] = useState(false);

  const {
    token: {
      colorBgContainer,
      colorBgBase,
      red3,
      colorInfoBorder,
      blue7,
      cyan9,
      colorWhite,
    },
  } = theme.useToken();

  // const [isMobile, setIsMobile] = useState<any>(null);

  const { refetchHandWaveRequest } = useHandwaveContext();

  const [isAttending, setIsAttending] = useState(false);
  const [timeSince, setTimeSince] = useState(10);
  const [activeKey, setActiveKey] = useState(
    handwave.data[0].status == "new" ? ["1"] : [""]
  );

  const handleActionButton = () => {
    setDisplayActionButton(!displayActionButton);
  };

  function formatSeconds(seconds: number) {
    const minutes = Math.floor(seconds / 60); // Get the whole number of minutes
    const remainingSeconds = seconds % 60; // Get the remaining seconds
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0"); // Pad seconds to ensure two digits

    return `${minutes}:${formattedSeconds}m`;
  }

  const handleAttend = async (tableNumber: number, resturantID: number) => {
    setActiveKey([]);
    setIsAttending(true);
    let countdown = timeSince; // Assuming timeSince is your countdown value

    const interval = setInterval(async () => {
      setTimeSince((prev) => {
        if (prev <= 1) {
          console.log("Countdown complete", prev);
          clearInterval(interval);
          return 0;
        }
        console.log("Decrementing countdown", prev);
        return prev - 1;
      });

      if (countdown <= 1) {
        clearInterval(interval);
        try {
          const res = await attendRequest({
            variables: {
              tableNumber: tableNumber,
              resturantID: resturantID,
            },
          });
          if (res) {
            await refetchHandWaveRequest();
          }
          console.log("Request successful", res);
        } catch (error) {
          console.error("Error during request", error);
        }
      }
      countdown--;
    }, 1000);
  };

  useEffect(() => {
    if (isAttending) {
      setIsAttending(false);
      setTimeSince(10);
    }
  }, [handwave]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "short", // "Mon"
      year: "numeric", // "2023"
      month: "long", // "August"
      day: "numeric", // "18"
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const items: CollapseProps["items"] = [
    {
      key: "2",
      label: (
        <>
          {" "}
          <div
            style={{
              background: colorBgContainer,
              cursor:
                handwave.data[0].status == "new"
                  ? isAttending
                    ? "not-allowed"
                    : "pointer"
                  : "default",
              ...style.container,
            }}
            id="order-table"
          >
            {" "}
            {isAttending && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent black (50% opacity)
                  zIndex: 2, // Ensure it layers behind the content
                  pointerEvents: "none", // Allow clicks to pass through the tint layer
                }}
              ></div>
            )}
            <div style={style.itemHeader}>
              <div>
                <p style={style.itemHeaderTable}>
                  Table {handwave.data[0].table_number}{" "}
                </p>
                <p style={{ color: cyan9, ...style.itemHeaderDate }}>
                  {formatDate(handwave.data[0].created_at.toString())}
                </p>
              </div>
              {isAttending ? (
                <div
                  style={{
                    zIndex: 3,
                    background: "#FDC47E",
                    color: colorBgBase,

                    ...style.headerStatus,
                  }}
                >
                  {formatSeconds(timeSince)}
                </div>
              ) : (
                <div
                  style={{
                    color: colorBgBase,
                    background:
                      handwave.data[0].status == "new" ? red3 : "#7ADCAD",
                    ...style.headerStatus,
                  }}
                >
                  {handwave.data[0].status == "new" ? "New" : "Attended"}
                </div>
              )}
            </div>
            <div
              style={{
                ...style.rawItemContainer,
              }}
              onClick={handleActionButton}
            >
              {handwave.data?.map((item, index) => (
                <HandwaveRawItem key={index} rawData={item} />
              ))}
            </div>{" "}
          </div>
        </>
      ),
      children: (
        <>
          {handwave.data[0].status == "new" ? (
            <>
              {" "}
              <div
                style={{
                  ...style.bottomContainer,
                }}
              >
                <div
                  style={{
                    ...style.actionContainer,
                  }}
                >
                  <Button
                    style={{
                      ...style.actionButton,
                      background: isAttending ? blue7 : colorWhite,
                      color: isAttending ? colorInfoBorder : "#000000",
                    }}
                    onClick={() =>
                      handleAttend(
                        handwave.data[0].table_number,
                        handwave.data[0].restaurant_id
                      )
                    }
                    disabled={isAttending}
                  >
                    <p>{isAttending ? "Being Attended" : "Attend"}</p>
                    <p style={{ ...style.btnArrow }}>
                      <FiArrowRight />
                    </p>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      ),
      showArrow: false,
    },
  ];

  const onChange = (keys: string[] | string) => {
    setActiveKey(Array.isArray(keys) ? keys : [keys]);
  };
  return (
    <>
      {/* <div
        style={{
          background: colorBgContainer,
          ...style.container,
        }}
        id="order-table"
      >
        <div style={style.itemHeader}>
          <div>
            <p style={style.itemHeaderTable}>Table 02 </p>
            <p style={{ color: cyan9, ...style.itemHeaderDate }}>
              Mon, August 18, 2023
            </p>
          </div>
          <div
            style={{
              background: red3,
              color: colorBgBase,

              ...style.headerStatus,
            }}
          >
            New
          </div>
        </div>

        <div
          style={{
            ...style.rawItemContainer,
          }}
          onClick={handleActionButton}
        >
          <HandwaveRawItem /> <HandwaveRawItem /> <HandwaveRawItem />
        </div>
        {displayActionButton && (
          <div
            style={{
              ...style.actionContainer,
            }}
          >
            <button
              style={{
                ...style.actionButton,
                background: colorWhite,
              }}
            >
              <p>Attend</p>
              <p style={{ ...style.btnArrow }}>
                <FiArrowRight />
              </p>
            </button>
          </div>
        )}
      </div> */}{" "}
      <Collapse
        defaultActiveKey={handwave.data[0].status == "new" ? ["1"] : [""]}
        activeKey={activeKey}
        onChange={onChange}
        items={items}
        style={{ width: "100%" }}
        collapsible={isAttending ? "disabled" : undefined}
      />
      {/* </div> */}
    </>
  );
}

export default OrderItem;
