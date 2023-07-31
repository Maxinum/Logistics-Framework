import { useState, useMemo } from "react";
import ToastContext, { ToastContextValue } from "./ToastContext";
import { AlertColor } from "@mui/material";
import Toast from "../../components/Toast";

type Toast = {
  isOpen: boolean,
  message: React.ReactNode,
  openDuration: number,
  severity: AlertColor;
};

export default function ToastProvider({ children }: { children: React.ReactNode; }) {
  const [toast, setToast] = useState<Toast>({
    isOpen: false,
    message: "",
    openDuration: 1000,
    severity: "info",
  });

  const open = (message: React.ReactNode, severity: AlertColor, openDuration = 1000) => {
    setToast({
      isOpen: true,
      message,
      openDuration,
      severity,
    });
  };

  const close = () => {
    setToast({ ...toast, isOpen: false });
  };

  const contextValue: ToastContextValue = useMemo(() => ({ open }), []);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toast handleClose={close} {...toast} />
    </ToastContext.Provider>
  );
}