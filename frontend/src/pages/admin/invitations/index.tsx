import useSWR from "swr";
import { useToast } from "../../../utils/toast";
import { useAsync, useConfirm } from "../../../utils/hooks";
import invitationsService from "../../../utils/services/invitations";
import { formatDate, revalidateCache } from "../../../utils/helpers";
import { Chip, IconButton, Stack } from "@mui/material";
import { PaginatedSortedTable, CircularProgress, Container, PageLoader } from "../../../components";
import { Delete } from "../../../components/icons";

type TableRowProps = {
  email: string;
  invitationDate: string;
  isEmailAcquired: boolean;
  isUserRegistered: boolean;
  onRevoke: React.MouseEventHandler;
};

function TableRow({
  email,
  invitationDate,
  isEmailAcquired,
  isUserRegistered,
  onRevoke
}: TableRowProps) {
  const acquisitionStatus = isEmailAcquired ? "acquired" : "not acquired";
  const invitationStatus = isUserRegistered ? "accepted" : "pending";
  const colorVariant = isUserRegistered ? "success" : "warning";

  return (
    <PaginatedSortedTable.Row>
      <PaginatedSortedTable.Cell>
        {email}
      </PaginatedSortedTable.Cell>

      <PaginatedSortedTable.Cell>
        {formatDate(new Date(invitationDate))}
      </PaginatedSortedTable.Cell>

      <PaginatedSortedTable.Cell>
        {acquisitionStatus}
      </PaginatedSortedTable.Cell>

      <PaginatedSortedTable.Cell>
        <Chip
          size="small"
          label={invitationStatus}
          color={colorVariant}
          variant="outlined"
        />
      </PaginatedSortedTable.Cell>

      <PaginatedSortedTable.Cell width={80}>
        <IconButton
          aria-label="revoke invitation"
          size="small"
          onClick={onRevoke}
        >
          <Delete title="Revoke Invitation" />
        </IconButton>
      </PaginatedSortedTable.Cell>
    </PaginatedSortedTable.Row>
  );
}

export default function InvitationsTable() {
  const { QUERY_KEY, getAll, remove } = invitationsService;
  const { data, isLoading, error } = useSWR([QUERY_KEY, "invite"], getAll);
  const { execute, status: revokeStatus } = useAsync(remove);
  const [confirmRevoke, ConfirmDialog] = useConfirm();
  const toast = useToast();

  const handleInviteRevoke = async (email: string, id: string) => {
    const isConfirmed = await confirmRevoke(
      `Are you sure you want to revoke the invitation sent to ${email}?`
    );

    if (isConfirmed) {
      const { status } = await execute(id);
      if (status === "success") {
        toast.open("Invitation revoked successfully!", "success", 2 * 1000);
        await revalidateCache(QUERY_KEY);
      }
    }
  };

  if (error) return null;

  return (
    <Container>
      {isLoading || !data
        ? <Stack alignItems="center" paddingTop="60px">
          <CircularProgress />
        </Stack>
        : <>
          {revokeStatus === "loading" ? <PageLoader /> : null}

          <PaginatedSortedTable totalRows={data.results || 0} pageSize={data.results || 10}>
            <PaginatedSortedTable.Head>
              <PaginatedSortedTable.HeadCell>
                Email
              </PaginatedSortedTable.HeadCell>
              <PaginatedSortedTable.HeadCell>
                Invited at
              </PaginatedSortedTable.HeadCell>
              <PaginatedSortedTable.HeadCell>
                Acquisition Status
              </PaginatedSortedTable.HeadCell>
              <PaginatedSortedTable.HeadCell>
                Invitation Status
              </PaginatedSortedTable.HeadCell>
              <PaginatedSortedTable.HeadCell>
                Actions
              </PaginatedSortedTable.HeadCell>
            </PaginatedSortedTable.Head>

            <PaginatedSortedTable.Body>
              {data.data.map(({ _id, email, invitationDate, isEmailAcquired, isUserRegistered }) =>
                <TableRow
                  key={_id}
                  email={email}
                  invitationDate={invitationDate}
                  isEmailAcquired={isEmailAcquired}
                  isUserRegistered={isUserRegistered}
                  onRevoke={() => handleInviteRevoke(email, _id)}
                />
              )}
            </PaginatedSortedTable.Body>
          </PaginatedSortedTable>
          <ConfirmDialog />
        </>
      }
    </Container>
  );
}