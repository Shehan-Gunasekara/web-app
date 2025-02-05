import { theme } from "antd";

interface HandwaveNotificationProps {
  count: number;
  isNotify?: boolean;
}

const HandwaveNotification: React.FC<HandwaveNotificationProps> = ({
  count,
  isNotify,
}) => {
  // const { handwaves } = useHandwaveContext();

  const {
    token: { red10, purple1 },
  } = theme.useToken();

  // const goodHandwaves = handwavesTemp ?? handwaves;
  // const relevantHandwaves = goodHandwaves.filter(
  //   (handwave: Handwave) =>
  //     (tab === "all" || handwave.type === tab) &&
  //     handwave.status !== "dismissed"
  // );

  // const hasUnviewed = relevantHandwaves.some(
  //   (handwave: Handwave) => handwave.status === "unViewed"
  // );
  let flash = isNotify ? "animate-pulse" : "";

  // Determine the color based on the longest unread handwave's time
  // let color = colorBgBase;
  // if (relevantHandwaves.length > 0) {
  //   const currentTime = new Date().getTime();
  //   const longestTime = Math.max(
  //     ...relevantHandwaves.map(
  //       (handwave: Handwave) =>
  //         currentTime - new Date(handwave.created).getTime()
  //     )
  //   );

  //   if (longestTime < 60 * 1000) {
  //     color = green1;
  //   } else if (longestTime < 5 * 60 * 1000) {
  //     color = yellow1;
  //   } else if (longestTime < 10 * 60 * 1000) {
  //     color = orange1;
  //   } else {
  //     color = red1;
  //     flash = "animate-pulse";
  //   }
  // }

  // if (relevantHandwaves.length === 0) {
  //   return null;
  // }

  return (
    // <></>
    <>
      <style>
        {`
      @keyframes flash {
        0% { opacity: 1; }
        100% { opacity: 0.8; }
      }
    `}
      </style>
      <div
        className={` ${flash}`}
        style={{
          backgroundColor: isNotify ? red10 : purple1,
          display: "flex",
          width: "20px",
          height: "20px",
          borderRadius: "50px",
          lineHeight: "22px",
          color: "white",
          fontSize: "11px",
          fontWeight: 700,
          justifyContent: "center",
          alignItems: "center",
          ...(flash ? { animation: "flash 1s infinite alternate" } : {}),
        }}
      >
        {count}
      </div>
    </>
  );
};

export default HandwaveNotification;
