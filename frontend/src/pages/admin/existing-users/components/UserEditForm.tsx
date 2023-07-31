import { useAsync } from "../../../../utils/hooks";
import { useToast } from "../../../../utils/toast";
import { deepEqual, revalidateCache } from "../../../../utils/helpers";
import adminService from "../../../../utils/services/admin";
import { User } from "../../../../utils/types";
import { MenuItem, OutlinedInput, Stack, Select, TextField } from "@mui/material";
import { LabeledInputWrapper, PrimaryButton } from "../../../../components";

type UserEditFormProps = {
  userInfo: User;
};

export default function UserEditForm({ userInfo }: UserEditFormProps) {
  const { execute, status } = useAsync(adminService.edit);
  const toast = useToast();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formDataObject = Object.fromEntries(formData.entries());
    const updatedUser = { ...userInfo, ...formDataObject };

    if (deepEqual(userInfo, updatedUser, ["_id"])) {
      toast.open("No changes found to save", "info", 3 * 1000);
      return;
    }

    const { status } = await execute(userInfo._id, updatedUser);

    if (status === "success") {
      toast.open("User updated successfully!", "success", 2 * 1000);
      await revalidateCache(adminService.QUERY_KEY);
    }
  };

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1.5}>
        <LabeledInputWrapper label="First Name" htmlFor="name">
          <TextField
            id="name"
            size="small"
            name="name"
            placeholder="First Name"
            defaultValue={userInfo?.name || ""}
            disabled={status === "loading"}
            required
          />
        </LabeledInputWrapper>

        <LabeledInputWrapper label="Last Name" htmlFor="surname">
          <TextField
            id="surname"
            size="small"
            name="surname"
            placeholder="Last Name"
            defaultValue={userInfo?.surname || ""}
            disabled={status === "loading"}
            required
          />
        </LabeledInputWrapper>
      </Stack>

      <LabeledInputWrapper label="Status" htmlFor="status">
        <Select
          size="small"
          name="status"
          defaultValue={userInfo?.status || "Active"}
          inputProps={{ id: "status" }}
          disabled={status === "loading"}
          required
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      </LabeledInputWrapper>

      <LabeledInputWrapper label="Email" htmlFor="email">
        <OutlinedInput
          id="email"
          size="small"
          name="email"
          type="email"
          placeholder="example@example.com"
          defaultValue={userInfo?.email || ""}
          disabled={status === "loading"}
          required
        />
      </LabeledInputWrapper>

      <PrimaryButton type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Saving..." : "Save"}
      </PrimaryButton>
    </Stack>
  );
}