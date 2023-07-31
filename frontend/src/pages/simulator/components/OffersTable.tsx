import { memo, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { usePaginatedData, useConfirm, useCounter, useAsync } from "../../../utils/hooks";
import { useToast } from "../../../utils/toast";
import { formatPrice, formatDate, revalidateCache } from "../../../utils/helpers";
import offersService from "../../../utils/services/offers";
import { Offer } from "../../../utils/types";
import { IconButton, Stack } from "@mui/material";
import { PageLoader, PaginatedSortedTable, CircularProgress } from "../../../components";
import { Copy, Edit, Delete, Restore } from "../../../components/icons";

type Action = "delete" | "restore";

type MemoizedTableRowProps = {
  offer: Offer;
  num20: number;
  num40: number;
  handleOpenModal: (id: string) => void;
  handleEdit: (id: string) => void;
  handleCopy: (id: string) => void;
  handleMutation: (id: string, action: Action) => void;
};

const muiStyles = {
  offersCount: {
    color: "#16548a",
    fontSize: "1.375rem",
  },
  tableRow: {
    cursor: "pointer",
    transition: "all 250ms ease",
    "&:hover": {
      backgroundColor: "#f5f9ff",
    },
    "&:active": {
      opacity: "0.7",
    },
  },
};

const MemoizedTableHead = memo(({ disabled }: { disabled: boolean; }) => {
  const { Head, HeadCell } = PaginatedSortedTable;

  return (
    <Head>
      <HeadCell valueKey="discharge_port" disabled={disabled}>
        POD
      </HeadCell>
      <HeadCell valueKey="mode" disabled={disabled}>
        VIA
      </HeadCell>
      <HeadCell valueKey="incoterm" disabled={disabled}>
        Incoterm
      </HeadCell>
      <HeadCell valueKey="sealine" disabled={disabled}>
        Sealine
      </HeadCell>
      <HeadCell valueKey="loading_port" disabled={disabled}>
        POL
      </HeadCell>
      <HeadCell valueKey="transit_port" disabled={disabled}>
        T-PORT
      </HeadCell>
      <HeadCell valueKey="valid_from" disabled={disabled}>
        Dates
      </HeadCell>
      <HeadCell valueKey="duration_sum" disabled={disabled}>
        Duration
      </HeadCell>
      <HeadCell valueKey="free_days" disabled={disabled}>
        Free Days
      </HeadCell>
      <HeadCell valueKey="total_price_20_usd" disabled={disabled}>
        Price 20
      </HeadCell>
      <HeadCell valueKey="total_price_40_usd" disabled={disabled}>
        Price 40
      </HeadCell>
      <HeadCell>Actions</HeadCell>
    </Head>
  );
});


const MemoizedTableRow = memo(({
  offer,
  num20,
  num40,
  handleOpenModal,
  handleEdit,
  handleCopy,
  handleMutation
}: MemoizedTableRowProps) => {
  const { Row, Cell } = PaginatedSortedTable;

  const handleActionClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <Row onClick={() => handleOpenModal(offer._id)} sx={muiStyles.tableRow}>
      <Cell width={110}>{offer.discharge_port}</Cell>
      <Cell width={110}>{offer.mode.join(" & ")}</Cell>
      <Cell width={100}>{offer.incoterm}</Cell>
      <Cell width={100}>{offer.sealine}</Cell>
      <Cell width={110}>{offer.loading_port}</Cell>
      <Cell width={110}>{offer.transit_port}</Cell>
      <Cell width={110}>{`${formatDate(offer.valid_from)} - ${formatDate(offer.valid_until)}`}</Cell>
      <Cell width={100}>{offer.duration}</Cell>
      <Cell width={105}>{offer.free_days}</Cell>
      <Cell width={100}>${formatPrice(offer.total_price_20_usd * num20)}</Cell>
      <Cell width={100}>${formatPrice(offer.total_price_40_usd * num40)}</Cell>
      <Cell width={105}>
        {offer.activity === "Archived"
          ? null
          : <IconButton
            aria-label="edit"
            size="small"
            onClick={event => {
              handleActionClick(event);
              handleEdit(offer._id);
            }}
          >
            <Edit />
          </IconButton>
        }

        <IconButton
          aria-label="copy to input form"
          size="small"
          onClick={event => {
            handleActionClick(event);
            handleCopy(offer._id);
          }}
        >
          <Copy />
        </IconButton>

        {offer.activity === "Archived"
          ? (
            <IconButton
              aria-label="restore"
              size="small"
              onClick={event => {
                handleActionClick(event);
                handleMutation(offer._id, "restore");
              }}
            >
              <Restore title="restore" />
            </IconButton>
          ) : (
            <IconButton
              aria-label="delete"
              size="small"
              onClick={event => {
                handleActionClick(event);
                handleMutation(offer._id, "delete");
              }}
            >
              <Delete title="delete" />
            </IconButton>
          )
        }
      </Cell>
    </Row>
  );
});

const userAction = async (actionType: Action, id: string) => {
  if (actionType === "restore") await offersService.restore(id);
  else if (actionType === "delete") await offersService.remove(id);
};

export default function OffersTable() {
  const { data, isLoading, error, results, limit } = usePaginatedData(
    offersService.QUERY_KEY, offersService.getFilteredPage
  );

  const toast = useToast();
  const navigate = useNavigate();
  const [num20, Num20Counter] = useCounter();
  const [num40, Num40Counter] = useCounter();
  const [confirm, ConfirmDialog] = useConfirm();
  const { execute, status } = useAsync(userAction);

  const handleOpenModal = useCallback(
    (offerId: string) => navigate(`${offerId}${location.search}`), [navigate]
  );

  const handleEdit = useCallback(
    (offerId: string) => navigate(`edit/${offerId}${location.search}`), [navigate]
  );

  const handleCopy = useCallback(
    (offerId: string) => navigate(`create/${offerId}${location.search}`), [navigate]
  );

  const handleMutation = useCallback(async (offerId: string, action: Action) => {
    const isConfirmed = await confirm(`Confirm you want to ${action} offer ID ${offerId}`);

    if (isConfirmed) {
      const { status } = await execute(action, offerId);
      if (status === "success") {
        toast.open(`Offer ${action}d successfully!`, "success", 2 * 1000);
        await revalidateCache(offersService.QUERY_KEY);
      }
    }
  }, [confirm, execute, toast]);

  if (error) return null;

  return <>
    {isLoading
      ? <Stack alignItems="center" padding="50px 60px 0 0">
        <CircularProgress />
      </Stack>
      : <>
        <Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom="16px">
          <p style={muiStyles.offersCount}>{results} Offers</p>
          <Stack direction="row" alignItems="center" gap="8px">
            <span>20':</span> <Num20Counter />
            <span>40':</span> <Num40Counter />
          </Stack>
        </Stack>

        <PaginatedSortedTable totalRows={results} pageSize={limit}>
          <MemoizedTableHead disabled={data.length < 2} />

          <PaginatedSortedTable.Body>
            {data.map(offer =>
              <MemoizedTableRow
                key={offer._id}
                offer={offer}
                num20={num20}
                num40={num40}
                handleEdit={handleEdit}
                handleCopy={handleCopy}
                handleMutation={handleMutation}
                handleOpenModal={handleOpenModal}
              />
            )}
          </PaginatedSortedTable.Body>
        </PaginatedSortedTable>
      </>
    }

    <ConfirmDialog />

    <Outlet context={{ num20, num40 }} />

    {status === "loading" ? <PageLoader /> : null}
  </>;
}