"use client";

import React, { useEffect, useState } from "react";
import { createContext, useContext, useRef } from "react";

const WebSocketContext = createContext<any>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  let restaurantIdRef = useRef<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null); // Add state to track WebSocket connection
  const [message, setMessage] = useState<{ type: string; data: any } | null>(
    null
  );

  useEffect(() => {
    console.log("--- useEffect to update websocket!!!");
    console.log("--- wsRef Current ", wsRef.current);
    console.log("--- rest id ref ", restaurantIdRef);
    if (!wsRef.current) {
      try {
        const connectWebSocket = async () => {
          try {
            const getWSConnection = async (): Promise<WebSocket> => {
              return new Promise((resolve, reject) => {
                if (typeof window !== undefined) {
                  const handleMessage = (event: any) => {
                    console.log("GOT MESSAGE----------", event);

                    try {
                      // Parse the outermost WebSocket event data
                      const wsData = JSON.parse(event.data);

                      console.log("WS Data--------------:", wsData);

                      // The message is a JSON string, so we need to parse it again
                      const parsedWsMessage = JSON.parse(wsData.message);

                      console.log(
                        "Parsed WS Message--------:",
                        parsedWsMessage
                      );

                      const parsedType = parsedWsMessage.type; // Get the 'type' field from the parsed message

                      console.log("Type:", parsedType);

                      // Set the full message object and type in state
                      if (parsedType && parsedWsMessage) {
                        setMessage({
                          type: parsedType,
                          data: parsedWsMessage,
                        } as {
                          type: string;
                          data: any;
                        });
                      }
                      console.dir(event);
                    } catch (error) {
                      console.error("Error handling WebSocket message:", error);
                    }
                  };

                  console.log("WIndow redefined!!!");

                  restaurantIdRef.current = localStorage.getItem(
                    "lono_restaurant_id"
                  )
                    ? parseInt(localStorage.getItem("lono_restaurant_id")!)
                    : null;

                  console.log("Restaurant ID 2: ", restaurantIdRef.current);

                  const socketConnection = new WebSocket(
                    process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT +
                      `/?requestType=orderCreation&id=${restaurantIdRef.current}`
                  );
                  socketConnection.onopen = (_data) => {
                    console.log("Websocket connected");
                    resolve(socketConnection);
                  };

                  socketConnection.onerror = (_error) => {
                    console.log("Websocket connection failed");
                    reject("Websocket connection cannot be established!");
                  };

                  socketConnection.onmessage = handleMessage;
                }
              });
            };
            let ws: WebSocket = await getWSConnection();
            wsRef.current = ws;
            setWebSocket(ws);
            ws.onclose = () => {
              console.log("WebSocket closed");
              console.log("Reconnecting ...");
              connectWebSocket();
            };
          } catch (error) {
            console.log(error);
          }
        };
        connectWebSocket();
      } catch (error) {
        console.log("Error occurred establishing WS connection!");
      }
    }
  }, [restaurantIdRef]);

  // useEffect(() => {
  //   console.log("current WSref ", wsRef.current);
  //   // Hanldes any incoming message from web socket server

  //   if (wsRef.current) {
  //     console.log("changed WS: ", wsRef.current);
  //     wsRef.current.onmessage = handleMessage;
  //   }
  // }, [webSocket]);

  // // updates restaurant id variable
  // useEffect(() => {
  //   if (typeof window !== undefined) {
  //     console.log("WIndow redefined!!!");
  //     restaurantIdRef.current = localStorage.getItem("lono_restaurant_id")? parseInt(localStorage.getItem("lono_restaurant_id")!)
  //       : null;

  //     console.log("Restaurant ID: ", restaurantIdRef.current);
  //   }
  // }, []);

  return (
    <WebSocketContext.Provider
      value={{
        wsRef,
        webSocket,
        message,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  try {
    const context = useContext(WebSocketContext);
    return context;
  } catch (error) {
    console.log("Error using web socket context!");
    console.log(error);
  }
}
