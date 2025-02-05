import { Skeleton, Divider, theme } from "antd";

function AccountInfoSkeleton() {
  const {
    token: { colorBgContainer, colorTextBase },
  } = theme.useToken();

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: colorBgContainer,
        padding: "1.5rem",
        borderRadius: "1rem",
        width: "100%",
      }}
    >
      <div>
        <Skeleton.Button active style={{ width: "15vw" }} />
      </div>
      <div style={{ margin: "1rem 0" }}>
        <Divider
          style={{
            backgroundColor: colorTextBase,
            margin: 0,
            padding: 0,
          }}
        />
      </div>
      <div style={{ margin: "2rem 0 1.5rem 0" }}>
        <Skeleton.Input active style={{ width: "25vw" }} />
      </div>
      <div style={{ margin: "1.5rem 0 2rem 0", display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <Skeleton.Input active block />
        </div>
        <div style={{ flex: 3 }}>
          <Skeleton.Input active block />
        </div>
      </div>
      <div style={{ marginTop: "2.5rem" }}>
        <Skeleton.Button active style={{ width: "15vw" }} />
      </div>
      <div style={{ margin: "1rem 0" }}>
        <Divider
          style={{
            backgroundColor: colorTextBase,
            margin: 0,
            padding: 0,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "2rem",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 3 }}>
          <Skeleton.Input active block />
        </div>
        <div style={{ flex: 1 }}>
          <Skeleton.Input active block />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "2rem",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 3 }}>
          <Skeleton.Input active block />
        </div>
        <div style={{ flex: 1 }}>
          <Skeleton.Input active block />
        </div>
      </div>
      <div
        style={{
          marginTop: "12vh",
          display: "flex",
          justifyContent: "end",
          marginBottom: "3rem",
        }}
      >
        <Skeleton.Button active style={{ width: "20vw", height: "2.5rem" }} />
      </div>
    </div>
  );
}

export default AccountInfoSkeleton;
