import style from "@/styles/table/table-components";
import { theme } from "antd";
import React, { useState } from "react";

interface LayoutChangeBtnProps {
  handleTableView: () => any;
}
function LayoutChangeBtn({ handleTableView }: LayoutChangeBtnProps) {
  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();
  const [isGrid, setIsGrid] = useState(true);

  const handleGridClick = () => {
    setIsGrid(true);
    handleTableView();
  };
  const handleMapClick = () => {
    setIsGrid(false);
    handleTableView();
  };

  // const gridBorderStyle = optionClicked === 'grid' ? { border: `1px solid ${colorBorder}` } : {};
  // const mapBorderStyle = optionClicked === 'map' ? { border: `1px solid ${colorBorder}` } : {};

  return (
    <div
      style={{ backgroundColor: colorBgContainer, ...style.layoutChangeBtn }}
    >
      <div
        style={{
          border: isGrid ? `1px solid` : "",
          color: colorText,
          ...style.layoutOption,
        }}
        onClick={handleGridClick}
      >
        Grid
      </div>
      <div
        style={{
          border: !isGrid ? `1px solid` : "",
          color: colorText,
          ...style.layoutOption,
        }}
        onClick={handleMapClick}
      >
        Map
      </div>
    </div>
  );
}

export default LayoutChangeBtn;
