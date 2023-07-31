import { Alert, AlertColor, Snackbar } from "@mui/material";

type ToastProps = {
  handleClose: () => void;
  openDuration: number;
  isOpen: boolean;
  message: React.ReactNode;
  severity: AlertColor;
};

/**
 * Controlled toast component for notifications, error messages and so on...
 */
export default function Toast({ handleClose, openDuration, isOpen, message, severity }: ToastProps) {
  return (
    <Snackbar
      disableWindowBlurListener
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={openDuration}
      onClose={(_, reason) => {
        if (reason === "clickaway") return;
        handleClose();
      }}
      open={isOpen}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{ fontSize: "1.0625rem" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}