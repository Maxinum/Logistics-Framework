import { Stack, Typography } from "@mui/material";
import SecondaryButton from "../../components/SecondaryButton";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Stack
      component="main"
      height="90%"
      alignItems="center"
      justifyContent="center"
      spacing={3}
    >
      <Typography variant="h1" component="h1" fontSize="9.5rem" lineHeight={0.8}>
        404
      </Typography>

      <Typography variant="subtitle1" component="h3" textTransform="uppercase">
        This page doesn't exist or is unavailable.
      </Typography>

      <SecondaryButton component={Link} to="/">
        Go Back to Home
      </SecondaryButton>
    </Stack>
  );
}