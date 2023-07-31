import { useContext } from "react";
import ToastContext from "./ToastContext";

const useToast = () => {
  const toastContext = useContext(ToastContext);

  if (!toastContext) {
    throw new Error(
      "useToast has to be used within <ToastProvider>"
    );
  }

  return toastContext;
};

export default useToast;