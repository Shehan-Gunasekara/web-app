import style from "@/styles/table/table-map-view";
import { Col, Flex, Row, theme } from "antd";
import React from "react";

interface TableMapViewProps {
  tableDetails: Table[];
  action: (table: any) => any;
}
interface Table {
  id: number;
  restaurant_id?: number;
  table_number?: number;
  seating_capacity?: number;
  status?: string;
  qr_code?: string;
  session_id?: string;
  session_start_time?: string;
  session_elapsed_time?: string;
}

function TableMapView({ tableDetails, action }: TableMapViewProps) {
  const {
    token: { colorInfoActive, colorInfoText, colorFillAlter },
  } = theme.useToken();

  const twoPersonTables = tableDetails.filter(
    (table) => table.seating_capacity == 2
  );
  const roundTables = tableDetails.filter(
    (table) => table.status?.toLowerCase() == "active"
  );
  const largeTables = tableDetails.filter(
    (table) => table.status?.toLowerCase() == "inactive"
  );

  return (
    <Flex
      vertical
      gap={"2rem"}
      justify={"space-between"}
      style={{ padding: "2rem 1rem 1rem 1rem " }}
    >
      {twoPersonTables && twoPersonTables.length > 0 && (
        <Row gutter={[16, 16]}>
          {twoPersonTables.map((table, index) => (
            <Col key={index} flex={1} onClick={() => action(table)}>
              <div style={style.smallTable}>
                <div
                  style={{
                    backgroundColor: colorInfoActive,
                    ...style.smallTableLeft,
                  }}
                ></div>
                <div
                  style={{
                    backgroundColor: colorInfoActive,
                    ...style.smallTableMid,
                  }}
                >
                  <span
                    style={{
                      color: colorInfoText,
                      fontWeight: "500",
                      fontSize: "0.625rem",
                    }}
                  >
                    Table
                  </span>
                  <span
                    style={{
                      color: colorInfoText,
                      fontWeight: "500",
                      fontSize: "32px",
                      lineHeight: "1",
                    }}
                  >
                    {table.table_number}
                  </span>
                </div>
                <div
                  style={{
                    backgroundColor: colorInfoActive,
                    ...style.smallTableRight,
                  }}
                ></div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {roundTables && roundTables.length > 0 && (
        <Row gutter={[16, 16]}>
          {roundTables.map((table, index) => (
            <Col key={index} flex={1} onClick={() => action(table)}>
              <div style={style.roundTable}>
                <div
                  style={{
                    backgroundColor: colorInfoActive,
                    ...style.roundedTableCircle,
                  }}
                ></div>
                <div style={style.roundCircleMid}>
                  <div
                    style={{
                      backgroundColor: colorInfoActive,
                      ...style.roundedTableCircle,
                    }}
                  ></div>
                  <div
                    style={{
                      backgroundColor: colorInfoActive,
                      ...style.roundCircleMidCircle,
                    }}
                  >
                    <span
                      style={{
                        color: colorInfoText,
                        fontWeight: "500",
                        fontSize: "0.625rem",
                      }}
                    >
                      Table
                    </span>
                    <span
                      style={{
                        color: colorInfoText,
                        fontWeight: "500",
                        fontSize: "32px",
                        lineHeight: "1",
                      }}
                    >
                      {table.table_number}
                    </span>
                  </div>
                  <div
                    style={{
                      backgroundColor: colorInfoActive,
                      ...style.roundedTableCircle,
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    backgroundColor: colorInfoActive,
                    ...style.roundedTableCircle,
                  }}
                ></div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {largeTables && largeTables.length > 0 && (
        <Row
          gutter={[16, 16]}
          style={{
            border: "1px solid",
            borderColor: colorFillAlter,
            borderRadius: "20px",
            padding: "2rem 0.5rem",
          }}
        >
          {largeTables.map((table, index) => (
            <Col key={index} flex={1} onClick={() => action(table)}>
              <div style={style.largeTable}>
                <div
                  style={{
                    backgroundColor: colorInfoActive,
                    ...style.largeTableTop,
                  }}
                ></div>
                <div
                  style={{
                    backgroundColor: colorInfoActive,
                    ...style.largeTableMid,
                  }}
                >
                  <span
                    style={{
                      color: colorInfoText,
                      fontWeight: "500",
                      fontSize: "0.625rem",
                    }}
                  >
                    Table
                  </span>
                  <span
                    style={{
                      color: colorInfoText,
                      fontWeight: "500",
                      fontSize: "32px",
                      lineHeight: "1",
                    }}
                  >
                    {table.table_number}
                  </span>
                </div>
                <div
                  style={{
                    backgroundColor: colorInfoActive,
                    ...style.largeTableBottom,
                  }}
                ></div>
              </div>
            </Col>
          ))}
        </Row>
      )}
      <span
        style={{
          color: colorInfoActive,
          textAlign: "center",
          fontSize: "1rem",
        }}
      >
        terrace
      </span>
    </Flex>
  );
}

export default TableMapView;
