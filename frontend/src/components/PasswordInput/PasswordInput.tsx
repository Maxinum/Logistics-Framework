import { forwardRef, useState } from "react";
import { OutlinedInput, InputAdornment, IconButton, OutlinedInputProps } from "@mui/material";
import { Visibility, VisibilityOff } from "../icons";

const muiStyles = {
  input: {
    position: "relative",
    padding: 0,
    "& > .MuiInputBase-input": {
      paddingRight: "14px",
    },
  },
  adornment: {
    position: "absolute",
    right: 5,
  },
};

const PasswordInput = forwardRef(function PasswordInput(props: OutlinedInputProps, ref) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);

  return (
    <OutlinedInput
      {...props}
      ref={ref}
      sx={muiStyles.input}
      type={showPassword ? "text" : "password"}
      endAdornment={
        <InputAdornment sx={muiStyles.adornment} position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
});

export default PasswordInput;