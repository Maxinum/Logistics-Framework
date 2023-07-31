import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../utils/auth";
import { useAsync } from "../../utils/hooks";
import { OutlinedInput, Stack, Paper } from "@mui/material";
import { PasswordInput, PrimaryButton } from "../../components";
import styles from "./index.module.css";

const muiStyles = {
  mainCard: {
    textAlign: "center",
    padding: "30px 40px",
    width: "90%",
    maxWidth: "450px",
  },
  input: {
    textAlign: "center",
    fontSize: "0.845rem",
  }
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { execute, status } = useAsync(login);

  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const { email, password } = event.target as typeof event.target & {
      email: { value: string; };
      password: { value: string; };
    };

    const { status } = await execute(email.value, password.value);
    if (status === "success") {
      navigate("/simulator");
    }
  };

  return (
    <Stack
      component="main"
      alignItems="center"
      bgcolor="#ebf4fd"
      justifyContent="center"
      minHeight="100%"
      spacing={3}
    >
      <Stack component={Paper} spacing={3} sx={muiStyles.mainCard}>
        <hgroup>
          <h1 className={styles.heading}>Welcome Back</h1>
          <p className={styles.subHeading}>Enter your credentials to access your account</p>
        </hgroup>

        <Stack component="form" onSubmit={handleLogin} spacing={3}>
          <Stack spacing={1.5}>
            <OutlinedInput
              id="email"
              type="email"
              size="small"
              name="email"
              placeholder="Enter your email"
              autoComplete="username"
              inputProps={{ style: muiStyles.input as React.CSSProperties }}
              required
            />
            <PasswordInput
              id="current-password"
              size="small"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              inputProps={{ style: muiStyles.input as React.CSSProperties }}
              required
            />
          </Stack>
          {status === "error"
            ? <span className={styles.errorMessage}>
              * The username or password is incorrect.
            </span>
            : null
          }
          <PrimaryButton type="submit">
            {status === "loading" ? "Loading..." : "Sign in"}
          </PrimaryButton>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} fontSize="0.875rem">
        <p>Forgot your password?</p>
        <Link
          className={styles.resetPassword}
          to="/forgot-password"
        >
          Reset password
        </Link>
      </Stack>
    </Stack>
  );
}