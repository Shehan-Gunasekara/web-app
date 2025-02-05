import { theme } from "antd";

function NoHandwaves({ text }: { text: string }) {
  const {
    token: { colorBgContainer, geekblue9 },
  } = theme.useToken();
  return (
    <div style={{ width: "100vw" }}>
      <div
        style={{
          width: "100%",
          height: "75vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colorBgContainer,
          borderRadius: "1.5rem",
        }}
      >
        <h3 style={{ color: geekblue9 }}>
          {`Currently, there are no ${text} handwaves`}
        </h3>
      </div>
    </div>
  );
}

export default NoHandwaves;
