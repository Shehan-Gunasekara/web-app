import { MdTableRestaurant } from "react-icons/md";
import { theme } from "antd";
import style from "@/styles/home/home";
import { IoMdArrowUp } from "react-icons/io";

interface OverviewGeneralCardProps {
  text: string;
  number: number;
}

function OverviewGeneralCard({ text, number }: OverviewGeneralCardProps) {
  const {
    token: { colorTextDescription, green1 },
  } = theme.useToken();

  return (
    <div
      style={{
        color: colorTextDescription,
        ...style.generalContainerOuter,
      }}
    >
      {text === "Average tables active" || text === "Inactive tables" ? (
        <div style={style.generalIcon}>
          <MdTableRestaurant size={32} />
        </div>
      ) : null}
      <div>
        <p style={style.generalCardTopic}>{text}</p>
        {text === "Total Orders" && <div style={style.generalEmptyDiv} />}
        <div style={style.generalContent}>
          <p style={style.generalNumber}>
            {number} {text === "Average time delivered" && <>min.</>}
          </p>
          {text === "Total Orders" && (
            <>
              <div style={{ margin: "0 5px", color: green1 }}>
                <IoMdArrowUp size={25} />
              </div>
              <p style={{ color: green1, ...style.generalPercentage }}>
                45 (6%)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OverviewGeneralCard;
