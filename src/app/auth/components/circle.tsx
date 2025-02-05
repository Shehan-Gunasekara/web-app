import React from "react";
import { theme } from "antd";
import { GoCircle } from "react-icons/go";

function CircleComponent(fromActive: any, formDone: any) {
  const {
    token: { colorIcon, green2, colorBgContainerDisabled },
  } = theme.useToken();

  return (
    <div>
      <GoCircle
        style={{
          color: fromActive
            ? colorIcon
            : formDone
            ? green2
            : colorBgContainerDisabled,
          fontSize: 80,
        }}
      />
    </div>
  );
}

export default CircleComponent;
