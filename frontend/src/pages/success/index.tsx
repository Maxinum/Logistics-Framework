import { useLocation, Link } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import PrimaryButton from "../../components/PrimaryButton";
import Logo from "../../assets/logo.png";

export default function Success() {
  const { state } = useLocation();

  return (
    <Stack component="main" alignItems="center" justifyContent="center" minHeight="100%" spacing={3}>
      <img src={Logo} width={40} height={40} alt="Logistics Framework" />

      <Typography variant="h4" component="h1">
        {state.title}
      </Typography>

      <Typography component="p" textAlign="center" maxWidth="550px">
        {state.message}
      </Typography>

      <PrimaryButton component={Link} to="/login" replace>Sign in</PrimaryButton>
    </Stack>
  );
}