import { AlertColor } from "@mui/material";
import { createContext } from "react";

export type ToastContextValue = {
  open: (message: React.ReactNode, severity: AlertColor, openDuration: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export default ToastContext;