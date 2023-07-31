import type { Meta, StoryObj } from "@storybook/react";
import SortableTable from "./SortableTable";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { getComparator, stableSort } from "./helpers";

const MOCK_ITEM_LINES = [
  {
    "price_20": 807,
    "price_40": 1578,
    "supplier": "WOLVERINE",
    "item_line": "ONC to Rail Rump",
    "currency_code": "GBP",
    "price_20_usd": 2000,
    "price_40_usd": 4000,
    "currency": 1,
  },
  {
    "price_20": 331,
    "price_40": 1198,
    "supplier": "ORIAN",
    "item_line": "IT Charges",
    "currency_code": "GBP",
    "price_20_usd": 2000,
    "price_40_usd": 4000,
    "currency": 1,
  },
  {
    "price_20": 475,
    "price_40": 1719,
    "supplier": "WOLVERINE",
    "item_line": "IL Inland Delivery",
    "currency_code": "EUR",
    "price_20_usd": 2000,
    "price_40_usd": 4000,
    "currency": 1,
  },
  {
    "price_20": 653,
    "price_40": 1721,
    "supplier": "VALEKA",
    "item_line": "MSF",
    "currency_code": "GBP",
    "price_20_usd": 2000,
    "price_40_usd": 4000,
    "currency": 1,
  },
  {
    "price_20": 185,
    "price_40": 1298,
    "supplier": "ORIAN",
    "item_line": "Something",
    "currency_code": "EUR",
    "price_20_usd": 2000,
    "price_40_usd": 4000,
    "currency": 1,
  },
];

const ITEM_LINE_HEAD_CELLS = [
  { valueKey: "supplier" as never, label: "Supplier" },
  { valueKey: "item_line" as never, label: "Item Line" },
  { valueKey: "price_20" as never, label: "Price 20" },
  { valueKey: "price_40" as never, label: "Price 40" },
  { valueKey: "currency_code" as never, label: "Currency" },
];

const meta: Meta<typeof SortableTable> = {
  component: SortableTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SortableTable>;

export const WithData: Story = {
  args: {
    rowData: MOCK_ITEM_LINES,
    headCells: ITEM_LINE_HEAD_CELLS,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const tableRows = canvas.getAllByRole("row");

    await step("Renders the correct amount of rows including one extra row for the table head.", async () => {
      await expect(tableRows).toHaveLength(6);
    });

    await step("Renders the correct data in cells.", async () => {
      const firstRowCells = within(tableRows[1]).getAllByRole("cell");
      await expect(firstRowCells[0]).toHaveTextContent("WOLVERINE");
      await expect(firstRowCells[1]).toHaveTextContent("ONC to Rail Rump");
      await expect(firstRowCells[2]).toHaveTextContent("807");
      await expect(firstRowCells[3]).toHaveTextContent("1578");
      await expect(firstRowCells[4]).toHaveTextContent("GBP");

      const lastRowCells = within(tableRows[5]).getAllByRole("cell");
      await expect(lastRowCells[0]).toHaveTextContent("ORIAN");
      await expect(lastRowCells[1]).toHaveTextContent("Something");
      await expect(lastRowCells[2]).toHaveTextContent("185");
      await expect(lastRowCells[3]).toHaveTextContent("1298");
      await expect(lastRowCells[4]).toHaveTextContent("EUR");
    });

    await step("Sorts the values correctly in ascending and descending order.", async () => {
      const headers = canvas.getAllByRole("columnheader");

      for (let i = 0; i < headers.length; i++) {
        const orderBy = ITEM_LINE_HEAD_CELLS[i].valueKey;
        const headerButton = within(headers[i]).getByRole("button");

        // test sorting in ascending order
        await userEvent.click(headerButton);
        const sortedColumnValuesAsc = tableRows.slice(1)
          .map(row => row.querySelectorAll("td")[i].textContent);
        const sortedDataAsc = stableSort(MOCK_ITEM_LINES, getComparator("asc", orderBy));
        await expect(sortedColumnValuesAsc).toEqual(sortedDataAsc.map(row => String(row[orderBy])));

        // test sorting in descending order
        await userEvent.click(headerButton);
        const sortedColumnValuesDesc = tableRows.slice(1)
          .map(row => row.querySelectorAll("td")[i].textContent);
        const sortedDataDesc = stableSort(MOCK_ITEM_LINES, getComparator("desc", orderBy));
        await expect(sortedColumnValuesDesc).toEqual(sortedDataDesc.map(row => String(row[orderBy])));
      }
    });
  },
};

export const WithDataButDeiabled: Story = {
  args: {
    rowData: [MOCK_ITEM_LINES[0]],
    headCells: ITEM_LINE_HEAD_CELLS,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const tableRows = canvas.getAllByRole("row");

    await step("Renders the correct amount of rows including one extra row for the table head.", async () => {
      await expect(tableRows).toHaveLength(2);
    });

    await step("Renders the correct data in cells.", async () => {
      const firstRowCells = within(tableRows[1]).getAllByRole("cell");
      await expect(firstRowCells[0]).toHaveTextContent("WOLVERINE");
      await expect(firstRowCells[1]).toHaveTextContent("ONC to Rail Rump");
      await expect(firstRowCells[2]).toHaveTextContent("807");
      await expect(firstRowCells[3]).toHaveTextContent("1578");
      await expect(firstRowCells[4]).toHaveTextContent("GBP");
    });

    await step("Head cells are in disabled state (nothing clickable inside them).", async () => {
      canvas.getAllByRole("columnheader").forEach(async (header) =>
        await expect(within(header).queryByRole("button")).toBeNull()
      );
    });
  },
};