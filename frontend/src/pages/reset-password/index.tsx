import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, Navigate } from "react-router-dom";
import { useAsync } from "../../utils/hooks";
import resetPasswordService from "../../utils/services/resetPassword";
import { getPasswordValidationMessage } from "../../utils/helpers";
import { Stack, Typography } from "@mui/material";
import { PasswordValidityProgress, PasswordInput, PrimaryButton } from "../../components";
import Logo from "../../assets/logo.png";

const muiStyles = {
  errorMessage: {
    alignSelf: "flex-start",
    color: "#d74747",
    fontSize: "0.875rem",
  }
};

export default function ResetPassword() {
  const { token } = useParams();
  const [error, setError] = useState("");
  const { execute, status } = useAsync(resetPasswordService.reset);
  const { control, watch, handleSubmit } = useForm({
    defaultValues: { password: "", confirmPassword: "" }
  });
  const isLoading = status === "loading";

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const passwordError = getPasswordValidationMessage(data.password);

    if (passwordError) {
      setError(passwordError);
      return;
    }

    setError("");
    await execute(token || "", data.password, data.confirmPassword);
  });

  if (status === "success") {
    return (
      <Navigate
        to="/success"
        replace
        state={{
          title: "Successful password reset!",
          message: "You can now use your new password to log in to your account",
        }}
      />
    );
  }

  return (
    <Stack component="main" alignItems="center" justifyContent="center" minHeight="100%" spacing={3}>
      <img src={Logo} width={137} height={40} alt="Logistics Framework" />

      <hgroup>
        <Typography variant="h4" component="h1" textAlign="center" marginBottom={2}>
          Reset Account Password
        </Typography>
        <Typography component="p" textAlign="center">
          Enter a new password for your account
        </Typography>
      </hgroup>

      <Stack component="form" onSubmit={onSubmit} spacing={2.5} width="90%" maxWidth="335px">
        <Controller
          name="password"
          control={control}
          render={({ field }) =>
            <PasswordInput
              {...field}
              size="small"
              placeholder="New password"
              autoComplete="new-password"
              disabled={isLoading}
              required
            />
          }
        />

        <PasswordValidityProgress password={watch("password")} />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) =>
            <PasswordInput
              {...field}
              size="small"
              placeholder="Confirm new password"
              autoComplete="new-password"
              disabled={isLoading}
              required
            />
          }
        />

        {error ? <Typography sx={muiStyles.errorMessage}>{error}</Typography> : null}

        <PrimaryButton type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Confirm"}
        </PrimaryButton>
      </Stack>
    </Stack>
  );
}