import { memo, useState, useCallback } from "react";
import { usePaginatedData, useAsync, useConfirm } from "../../../../utils/hooks";
import { useToast } from "../../../../utils/toast";
import { revalidateCache } from "../../../../utils/helpers";
import adminService from "../../../../utils/services/admin";
import { User } from "../../../../utils/types";
import { IconButton, Stack } from "@mui/material";
import { PaginatedSortedTable, CircularProgress, ModalWrapper, PageLoader } from "../../../../components";
import { Edit, Restore, Delete } from "../../../../components/icons";
import UserEditForm from "./UserEditForm";

type Action = "activate" | "deactivate";

type SortedTableRowProps = {
  user: User;
  index: number;
  handleEdit: (index: number) => void;
  handleMutation: (user: User, action: Action) => void;
};

const muiStyles = {
  usersCount: {
    color: "var(--blue)",
    fontSize: "1.375rem",
    marginBottom: "16px",
  },
};

const SortingTableHead = memo(({ disabled }: { disabled: boolean; }) => {
  const { Head, HeadCell } = PaginatedSortedTable;

  return (
    <Head>
      <HeadCell valueKey="email" disabled={disabled}>Email</HeadCell>
      <HeadCell valueKey="name" disabled={disabled}>First Name</HeadCell>
      <HeadCell valueKey="surname" disabled={disabled}>Last Name</HeadCell>
      <HeadCell valueKey="status" disabled={disabled}>Status</HeadCell>
      <HeadCell>Actions</HeadCell>
    </Head>
  );
});

const SortedTableRow = memo(({ user, index, handleEdit, handleMutation }: SortedTableRowProps) =>
  <PaginatedSortedTable.Row>
    <PaginatedSortedTable.Cell>{user.email}</PaginatedSortedTable.Cell>
    <PaginatedSortedTable.Cell>{user.name}</PaginatedSortedTable.Cell>
    <PaginatedSortedTable.Cell>{user.surname}</PaginatedSortedTable.Cell>
    <PaginatedSortedTable.Cell>{user.status}</PaginatedSortedTable.Cell>
    <PaginatedSortedTable.Cell width={100}>
      <IconButton
        aria-label="edit"
        size="small"
        onClick={() => handleEdit(index)}
      >
        <Edit />
      </IconButton>

      {user.status === "Inactive"
        ? <IconButton
          size="small"
          aria-label="activate"
          onClick={() => handleMutation(user, "activate")}
        >
          <Restore title="activate" />
        </IconButton>
        : <IconButton
          size="small"
          aria-label="deactivate"
          onClick={() => handleMutation(user, "deactivate")}
        >
          <Delete title="deactivate" />
        </IconButton>
      }
    </PaginatedSortedTable.Cell>
  </PaginatedSortedTable.Row>
);

const adminAction = async (actionType: Action, id: string) => {
  if (actionType === "activate") await adminService.activate(id);
  else if (actionType === "deactivate") await adminService.deactivate(id);
};

export default function UsersTable() {
  const { data, isLoading, error, results, limit } = usePaginatedData(
    adminService.QUERY_KEY, adminService.getFilteredUsers
  );

  const [currentUserIndex, setCurrentUserIndex] = useState(-1);
  const { execute: executeAction, status: actionStatus } = useAsync(adminAction);
  const [confirm, ConfirmDialog] = useConfirm();
  const toast = useToast();

  const openEditModal = useCallback((index: number) => setCurrentUserIndex(index), []);

  const handleMutation = useCallback(async (user: User, action: Action) => {
    const { status, name, surname, email } = user;
    const isConfirmed = await confirm(
      `Confirm that you want to ${action} the ${status.toLowerCase()} 
      user ${name} ${surname} who has the following email: ${email}`
    );

    if (isConfirmed) {
      const { status } = await executeAction(action, user._id);
      if (status === "success") {
        toast.open(`User ${action}d successfully!`, "success", 2 * 1000);
        await revalidateCache(adminService.QUERY_KEY);
      }
    }
  }, [confirm, executeAction, toast]);

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <Stack alignItems="center" padding="50px 60px 0 0">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <div>
      <p style={muiStyles.usersCount}>{results} Users</p>

      <PaginatedSortedTable totalRows={results} pageSize={limit}>
        <SortingTableHead disabled={data.length < 2} />

        <PaginatedSortedTable.Body>
          {data.map((user, index) =>
            <SortedTableRow
              key={user._id}
              user={user}
              index={index}
              handleEdit={openEditModal}
              handleMutation={handleMutation}
            />
          )}
        </PaginatedSortedTable.Body>
      </PaginatedSortedTable>

      <ModalWrapper
        title="Edit account"
        isOpen={currentUserIndex > -1}
        handleToggle={() => setCurrentUserIndex(-1)}
      >
        <UserEditForm
          userInfo={currentUserIndex > -1 ? data[currentUserIndex] : data[0]}
        />
      </ModalWrapper>

      <ConfirmDialog />

      {actionStatus === "loading" ? <PageLoader /> : null}
    </div>
  );
}