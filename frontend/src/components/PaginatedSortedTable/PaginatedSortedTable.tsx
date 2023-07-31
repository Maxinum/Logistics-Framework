import { useSearchParams } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableSortLabel,
  TableRow,
  styled,
} from "@mui/material";
import { Pagination } from "..";

type HeadCellProps = {
  valueKey?: string;
  disabled?: boolean;
  children: React.ReactNode;
};

type PaginatedSortedTableProps = {
  /**
   * Total number of table rows needed to calculate the number of pages,
   */
  totalRows: number;
  /** Size of one page, */
  pageSize: number;
  /** 
   * Table contents where `PaginatedSortedTable.Head` and 
   * `PaginatedSortedTable.Head` are direct descendants.
   */
  children: React.ReactNode;
};

const muiStyles = {
  root: {
    borderRadius: "10px",
    overflow: "hidden",
  },
  headCell: {
    color: "var(--blue)",
    fontWeight: 700,
  },
  tableControls: {
    backgroundColor: "#f7f7f7",
    padding: "24px 0",
  },
};

const Cell = styled(TableCell)`
  font-size: 0.75rem;
  height: 70px;
`;

/**
 * HeadCell component for the table header.
 *
 * @example
 * // Sets the `sort` URL parameter to "columnKey" on first
 * // click and then on second click sets it to "-columnKey"
 * <HeadCell valueKey="columnKey">Column Label</HeadCell>
 * 
 * @param valueKey - The key that needs to be assigned to `sort` URL parameter to sort by.
 * @param disabled - Optional argument, indicates whether the column is disabled.
 * @param children - Contents of the cell, serves as the label of the column.
 */
function HeadCell({ valueKey, disabled = false, children }: HeadCellProps) {
  const [urlParams, setUrlParams] = useSearchParams();
  const sort = urlParams.get("sort");
  const orderBy = sort?.replace("-", "");
  const order = sort?.charAt(0) === "-" ? "desc" : "asc";

  const onSort = () => {
    const sortValue = `${order === "asc" ? "-" : ""}${valueKey}`;
    const updatedParams = new URLSearchParams(urlParams);
    updatedParams.set("sort", sortValue);
    setUrlParams(updatedParams);
  };

  return (
    <Cell sx={muiStyles.headCell}>
      {disabled || !valueKey
        ? children
        : <TableSortLabel
          onClick={onSort}
          direction={order}
          disabled={disabled}
          active={orderBy === valueKey}
        >
          {children}
        </TableSortLabel>
      }
    </Cell>
  );
}

function Head({ children }: { children: React.ReactNode; }) {
  return (
    <TableHead>
      <TableRow sx={muiStyles.tableControls}>
        {children}
      </TableRow>
    </TableHead>
  );
}

/**
 * This compound component is responsible for setting the appropriate URL search parameters 
 * for both pagination and sorting. It manupulates the `sort` parameter for sorting by specific
 * values and the `page` parameter for setting the current pagination page.
 *
 * @param totalRows - The total number of rows in the table.
 * @param pageSize - The number of rows per page.
 * @param children - The content of the table.
 * 
 * @example
 * // In this example the first headcell sets the `sort` URL parameter to "column1" on
 * // first click (ascending) and then on second click sets it to "-column1" (descending).
 * <PaginatedSortedTable totalRows={100} pageSize={10}>
 *   <PaginatedSortedTable.Head>
 *     <PaginatedSortedTable.HeadCell valueKey="column1">
 *       Column 1
 *     </PaginatedSortedTable.HeadCell>
 * 
 *     <PaginatedSortedTable.HeadCell valueKey="column2">
 *       Column 2
 *     </PaginatedSortedTable.HeadCell>
 *   </PaginatedSortedTable.Head>
 * 
 *   <PaginatedSortedTable.Body>
 *     <PaginatedSortedTable.Row>
 *       <PaginatedSortedTable.Cell>
 *         Row 1, Cell 1
 *       </PaginatedSortedTable.Cell>
 *       <PaginatedSortedTable.Cell>
 *         Row 1, Cell 2
 *       </PaginatedSortedTable.Cell>
 *     </PaginatedSortedTable.Row>
 * 
 *     <PaginatedSortedTable.Row>
 *       <PaginatedSortedTable.Cell>
 *         Row 2, Cell 1
 *       </PaginatedSortedTable.Cell>
 *       <PaginatedSortedTable.Cell>
 *         Row 2, Cell 2
 *       </PaginatedSortedTable.Cell>
 *     </PaginatedSortedTable.Row>
 *   </PaginatedSortedTable.Body>
 * </PaginatedSortedTable>
 */
function PaginatedSortedTable({ totalRows, pageSize, children }: PaginatedSortedTableProps) {
  return (
    <Paper sx={muiStyles.root}>
      <Table>{children}</Table>

      <Pagination
        style={muiStyles.tableControls}
        totalCount={totalRows}
        pageSize={pageSize}
      />
    </Paper>
  );
}

PaginatedSortedTable.Cell = Cell;
PaginatedSortedTable.Head = Head;
PaginatedSortedTable.HeadCell = HeadCell;
PaginatedSortedTable.Row = TableRow;
PaginatedSortedTable.Body = TableBody;

export default PaginatedSortedTable;