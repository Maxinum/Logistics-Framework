import { useLocation, useNavigate } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import PrimaryButton from "../../components/PrimaryButton";

export default function Error() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <Stack component="main" alignItems="center" justifyContent="center" height="90%" spacing={4}>
      <Typography variant="h3" component="h1">
        Oops!
      </Typography>

      <Typography component="p" textAlign="center" maxWidth="550px">
        Sorry, an unexpected error has occurred.
      </Typography>

      <Typography component="p" textAlign="center" fontStyle="italic" maxWidth="550px">
        {state.message}
      </Typography>

      <PrimaryButton onClick={() => navigate(-1)}>Try Again</PrimaryButton>
    </Stack>
  );
}