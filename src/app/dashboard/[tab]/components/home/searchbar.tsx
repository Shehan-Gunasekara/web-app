import style from "@/styles/home/home";
import { theme } from "antd";
import { FaRegCalendar } from "react-icons/fa";

function SearchBar() {
  const {
    token: {
      colorTextBase,
      colorBgContainer,
      colorTextDisabled,
      colorTextLightSolid,
    },
  } = theme.useToken();

  return (
    <div style={style.generalDate}>
      <div
        style={{
          backgroundColor: colorBgContainer,
          color: colorTextDisabled,
          ...style.generalDateContainer,
        }}
      >
        <div
          style={{
            color: colorTextBase,
            ...style.datePickerIcon,
          }}
        >
          <FaRegCalendar />
        </div>
        <div>Sep 2, 2023 - Sep 31, 2024</div>
        <div
          style={{
            backgroundColor: colorTextBase,
            ...style.selectMonthContainer,
          }}
        >
          <div>Select period or month</div>
          <div
            style={{
              color: colorTextLightSolid,
              ...style.datePickerIcon,
            }}
          >
            <FaRegCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
