import useSWR from "swr";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, Navigate } from "react-router-dom";
import { useAsync } from "../../utils/hooks";
import signupService from "../../utils/services/signup";
import { getPasswordValidationMessage } from "../../utils/helpers";
import { FormGroup, TextField, Typography, OutlinedInput, Stack } from "@mui/material";
import {
  UnderlinedLink,
  LabeledInputWrapper,
  PageLoader,
  PasswordInput,
  PrimaryButton,
  PasswordValidityProgress
} from "../../components";

type SignupFormProps = {
  invite: string;
  email: string;
};

const muiStyles = {
  fullName: {
    display: "flex",
    flexDirection: "row",
    gap: "14px",
  },
  errorMessage: {
    alignSelf: "flex-start",
    color: "#d74747",
    fontSize: "0.875rem",
  },
};

function SignupForm({ invite, email }: SignupFormProps) {
  const [error, setError] = useState("");
  const { execute, status } = useAsync(signupService.create);
  const { control, watch, handleSubmit } = useForm({
    defaultValues: { email, name: "", surname: "", password: "", confirmPassword: "" }
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
    await execute(invite, data);
  });

  if (status === "success") {
    return (
      <Navigate
        to="/success"
        replace
        state={{
          title: "Signed up successfully!",
          message: "You can now log in with your new account",
        }}
      />
    );
  }

  return (
    <>
      <hgroup>
        <Typography variant="h4" component="h1" textAlign="center" marginBottom={2}>
          Sign up to Freight Simulator
        </Typography>
        <Typography component="p" textAlign="center">
          Already have an account? <UnderlinedLink to="/login" replace>Log in</UnderlinedLink>
        </Typography>
      </hgroup>

      <Stack component="form" spacing={2.5} onSubmit={onSubmit} maxWidth={445}>
        <LabeledInputWrapper label="Email" htmlFor="email">
          <Controller
            name="email"
            control={control}
            render={({ field }) =>
              <OutlinedInput
                {...field}
                id="email"
                size="small"
                type="email"
                autoComplete="username"
                placeholder="example@example.com"
                readOnly
                required
              />
            }
          />
        </LabeledInputWrapper>

        <LabeledInputWrapper label="Full name">
          <FormGroup sx={muiStyles.fullName}>
            <Controller
              name="name"
              control={control}
              render={({ field }) =>
                <TextField
                  {...field}
                  size="small"
                  autoComplete="given-name"
                  placeholder="First Name"
                  disabled={isLoading}
                  required
                />
              }
            />
            <Controller
              name="surname"
              control={control}
              render={({ field }) =>
                <TextField
                  {...field}
                  size="small"
                  autoComplete="family-name"
                  placeholder="Last Name"
                  disabled={isLoading}
                  required
                />
              }
            />
          </FormGroup>
        </LabeledInputWrapper>

        <LabeledInputWrapper label="Password" htmlFor="password">
          <Controller
            name="password"
            control={control}
            render={({ field }) =>
              <PasswordInput
                {...field}
                id="password"
                size="small"
                placeholder="Password"
                autoComplete="new-password"
                disabled={isLoading}
                required
              />
            }
          />
        </LabeledInputWrapper>

        <PasswordValidityProgress password={watch("password")} />

        <LabeledInputWrapper label="Confirm password" htmlFor="confirm-password">
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) =>
              <PasswordInput
                {...field}
                id="confirm-password"
                size="small"
                placeholder="Confirm password"
                autoComplete="new-password"
                disabled={isLoading}
                required
              />
            }
          />
        </LabeledInputWrapper>

        {error ? <Typography sx={muiStyles.errorMessage}>{error}</Typography> : null}

        <PrimaryButton type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Sign up"}
        </PrimaryButton>
      </Stack>
    </>
  );
}

function InviteError() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={3}
    >
      <Typography variant="h1" component="h1" fontSize="5rem">
        Sorry
      </Typography>

      <Typography variant="h5" component="h2">
        You need to obtain an invite link to create an account.
      </Typography>

      <UnderlinedLink to="/login" replace>
        Log in instead
      </UnderlinedLink>
    </Stack>
  );
}

export default function Signup() {
  const { invite } = useParams();
  const { data, isLoading, error } = useSWR(
    "hash-check", () => signupService.checkInvite(invite || ""), { shouldRetryOnError: false }
  );

  return (
    <Stack
      spacing={3}
      alignItems="center"
      justifyContent="center"
      component="main"
      minHeight="100%"
      padding="32px 0"
    >
      {isLoading
        ? <PageLoader />
        : error
          ? <InviteError />
          : <SignupForm invite={invite || ""} email={data?.email || ""} />
      }
    </Stack>
  );
}