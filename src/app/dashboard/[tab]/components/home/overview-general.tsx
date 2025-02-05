import { Col, theme } from "antd";
import style from "@/styles/home/home";
import OverviewGeneralCard from "./overview-general-card";
import SearchBar from "./searchbar";
import Link from "next/link";
//import LineChart from "./linechart";
//import DonutChart from "./CircleChart";

interface OverviewGeneralProps {
  generalData: any;
  chartData: any;
}

function OverviewGeneral({
  generalData,
  chartData: _chartData,
}: OverviewGeneralProps) {
  const {
    token: { colorTextBase, purple1 },
  } = theme.useToken();

  return (
    <Col xs={24} sm={24} md={24} lg={18} style={style.generalContainer}>
      <Col style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            color: colorTextBase,
            ...style.rowThreeHeading,
          }}
        >
          General overview
        </div>

        <SearchBar />
      </Col>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginTop: "1rem",
        }}
      >
        {generalData.map((data: any, index: any) => (
          <OverviewGeneralCard key={index} {...data} />
        ))}
      </div>

      <div style={{ marginTop: 5, color: purple1 }}>
        <Link href="/dashboard/overview">view full report</Link>
      </div>

      {/* <div style={{ width: "50%", marginBottom: 20 }}>
        <LineChart chartData={chartData} />
      </div> */}
      {/* <div style={{ width: "50%", marginBottom: 20 }}>
        <DonutChart chartData={chartData} />
      </div> */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          paddingTop: 100,
        }}
      ></div>
    </Col>
  );
}

export default OverviewGeneral;
