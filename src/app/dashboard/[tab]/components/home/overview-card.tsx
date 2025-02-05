import { GrNotes } from "react-icons/gr";
import { MdTableRestaurant } from "react-icons/md";
import { theme } from "antd";
import style from "@/styles/home/home";

interface OverviewCardProps {
  icon?: string;
  status?: string;
  text: string;
  number: number;
}

function OverviewCard({ icon, status, text, number }: OverviewCardProps) {
  const {
    token: { colorTextBase, colorBgContainerDisabled, blue4, yellow2 },
  } = theme.useToken();

  const icons: { [key: string]: JSX.Element } = {
    order: <GrNotes />,
    table: <MdTableRestaurant />,
  };

  const colours: { [key: string]: string } = {
    new: blue4,
    occupied: yellow2,
  };

  const selectedIcon = icon ? icons[icon] : null;
  const selectedColour = status ? colours[status] : null;

  return (
    <div
      style={{
        color: colorTextBase,
        borderRight: `1px solid ${colorBgContainerDisabled}`,
        ...style.overviewContainer,
      }}
    >
      <div style={style.overviewIconContainer}>
        <div style={style.overviewIcon}>{selectedIcon}</div>
        <div style={style.overviewTextContainer}>
          <p
            style={{
              color: colorTextBase,
              ...style.overviewText,
            }}
          >
            {text}
          </p>
        </div>
      </div>

      <div style={style.overviewDotContainer}>
        <div style={style.overviewNumber}>{number}</div>
        <div
          style={{
            backgroundColor: selectedColour || "transparent",
            ...style.overviewDot,
          }}
        />
      </div>
    </div>
  );
}

export default OverviewCard;
