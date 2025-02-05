import { theme } from "antd";
import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

type ToastProps = {
  show: boolean,
  message: string,
  style: string
}
function ToastMessage(props: ToastProps) {
  const {
    token: {
      colorPrimaryBg,
      colorTextLightSolid,
      green1
    },
  } = theme.useToken();

  const toastStyle = {
    style: {
      font: "Inter",
      background: colorPrimaryBg,
      color: colorTextLightSolid,
      fontSize: 16,
    },
  };

  const toastSuccessStyle = {
    style: {
      font: "Inter",
      background: green1,
      color: colorTextLightSolid,
      fontSize: 16,
    },
  };

  useEffect(() => {
    if (props.show) {
      if (props.style == "success") {
        toast.success(
          props.message,
          toastSuccessStyle
        );
      }

      toast.error(
        props.message,
        toastStyle
      );
    }
  }, [props.show])

  return (
    <>
      {props.show ?? (
        <Toaster />
      )}
    </>
  );

}

export default ToastMessage;