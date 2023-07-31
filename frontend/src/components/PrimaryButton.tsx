import { styled, Button } from "@mui/material";

const PrimaryButton = styled(Button)`
  background-color: var(--blue);
  color: #fff;
  min-width: 140px;
  text-transform: none;
  &:hover {
    background-color: #1c6aad;
  }
` as typeof Button;

export default PrimaryButton;