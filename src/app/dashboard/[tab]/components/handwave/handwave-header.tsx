import { theme } from "antd";
import { useEffect, useState, useRef } from "react";
import styles from "@/styles/handwaves/handwave-header";
import { useHandwaveContext } from "@/app/providers/HandwaveProvider";
import { HandwaveContent } from "@/utils/interfaces";
import HandwaveNotification from "./handwave-notification";
import { Dropdown, Button } from "antd";
import { VscSettings } from "react-icons/vsc";
import type { MenuProps } from "antd";
import { MdCheck } from "react-icons/md";
import HandwaveConfirmationModel from "./handwave-confirmation-model";
import { useMutation } from "@apollo/client";
import { ATTEND_ALL_REQUEST } from "@/lib/mutations/notifications";
interface HandwaveHeaderProps {
  handwaves: HandwaveContent;
  handleTabChange: (tab: string) => void;
  isLoading: boolean;
}

function HandwaveHeader({ handwaves, handleTabChange }: HandwaveHeaderProps) {
  const {
    token: {
      colorBgBase,
      colorBgContainer,
      colorTextBase,
      colorBgContainerDisabled,
    },
  } = theme.useToken();

  const [attendAllRequest] = useMutation(ATTEND_ALL_REQUEST);

  const currentNoOfRequest = useRef<any>(null);
  const [newRequestCount, setNewRequestCount] = useState<any>(null);
  const [isAttendingAll, setIsAttendingAll] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);

  const [isNotify, setIsNotify] = useState(false);

  const { activeTab, refetchHandWaveRequest } = useHandwaveContext();
  const isTabActive = (tab: any) => activeTab === tab;

  const handleTabClick = (tab: any) => {
    handleTabChange(tab);
  };

  const handleConfirmationModal = () => {
    setIsConfirmationModalVisible(!isConfirmationModalVisible);
  };

  const handleAttendAllRequests = async () => {
    setIsAttendingAll(true);
    const res = await attendAllRequest({
      variables: {
        resturantID: parseInt(
          localStorage.getItem("lono_restaurant_id") || "0"
        ),
      },
    });
    if (res) {
      await refetchHandWaveRequest();
      await handleConfirmationModal();
      setIsAttendingAll(false);
    } else {
      setIsAttendingAll(false);
    }
  };

  useEffect(() => {
    if (handwaves.newRequest) {
      if (currentNoOfRequest.current === null) {
        currentNoOfRequest.current = handwaves.newRequest.length;
        setNewRequestCount(handwaves.newRequest.length);
      } else {
        if (currentNoOfRequest.current < handwaves.newRequest.length) {
          setIsNotify(true);
          setNewRequestCount(handwaves.newRequest.length);
          currentNoOfRequest.current = handwaves.newRequest.length;
        } else if (activeTab === "new") {
          setIsNotify(false);
          setNewRequestCount(handwaves.newRequest.length);
          currentNoOfRequest.current = handwaves.newRequest.length;
        } else {
          setNewRequestCount(handwaves.newRequest.length);
          currentNoOfRequest.current = handwaves.newRequest.length;
        }
      }
    }
  }, [handwaves, activeTab]);

  const renderTab = (tab: any, label: string) => {
    return (
      <div
        style={{
          color: isTabActive(tab) ? colorBgBase : colorTextBase,
          background: isTabActive(tab) ? colorTextBase : colorBgBase,
          minWidth: "120px",
          height: "30px",
          ...styles.menuHeaderLeft,
          padding: "8px 0px",
        }}
        onClick={() => handleTabClick(tab)}
        key={tab}
      >
        {label}{" "}
        {tab == "new" && (
          <div
            style={{
              marginLeft: "10px",
              position: "absolute",
              top: "-10px",
              right: "-3px",
            }}
          >
            <HandwaveNotification
              count={newRequestCount != null ? newRequestCount : 0}
              isNotify={isNotify}
            />
          </div>
          // <></>
        )}
      </div>
    );
  };

  const tabs: string[][] = [
    ["new", "New"],
    ["attended", "Attended"],
    ["all", "All"],
  ];

  const items: MenuProps["items"] = [
    {
      key: "MarkAll",
      label: (
        <div
          style={{
            ...styles.editItems,
          }}
          onClick={handleConfirmationModal}
        >
          <MdCheck
            style={{
              ...styles.checkIcon,
            }}
          />
          <p
            style={{
              ...styles.settingTexts,
            }}
          >
            Mark all as attended
          </p>
        </div>
      ),
    },
  ];

  const menuProps = {
    items,
    backgroundColor: colorBgContainerDisabled,
  };

  return (
    <div
      style={{
        ...styles.headerContainer,
      }}
    >
      <div
        style={{
          background: colorBgContainer,
          ...styles.menuHeaderLeftStatus,
        }}
      >
        {tabs.map(([type, title]) => {
          return renderTab(type, title);
        })}
      </div>

      <div>
        {" "}
        <Dropdown
          menu={menuProps}
          placement="bottomLeft"
          arrow
          disabled={currentNoOfRequest.current == 0}
        >
          <Button
            style={{
              backgroundColor: "transparent",
              ...styles.settingBtn,
            }}
          >
            <p>
              <VscSettings
                style={{
                  ...styles.settingIcon,
                }}
              />
            </p>
          </Button>
        </Dropdown>
      </div>
      <HandwaveConfirmationModel
        isOpen={isConfirmationModalVisible}
        handleConfirmationModal={handleConfirmationModal}
        handleAttendAllRequests={handleAttendAllRequests}
        isAttendingAll={isAttendingAll}
      />
    </div>
  );
}

export default HandwaveHeader;
