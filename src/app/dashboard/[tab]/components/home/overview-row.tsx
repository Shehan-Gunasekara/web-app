import { theme } from "antd";
import style from "@/styles/home/home";
import OverviewCard from "./overview-card";

interface OverviewRowProps {
  overviewData: any;
}

function OverviewRow(overviewData: OverviewRowProps) {
  const {
    token: { colorTextBase },
  } = theme.useToken();

  return (
    <div style={style.rowRow}>
      <div
        style={{
          color: colorTextBase,
          ...style.rowTwoHeading,
        }}
      >
        Realtime overview
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {overviewData.overviewData.map((data: any, index: any) => (
          <OverviewCard key={index} {...data} />
        ))}
      </div>
    </div>
  );
}

export default OverviewRow;
