import type { Meta, StoryObj } from "@storybook/react";
import PaginatedSortedTable from "./PaginatedSortedTable";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

const VALUE_KEYS = [
  "discharge_port",
  "incoterm",
  "sealine",
  "valid_from",
  "duration_sum",
  "free_days",
  "total_price_20_usd",
  "total_price_40_usd",
];

const meta: Meta<typeof PaginatedSortedTable> = {
  component: PaginatedSortedTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PaginatedSortedTable>;

export const Offers: Story = {
  args: {
    totalRows: 200,
    pageSize: 15,
    children: <>
      <PaginatedSortedTable.Head>
        <PaginatedSortedTable.HeadCell valueKey="discharge_port">POD</PaginatedSortedTable.HeadCell>
        <PaginatedSortedTable.HeadCell valueKey="incoterm">Incoterm</PaginatedSortedTable.HeadCell>
        <PaginatedSortedTable.HeadCell valueKey="sealine">Sealine</PaginatedSortedTable.HeadCell>
        <PaginatedSortedTable.HeadCell valueKey="valid_from">Dates</PaginatedSortedTable.HeadCell>
        <PaginatedSortedTable.HeadCell valueKey="duration_sum">Duration</PaginatedSortedTable.HeadCell>
        <PaginatedSortedTable.HeadCell valueKey="free_days">Free Days</PaginatedSortedTable.HeadCell>
        <PaginatedSortedTable.HeadCell valueKey="total_price_20_usd">Price 20</PaginatedSortedTable.HeadCell>
        <PaginatedSortedTable.HeadCell valueKey="total_price_40_usd">Price 40</PaginatedSortedTable.HeadCell>
        <PaginatedSortedTable.HeadCell>Actions</PaginatedSortedTable.HeadCell>
      </PaginatedSortedTable.Head>

      <PaginatedSortedTable.Body />
    </>
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const headers = canvas.getAllByRole("columnheader");

    await step("Renders the correct amount of head cells", async () => {
      await expect(headers).toHaveLength(9);
    });

    for (let i = 0; i < VALUE_KEYS.length; i++) {
      const valueKey = VALUE_KEYS[i];

      await step(`Sets the "sort" URL parameter correctly to "${valueKey}".`, async () => {
        await userEvent.click(within(headers[i]).getByRole("button"));
        await expect(new URLSearchParams(location.search).get("sort")).toBe(`${valueKey}`);
        await userEvent.click(within(headers[i]).getByRole("button"));
        await expect(new URLSearchParams(location.search).get("sort")).toBe(`-${valueKey}`);
      });
    }

    await step("The head cell without any props is disabled and is not clickable.", async () => {
      await expect(within(headers[8]).queryByRole("button")).toBeNull();
    });
  },
};