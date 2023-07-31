import { styled, Backdrop } from "@mui/material";
import CircularProgress from "./CircularProgress";

const LoaderBackdrop = styled(Backdrop)(({ theme }) => ({
  background: "none",
  backdropFilter: "blur(7px)",
  zIndex: theme.zIndex.modal + 1,
}));

/**
 * Fullscreen, blured backdrop with a loading spinner
 */
export default function PageLoader() {
  return (
    <LoaderBackdrop open>
      <CircularProgress />
    </LoaderBackdrop>
  );
}