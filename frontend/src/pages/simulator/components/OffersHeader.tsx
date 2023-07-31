import { Link } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import PrimaryButton from "../../../components/PrimaryButton";

const muiStyles = {
  create: {
    height: "42px",
  },
  header: {
    borderBottom: "1px solid #94a1ab",
    paddingBottom: "12px",
  },
  heading: {
    color: "var(--blue)",
    fontSize: "2rem",
  },
};

export default function OffersHeader() {
  return (
    <Stack sx={muiStyles.header} direction="row" alignItems="center" justifyContent="space-between">
      <Typography component="h1" sx={muiStyles.heading}>Offers</Typography>
      <PrimaryButton
        size="small"
        sx={muiStyles.create}
        component={Link}
        to="create"
      >
        Add Offer
      </PrimaryButton>
    </Stack>
  );
}