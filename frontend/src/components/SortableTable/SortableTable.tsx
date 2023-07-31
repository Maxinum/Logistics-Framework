import { useState } from "react";
import { stableSort, getComparator } from "./helpers";
import {
  TableContainer,
  Table,
  TableHead,
  TableSortLabel,
  TableBody,
  TableRow,
  TableCell,
  styled
} from "@mui/material";

export type HeadCell<T> = {
  valueKey: keyof T;
  label: string;
};

export type SortableTableProps<T> = {
  /** An array of objects that includes the data for table rows. */
  rowData: T[];
  /** 
   * An array of objects that represent columns where the `valueKey`
   * property is needed to access a single value from a row.
   */
  headCells: HeadCell<T>[];
};

const muiStyles = {
  table: {
    borderRadius: "8px",
    border: "1px solid #cfd7df",
  },
  tableHead: {
    backgroundColor: "#dfecff",
  },
  headCell: {
    fontWeight: "700",
  },
  evenRow: {
    backgroundColor: "#f5f9ff",
  },
};

const Cell = styled(TableCell)`
  color: var(--blue);
  border: none;
  border-right: 1px solid #dfecff;
  padding-top: 9px;
  padding-bottom: 8px;
`;

/**
 * Sortable table component that under the hood uses the MUI Table and provides sorting capabilities.
 * 
 * @example
 *  function UsersTable() {
 *    // An array of objects that includes the data for table rows.
 *    const users = [
 *      { name: "John", username: "nagibator3000" }, 
 *      { name: "Jack", username: "harlow1337" },
 *    ];
 * 
 *    // An array of objects that represent columns where the `valueKey`
 *    // property is needed to access a single value from a row. 
 *    const headCells = [
 *      { valueKey: "name", label: "Name" },
 *      { valueKey: "username", label: "Username" },
 *    ];
 * 
 *    return <SortableTable rowData={users} headCells={headCells} />;
 *  }
 */
export default function SortableTable<T>({ rowData, headCells }: SortableTableProps<T>) {
  const [orderBy, setOrderBy] = useState<keyof T | "">("");
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const sortedValues = stableSort(rowData, getComparator(order, String(orderBy)));

  const handleSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <TableContainer sx={muiStyles.table}>
      <Table size="small">
        <TableHead sx={muiStyles.tableHead}>
          <TableRow>
            {headCells.map(({ valueKey, label }) =>
              <Cell
                key={String(valueKey)}
                sx={muiStyles.headCell}
                sortDirection={orderBy === valueKey ? order : false}
              >
                {rowData.length < 2
                  ? label
                  : <TableSortLabel
                    active={orderBy === valueKey}
                    onClick={() => handleSort(valueKey)}
                    direction={orderBy === valueKey ? order : "asc"}
                  >
                    {label}
                  </TableSortLabel>
                }
              </Cell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedValues.map((value, row) =>
            <TableRow
              key={`table-row-${row}`}
              sx={row % 2 === 0 ? muiStyles.evenRow : null}
            >
              {headCells.map((headCell, col) =>
                <Cell key={`table-cell-${row}-${col}`}>
                  {value[headCell.valueKey]}
                </Cell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}