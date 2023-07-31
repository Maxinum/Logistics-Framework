import { styled, Button } from "@mui/material";

const SecondaryButton = styled(Button)`
  border: 1px solid var(--blue);
  background-color: #fff;
  color: var(--blue);
  text-transform: none;
  &:hover {
    background-color: #dae7f2;
  }
` as typeof Button;

export default SecondaryButton;