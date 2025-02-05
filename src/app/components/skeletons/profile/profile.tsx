import { Skeleton, Divider, theme } from "antd";
import AccountInfoSkeleton from "./account-info";

function ProfileSkeleton() {
  const {
    token: { colorBgBase, colorBgContainer, colorTextBase },
  } = theme.useToken();
  return (
    <div style={{ background: colorBgBase }}>
      <div style={{ display: "flex", margin: "0 1.5rem", gap: "1.5rem" }}>
        <div
          style={{
            width: "25rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              backgroundColor: colorBgContainer,
              padding: "1rem",
              borderRadius: "1rem",
              width: "100%",
            }}
          >
            <div>
              <Skeleton.Button active style={{ width: "15vw" }} />
            </div>
            <div style={{ margin: "0.5rem 1rem" }}>
              <Divider
                style={{
                  backgroundColor: colorTextBase,
                  margin: 0,
                  padding: 0,
                }}
              />
            </div>
            <div>
              <Skeleton.Image active style={{ width: 180, height: 180 }} />
            </div>
          </div>
          <Skeleton.Button
            active
            block
            style={{ height: "3rem", marginTop: "2rem" }}
          />
          <Skeleton.Button
            active
            block
            style={{ height: "1.5rem", marginTop: "2rem" }}
          />
        </div>
        <AccountInfoSkeleton />
      </div>
    </div>
  );
}

export default ProfileSkeleton;
