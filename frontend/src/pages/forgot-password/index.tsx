import { Navigate } from "react-router-dom";
import { useAsync } from "../../utils/hooks";
import forgotPasswordService from "../../utils/services/forgotPassword";
import { OutlinedInput, Stack, Typography } from "@mui/material";
import { LabeledInputWrapper, PrimaryButton, UnderlinedLink } from "../../components";
import Logo from "../../assets/logo.png";

export default function ForgotPassword() {
  const { execute, status } = useAsync(forgotPasswordService.getResetToken);
  const isLoading = status === "loading";

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await execute((event.target as HTMLFormElement).email.value);
  };

  if (status === "success") {
    return (
      <Navigate
        to="/success"
        replace
        state={{
          title: "Success!",
          message: "Password reset instructions sent successfully, you can now close this page and follow the instructions in the email",
        }}
      />
    );
  }

  return (
    <Stack component="main" alignItems="center" justifyContent="center" minHeight="100%" spacing={4}>
      <img src={Logo} width={137} height={40} alt="Logistics Framework" />

      <hgroup>
        <Typography variant="h3" component="h1" textAlign="center" marginBottom={2.5}>
          Reset Account Password
        </Typography>
        <Typography textAlign="center" maxWidth="550px">
          Enter the email address associated with your account and we'll
          send you an email with instructions on how to reset your password
        </Typography>
      </hgroup>

      <Stack component="form" onSubmit={handleSubmit} spacing={3} width="90%" maxWidth="550px">
        <LabeledInputWrapper label="Email" htmlFor="email">
          <OutlinedInput
            size="small"
            type="email"
            name="email"
            id="email"
            placeholder="example@example.com"
            disabled={isLoading}
            required
          />
        </LabeledInputWrapper>

        <PrimaryButton
          size="large"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Confirm"}
        </PrimaryButton>
      </Stack>

      <UnderlinedLink to="/login" paddingTop={2}>
        Back to login
      </UnderlinedLink>
    </Stack>
  );
}