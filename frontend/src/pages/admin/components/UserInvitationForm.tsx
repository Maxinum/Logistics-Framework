import { useState } from "react";
import { useAsync } from "../../../utils/hooks";
import { useToast } from "../../../utils/toast";
import invitationsService from "../../../utils/services/invitations";
import { doesEmailHaveTopLevelDomain, revalidateCache } from "../../../utils/helpers";
import { OutlinedInput, Stack } from "@mui/material";
import { LabeledInputWrapper, PrimaryButton } from "../../../components";

export default function UserInvitationForm() {
  const [isError, setIsError] = useState(false);
  const { execute, status } = useAsync(invitationsService.create);
  const toast = useToast();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const { email, confirmEmail } = event.target as typeof event.target & {
      email: { value: string; };
      confirmEmail: { value: string; };
    };

    if (email.value !== confirmEmail.value) {
      toast.open("Email addresses do not match!", "error", 3 * 1000);
      setIsError(true);
      return;
    }

    if (!doesEmailHaveTopLevelDomain(email.value)) {
      toast.open("Please include the top level domain in your email!", "error", 3 * 1000);
      setIsError(true);
      return;
    }

    const { status } = await execute(email.value, confirmEmail.value);
    if (status === "success") {
      setIsError(false);
      toast.open(`Invitation sent successfully to ${email.value}!`, "success", 2 * 1000);
      await revalidateCache(invitationsService.QUERY_KEY);
    }
  };

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit} width={350}>
      <LabeledInputWrapper htmlFor="email" label="Invitation email">
        <OutlinedInput
          type="email"
          size="small"
          id="email"
          name="email"
          placeholder="example@example.com"
          disabled={status === "loading"}
          error={isError}
          required
        />
      </LabeledInputWrapper>

      <LabeledInputWrapper htmlFor="confirmEmail" label="Confirm invitation email">
        <OutlinedInput
          type="email"
          size="small"
          id="confirmEmail"
          name="confirmEmail"
          placeholder="example@example.com"
          disabled={status === "loading"}
          error={isError}
          required
        />
      </LabeledInputWrapper>

      <PrimaryButton type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Invitation"}
      </PrimaryButton>
    </Stack>
  );
}