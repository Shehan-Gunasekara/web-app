"use client";
import React from "react";
import { Col, Row } from "antd";
import HandwaveItem from "./handwave-item";
import HandwaveHeader from "./handwave-header";
import style from "../../../../../styles/handwaves/handwave-components";
import { Handwave } from "@/utils/interfaces";
import { useHandwaveContext } from "@/app/providers/HandwaveProvider";
import NoHandwaves from "./no-handwaves";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import styles from "@/styles/handwaves/handwave-content";
import SkeletonHandwave from "@/app/components/skeletons/handwave/handwave";

function HandwavesContent() {
  const { activeTab, setActiveTab, handwaves } = useHandwaveContext();

  // const {
  //   data,

  //   refetch: refetchHandWaveRequest,
  //   loading: handwaveLoading,
  // } = useQuery<any>(GET_HANDWAVES_BY_RESTAURANT_ID, {
  //   variables: { id: restaurant_id },
  //   onCompleted: (handwaveData) => {
  //     setHandwaveHook(handwaveData.getAllNotificationsByRestaurantId);
  //   },
  //   onError: (error: any) => {
  //     console.error("[GraphQL error]:", error);
  //     if (error.graphQLErrors) {
  //       error.graphQLErrors.forEach(
  //         ({
  //           message,
  //           locations,
  //           path,
  //         }: {
  //           message: any;
  //           locations: any;
  //           path: any;
  //         }) => {
  //           console.error(
  //             `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
  //           );
  //         }
  //       );
  //     }
  //     if (error.networkError) {
  //       console.error(`[Network error]: ${error.networkError}`);
  //     }
  //   },
  // });

  // useEffect(() => {
  //   if (data) {
  //     setHandwaveHook(data.getAllNotificationsByRestaurantId);
  //   }
  // }, [data]);

  const { sidebarCollapsed } = useThemeContext();

  const deviceWidth = useWindowWidth();

  const handleActiveTab = (tab: any) => {
    if (activeTab === tab) return;
    setActiveTab(tab);
  };

  return (
    <>
      {Object.keys(handwaves).length !== 0 ? (
        <div
          style={{
            ...styles.container,
          }}
        >
          <HandwaveHeader
            handwaves={handwaves}
            handleTabChange={handleActiveTab}
            isLoading={Object.keys(handwaves).length !== 0}
          />
          <div
            style={{ height: "90vh", overflowY: "scroll", overflowX: "hidden" }}
          >
            {activeTab == "new" ? (
              <>
                {handwaves.newRequest && (
                  <>
                    <div style={style.handwaveItemCard}>
                      {handwaves.newRequest.length > 0 ? (
                        <Row gutter={[16, 16]}>
                          {(window.innerWidth < 1200 &&
                            !sidebarCollapsed &&
                            window.innerWidth > 825) ||
                          (window.innerWidth < 1050 && sidebarCollapsed) ? (
                            <>
                              {" "}
                              <Col
                                key={1}
                                xs={12}
                                sm={12}
                                md={
                                  !sidebarCollapsed && deviceWidth < 825
                                    ? 24
                                    : 12
                                }
                                lg={
                                  !sidebarCollapsed
                                    ? 12
                                    : deviceWidth < 1050
                                    ? 12
                                    : 8
                                }
                                xl={8}
                              >
                                {handwaves.newRequest
                                  .filter(
                                    (_: Handwave, index: number) =>
                                      index % 2 === 0
                                  ) // Skip 2 elements
                                  .map((handwave: Handwave, index: number) => (
                                    <Row
                                      style={{ marginBottom: "20px" }}
                                      key={`Rn1-${index}`}
                                    >
                                      <HandwaveItem
                                        handwave={handwave}
                                        key={`n1-${index}`}
                                      />
                                    </Row>
                                  ))}
                              </Col>{" "}
                              <Col
                                key={1}
                                xs={12}
                                sm={12}
                                md={
                                  !sidebarCollapsed && deviceWidth < 825
                                    ? 24
                                    : 12
                                }
                                lg={
                                  !sidebarCollapsed
                                    ? 12
                                    : deviceWidth < 1050
                                    ? 12
                                    : 8
                                }
                                xl={8}
                              >
                                {handwaves.newRequest
                                  .filter(
                                    (_: Handwave, index: number) =>
                                      (index - 1) % 2 === 0
                                  ) // Skip 2 elements, starting from index 1
                                  .map((handwave: Handwave, index: number) => (
                                    <Row
                                      style={{ marginBottom: "20px" }}
                                      key={`Rn2-${index}`}
                                    >
                                      <HandwaveItem
                                        handwave={handwave}
                                        key={`n2-${index}`}
                                      />
                                    </Row>
                                  ))}
                              </Col>{" "}
                            </>
                          ) : (
                            <>
                              {" "}
                              <Col
                                key={1}
                                xs={12}
                                sm={12}
                                md={
                                  !sidebarCollapsed && deviceWidth < 825
                                    ? 24
                                    : 12
                                }
                                lg={
                                  !sidebarCollapsed
                                    ? 12
                                    : deviceWidth < 1050
                                    ? 12
                                    : 8
                                }
                                xl={8}
                              >
                                {handwaves.newRequest
                                  .filter(
                                    (_: Handwave, index: number) =>
                                      index % 3 === 0
                                  ) // Skip 2 elements
                                  .map((handwave: Handwave, index: number) => (
                                    <Row
                                      style={{ marginBottom: "20px" }}
                                      key={`Rn3-${index}`}
                                    >
                                      <HandwaveItem
                                        handwave={handwave}
                                        key={`n1-${index}`}
                                      />
                                    </Row>
                                  ))}
                              </Col>{" "}
                              <Col
                                key={1}
                                xs={12}
                                sm={12}
                                md={
                                  !sidebarCollapsed && deviceWidth < 825
                                    ? 24
                                    : 12
                                }
                                lg={
                                  !sidebarCollapsed
                                    ? 12
                                    : deviceWidth < 1050
                                    ? 12
                                    : 8
                                }
                                xl={8}
                              >
                                {handwaves.newRequest
                                  .filter(
                                    (_: Handwave, index: number) =>
                                      (index - 1) % 3 === 0
                                  ) // Skip 2 elements, starting from index 1
                                  .map((handwave: Handwave, index: number) => (
                                    <Row
                                      style={{ marginBottom: "20px" }}
                                      key={`Rm17-${index}`}
                                    >
                                      <HandwaveItem
                                        handwave={handwave}
                                        key={`n2-${index}`}
                                      />
                                    </Row>
                                  ))}
                              </Col>{" "}
                              <Col
                                key={1}
                                xs={12}
                                sm={12}
                                md={
                                  !sidebarCollapsed && deviceWidth < 825
                                    ? 24
                                    : 12
                                }
                                lg={
                                  !sidebarCollapsed
                                    ? 12
                                    : deviceWidth < 1050
                                    ? 12
                                    : 8
                                }
                                xl={8}
                              >
                                {" "}
                                {handwaves.newRequest
                                  .filter(
                                    (_: Handwave, index: number) =>
                                      (index - 2) % 3 === 0
                                  ) // Skip 2 elements, starting from index 1
                                  .map((handwave: Handwave, index: number) => (
                                    <Row
                                      style={{ marginBottom: "20px" }}
                                      key={`Rn4-${index}`}
                                    >
                                      <HandwaveItem
                                        handwave={handwave}
                                        key={`n3-${index}`}
                                      />
                                    </Row>
                                  ))}
                              </Col>{" "}
                            </>
                          )}
                        </Row>
                      ) : (
                        <NoHandwaves text="new" />
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {activeTab == "attended" ? (
                  <>
                    {handwaves.attendedRequest ? (
                      <>
                        <div style={style.handwaveItemCard}>
                          {handwaves.attendedRequest.length > 0 && (
                            <Row gutter={[16, 16]}>
                              {(window.innerWidth < 1200 &&
                                !sidebarCollapsed &&
                                window.innerWidth > 825) ||
                              (window.innerWidth < 1050 && sidebarCollapsed) ? (
                                <>
                                  {" "}
                                  <Col
                                    key={1}
                                    xs={12}
                                    sm={12}
                                    md={
                                      !sidebarCollapsed && deviceWidth < 825
                                        ? 24
                                        : 12
                                    }
                                    lg={
                                      !sidebarCollapsed
                                        ? 12
                                        : deviceWidth < 1050
                                        ? 12
                                        : 8
                                    }
                                    xl={8}
                                  >
                                    {handwaves.attendedRequest
                                      .filter(
                                        (_: Handwave, index: number) =>
                                          index % 2 === 0
                                      ) // Skip 2 elements
                                      .map(
                                        (handwave: Handwave, index: number) => (
                                          <Row
                                            style={{ marginBottom: "20px" }}
                                            key={`Rn5-${index}`}
                                          >
                                            <HandwaveItem
                                              handwave={handwave}
                                              key={`a1-${index}`}
                                            />
                                          </Row>
                                        )
                                      )}
                                  </Col>{" "}
                                  <Col
                                    key={1}
                                    xs={12}
                                    sm={12}
                                    md={
                                      !sidebarCollapsed && deviceWidth < 825
                                        ? 24
                                        : 12
                                    }
                                    lg={
                                      !sidebarCollapsed
                                        ? 12
                                        : deviceWidth < 1050
                                        ? 12
                                        : 8
                                    }
                                    xl={8}
                                  >
                                    {handwaves.attendedRequest
                                      .filter(
                                        (_: Handwave, index: number) =>
                                          (index - 1) % 2 === 0
                                      ) // Skip 2 elements, starting from index 1
                                      .map(
                                        (handwave: Handwave, index: number) => (
                                          <Row
                                            style={{ marginBottom: "20px" }}
                                            key={`Ra1-${index}`}
                                          >
                                            <HandwaveItem
                                              handwave={handwave}
                                              key={`a2-${index}`}
                                            />
                                          </Row>
                                        )
                                      )}
                                  </Col>{" "}
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <Col
                                    key={1}
                                    xs={12}
                                    sm={12}
                                    md={
                                      !sidebarCollapsed && deviceWidth < 825
                                        ? 24
                                        : 12
                                    }
                                    lg={
                                      !sidebarCollapsed
                                        ? 12
                                        : deviceWidth < 1050
                                        ? 12
                                        : 8
                                    }
                                    xl={8}
                                  >
                                    {handwaves.attendedRequest
                                      .filter(
                                        (_: Handwave, index: number) =>
                                          index % 3 === 0
                                      ) // Skip 2 elements
                                      .map(
                                        (handwave: Handwave, index: number) => (
                                          <Row
                                            style={{ marginBottom: "20px" }}
                                            key={`Ra2-${index}`}
                                          >
                                            <HandwaveItem
                                              handwave={handwave}
                                              key={`a1-${index}`}
                                            />
                                          </Row>
                                        )
                                      )}
                                  </Col>{" "}
                                  <Col
                                    key={1}
                                    xs={12}
                                    sm={12}
                                    md={
                                      !sidebarCollapsed && deviceWidth < 825
                                        ? 24
                                        : 12
                                    }
                                    lg={
                                      !sidebarCollapsed
                                        ? 12
                                        : deviceWidth < 1050
                                        ? 12
                                        : 8
                                    }
                                    xl={8}
                                  >
                                    {handwaves.attendedRequest
                                      .filter(
                                        (_: Handwave, index: number) =>
                                          (index - 1) % 3 === 0
                                      ) // Skip 2 elements, starting from index 1
                                      .map(
                                        (handwave: Handwave, index: number) => (
                                          <Row
                                            style={{ marginBottom: "20px" }}
                                            key={`Ra3-${index}`}
                                          >
                                            <HandwaveItem
                                              handwave={handwave}
                                              key={`a2-${index}`}
                                            />
                                          </Row>
                                        )
                                      )}
                                  </Col>{" "}
                                  <Col
                                    key={1}
                                    xs={12}
                                    sm={12}
                                    md={
                                      !sidebarCollapsed && deviceWidth < 825
                                        ? 24
                                        : 12
                                    }
                                    lg={
                                      !sidebarCollapsed
                                        ? 12
                                        : deviceWidth < 1050
                                        ? 12
                                        : 8
                                    }
                                    xl={8}
                                  >
                                    {" "}
                                    {handwaves.attendedRequest
                                      .filter(
                                        (_: Handwave, index: number) =>
                                          (index - 2) % 3 === 0
                                      ) // Skip 2 elements, starting from index 1
                                      .map(
                                        (handwave: Handwave, index: number) => (
                                          <Row
                                            style={{ marginBottom: "20px" }}
                                            key={`Ra6-${index}`}
                                          >
                                            <HandwaveItem
                                              handwave={handwave}
                                              key={`a3-${index}`}
                                            />
                                          </Row>
                                        )
                                      )}
                                  </Col>{" "}
                                </>
                              )}
                            </Row>
                          )}
                        </div>
                      </>
                    ) : (
                      <NoHandwaves text="attended" />
                    )}
                  </>
                ) : (
                  <>
                    {handwaves.allRequest ? (
                      <>
                        <div style={style.handwaveItemCard}>
                          {handwaves.allRequest.length > 0 && (
                            <Row gutter={[16, 16]}>
                              {(window.innerWidth < 1200 &&
                                !sidebarCollapsed &&
                                window.innerWidth > 825) ||
                              (window.innerWidth < 1050 && sidebarCollapsed) ? (
                                <>
                                  {" "}
                                  <Col
                                    key={1}
                                    xs={12}
                                    sm={12}
                                    md={
                                      !sidebarCollapsed && deviceWidth < 825
                                        ? 24
                                        : 12
                                    }
                                    lg={
                                      !sidebarCollapsed
                                        ? 12
                                        : deviceWidth < 1050
                                        ? 12
                                        : 8
                                    }
                                    xl={8}
                                  >
                                    {handwaves.allRequest
                                      .filter(
                                        (_: Handwave, index: number) =>
                                          index % 2 === 0
                                      ) // Skip 2 elements
                                      .map(
                                        (handwave: Handwave, index: number) => (
                                          <Row
                                            style={{ marginBottom: "20px" }}
                                            key={`Ra7-${index}`}
                                          >
                                            <HandwaveItem
                                              handwave={handwave}
                                              key={`al1-${index}`}
                                            />
                                          </Row>
                                        )
                                      )}
                                  </Col>{" "}
                                  <Col
                                    key={1}
                                    xs={12}
                                    sm={12}
                                    md={
                                      !sidebarCollapsed && deviceWidth < 825
                                        ? 24
                                        : 12
                                    }
                                    lg={
                                      !sidebarCollapsed
                                        ? 12
                                        : deviceWidth < 1050
                                        ? 12
                                        : 8
                                    }
                                    xl={8}
                                  >
                                    {handwaves.allRequest
                                      .filter(
                                        (_: Handwave, index: number) =>
                                          (index - 1) % 2 === 0
                                      ) // Skip 2 elements, starting from index 1
                                      .map(
                                        (handwave: Handwave, index: number) => (
                                          <Row
                                            style={{ marginBottom: "20px" }}
                                            key={`Ra8-${index}`}
                                          >
                                            <HandwaveItem
                                              handwave={handwave}
                                              key={`al2-${index}`}
                                            />
                                          </Row>
                                        )
                                      )}
                                  </Col>{" "}
                                </>
                              ) : (
                                <>
                                  {" "}
                                  <Col
                                    key={1}
                                    xs={12}
                                    sm={12}
                                    md={
                                      !sidebarCollapsed && deviceWidth < 825
                                        ? 24
                                        : 12
                                    }
                                    lg={
                                      !sidebarCollapsed
                                        ? 12
                                        : deviceWidth < 1050
                                        ? 12
                                        : 8
                                    }
                                    xl={8}
                                  >
                                    {handwaves.allRequest
                                      .filter(
                                        (_: Handwave, index: number) =>
                                          index % 3 === 0
                                      ) // Skip 2 elements
                                      .map(
                                        (handwave: Handwave, index: number) => (
                                          <Row
                                            style={{ marginBottom: "20px" }}
                                            key={`Ra17-${index}`}
                                          >
                                            <HandwaveItem
                                              handwave={handwave}
                                              key={`al1-${index}`}
                                            />
                                          </Row>
                                        )
                                      )}
                                  </Col>{" "}
                                  <Col
                                    key={1}
                                    xs={12}
                                    sm={12}
                                    md={
                                      !sidebarCollapsed && deviceWidth < 825
                                        ? 24
                                        : 12
                                    }
                                    lg={
                                      !sidebarCollapsed
                                        ? 12
                                        : deviceWidth < 1050
                                        ? 12
                                        : 8
                                    }
                                    xl={8}
                                  >
                                    {handwaves.allRequest
                                      .filter(
                                        (_: Handwave, index: number) =>
                                          (index - 1) % 3 === 0
                                      ) // Skip 2 elements, starting from index 1
                                      .map(
                                        (handwave: Handwave, index: number) => (
                                          <Row
                                            style={{ marginBottom: "20px" }}
                                            key={`Ra13-${index}`}
                                          >
                                            <HandwaveItem
                                              handwave={handwave}
                                              key={`al2-${index}`}
                                            />
                                          </Row>
                                        )
                                      )}
                                  </Col>{" "}
                                  <Col
                                    key={1}
                                    xs={12}
                                    sm={12}
                                    md={
                                      !sidebarCollapsed && deviceWidth < 825
                                        ? 24
                                        : 12
                                    }
                                    lg={
                                      !sidebarCollapsed
                                        ? 12
                                        : deviceWidth < 1050
                                        ? 12
                                        : 8
                                    }
                                    xl={8}
                                  >
                                    {" "}
                                    {handwaves.allRequest
                                      .filter(
                                        (_: Handwave, index: number) =>
                                          (index - 2) % 3 === 0
                                      ) // Skip 2 elements, starting from index 1
                                      .map(
                                        (handwave: Handwave, index: number) => (
                                          <Row
                                            style={{ marginBottom: "20px" }}
                                            key={`Ra19-${index}`}
                                          >
                                            <HandwaveItem
                                              handwave={handwave}
                                              key={`al3-${index}`}
                                            />
                                          </Row>
                                        )
                                      )}
                                  </Col>{" "}
                                </>
                              )}
                            </Row>
                          )}
                        </div>
                      </>
                    ) : (
                      <NoHandwaves text="" />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <SkeletonHandwave />
        </>
      )}
    </>
  );
}

export default HandwavesContent;
