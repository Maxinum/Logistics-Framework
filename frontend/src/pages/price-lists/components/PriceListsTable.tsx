import { useNavigate } from "react-router-dom";
import { useToast } from "../../../utils/toast";
import { usePaginatedData, useConfirm, useAsync } from "../../../utils/hooks";
import { formatPrice, formatDate, revalidateCache } from "../../../utils/helpers";
import priceListsService from "../../../utils/services/priceLists";
import { PriceList } from "../../../utils/types";
import { Chip, Stack, IconButton, Typography } from "@mui/material";
import { CircularProgress, PaginatedSortedTable, PageLoader } from "../../../components";
import { Delete, Edit, Restore } from "../../../components/icons";
import { PRICE_LIST_KEY_LABELS_BY_CATEGORY } from "../../../utils/constants";

type Action = "delete" | "restore";

const muiStyles = {
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
  restoreIcon: {
    marginLeft: "30px",
  },
};

const defaultHeadCells = [
  { valueKey: "valid_from", label: "Valid From" },
  { valueKey: "valid_until", label: "Valid Until" },
  { valueKey: "total_price_20_usd", label: "Price 20" },
  { valueKey: "total_price_40_usd", label: "Price 40" },
  { valueKey: "activity", label: "Activity" },
  { label: "Actions" },
];

const userAction = async (actionType: Action, id: string) => {
  if (actionType === "restore") await priceListsService.restore(id);
  else if (actionType === "delete") await priceListsService.remove(id);
};

export default function PriceListsTable({ category }: { category: PriceList["category"]; }) {
  const { data, isLoading, results, limit } = usePaginatedData(
    priceListsService.QUERY_KEY, priceListsService.getFilteredPage
  );

  const toast = useToast();
  const navigate = useNavigate();
  const [confirm, ConfirmDialog] = useConfirm();
  const { execute: mutate, status: mutateStatus } = useAsync(userAction);
  const specificHeadCells = PRICE_LIST_KEY_LABELS_BY_CATEGORY[category];
  const { Head, HeadCell, Body, Row, Cell } = PaginatedSortedTable;

  const handleMutation = async (priceListId: PriceList["_id"], actionType: Action) => {
    const isConfirmed = await confirm(`Confirm you want to ${actionType} price list ID ${priceListId}`);

    if (isConfirmed) {
      const { status } = await mutate(actionType, priceListId);
      if (status === "success") {
        toast.open(`Price list ${actionType}d successfully!`, "success", 2 * 1000);
        await revalidateCache(priceListsService.QUERY_KEY);
      }
    }
  };

  const handleActionClick = (event: React.MouseEvent, action: () => void) => {
    event.stopPropagation();
    event.preventDefault();
    action();
  };

  if (isLoading) {
    return (
      <Stack alignItems="center" m="75px">
        <CircularProgress />
      </Stack>
    );
  }

  if (data.length === 0) {
    return (
      <Typography textAlign="center" fontSize="1.125rem" m="70px 10px">
        No price lists found matching this category
      </Typography>
    );
  }

  return <>
    {mutateStatus === "loading" ? <PageLoader /> : null}

    <ConfirmDialog />

    <PaginatedSortedTable totalRows={results} pageSize={limit}>
      <Head>
        {specificHeadCells.map(({ label, valueKey }, index) =>
          <HeadCell key={`${valueKey}-${index}`} valueKey={valueKey} disabled={data.length < 2}>
            {label}
          </HeadCell>
        )}
        {defaultHeadCells.map(({ label, valueKey }, index) =>
          <HeadCell key={`${valueKey}-${index}`} valueKey={valueKey} disabled={data.length < 2}>
            {label}
          </HeadCell>
        )}
      </Head>

      <Body>
        {data.map((priceList, row) => {
          const isActive = priceList.activity === "Active";
          const handleClick = isActive ? () => navigate(`${priceList._id}${location.search}`) : undefined;
          const styles = isActive ? muiStyles.tableRow : null;

          return (
            <Row key={priceList._id} onClick={handleClick} sx={styles}>
              {/* RENDER ONLY THOSE CELLS THAT BELONG TO THE CURRENT PRICE LIST CATEGORY */}
              {specificHeadCells.map(({ valueKey }) => {
                let value;

                if (valueKey.includes(".")) {
                  const [object, nestedKey] = valueKey.split("."); // GET PARENT AND CHILD KEYS OF A NESTED VALUE
                  value = priceList?.[object as keyof PriceList]?.[nestedKey as keyof PriceList[keyof PriceList]];
                } else {
                  value = priceList[valueKey as keyof PriceList];
                }

                if (Array.isArray(value) || typeof value === "object") return null;

                return (
                  <Cell key={`${valueKey}-${row}`}>
                    {value}
                  </Cell>
                );
              })}

              {/* THESE CELLS WILL ALWAYS BE RENDERED FOR ANY PRICE LIST CATEGORY */}
              <Cell>{formatDate(priceList.valid_from)}</Cell>
              <Cell>{formatDate(priceList.valid_until)}</Cell>
              <Cell>${formatPrice(priceList.total_price_20_usd || 0)}</Cell>
              <Cell>${formatPrice(priceList.total_price_40_usd || 0)}</Cell>
              <Cell>
                <Chip
                  size="small"
                  variant="outlined"
                  label={priceList.activity}
                  color={priceList.activity === "Active" ? "success" : "warning"}
                />
              </Cell>

              <Cell width={100}>
                {priceList.activity === "Archive"
                  ? <IconButton
                    size="small"
                    aria-label="restore"
                    sx={muiStyles.restoreIcon}
                    onClick={event =>
                      handleActionClick(event, () => handleMutation(priceList._id, "restore"))
                    }
                  >
                    <Restore title="Restore" />
                  </IconButton>
                  : <>
                    <IconButton
                      size="small"
                      aria-label="edit"
                      onClick={event => handleActionClick(
                        event, () => navigate(`${priceList._id}${location.search}`)
                      )}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      size="small"
                      aria-label="delete"
                      onClick={event =>
                        handleActionClick(event, () => handleMutation(priceList._id, "delete"))
                      }
                    >
                      <Delete title="Delete" />
                    </IconButton>
                  </>
                }
              </Cell>
            </Row>
          );
        })}
      </Body>
    </PaginatedSortedTable>
  </>;
}