import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "./Pagination";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Basic: Story = {
  args: {
    totalCount: 5,
    pageSize: 1,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const pageButtons = canvas.getAllByRole("button");
    const prevPageButton = pageButtons[0];
    const nextPageButton = pageButtons[pageButtons.length - 1];

    // Test the rendering correctness
    await step(`Renders the correct number of page buttons including "Back" and "Forward".`, async () => {
      await expect(pageButtons).toHaveLength(7);
    });
    await step("Renders the correct page buttons.", async () => {
      await expect(canvas.queryByText("1")).toBeInTheDocument();
      await expect(canvas.queryByText("2")).toBeInTheDocument();
      await expect(canvas.queryByText("3")).toBeInTheDocument();
      await expect(canvas.queryByText("4")).toBeInTheDocument();
      await expect(canvas.queryByText("5")).toBeInTheDocument();
    });
    await step("Renders the correct navigation buttons.", async () => {
      await expect(prevPageButton).toHaveTextContent("Back");
      await expect(prevPageButton).toBeInTheDocument();
      await expect(prevPageButton).toBeDisabled();

      await expect(nextPageButton).toHaveTextContent("Forward");
      await expect(nextPageButton).toBeInTheDocument();
      await expect(nextPageButton).not.toBeDisabled();
    });

    // Test the "Forward" button
    await step(`Clicks the next page button and updates the "page" URL search parameter.`, async () => {
      await userEvent.click(nextPageButton);
      await expect(new URLSearchParams(location.search).get("page")).toBe("2");
    });
    await step("Updates the page buttons after clicking next.", async () => {
      await expect(canvas.queryByText("1")).toBeInTheDocument();
      await expect(canvas.queryByText("2")?.className).toContain("active");
      await expect(canvas.queryByText("3")).toBeInTheDocument();
      await expect(canvas.queryByText("4")).toBeInTheDocument();
      await expect(canvas.queryByText("5")).toBeInTheDocument();
    });
    await step("Updates the navigation buttons after clicking next.", async () => {
      await expect(nextPageButton).not.toBeDisabled();
      await expect(prevPageButton).not.toBeDisabled();
    });

    // Test the "Back" button
    await step(`Clicks the previous page button and updates the "page" URL search parameter.`, async () => {
      await userEvent.click(prevPageButton);
      await expect(new URLSearchParams(location.search).get("page")).toBeNull();
    });
    await step("Updates the page buttons after clicking previous.", async () => {
      await expect(canvas.queryByText("1")).toBeInTheDocument();
      await expect(canvas.queryByText("2")).toBeInTheDocument();
      await expect(canvas.queryByText("3")).toBeInTheDocument();
      await expect(canvas.queryByText("4")).toBeInTheDocument();
      await expect(canvas.queryByText("5")).toBeInTheDocument();
    });
    await step("Updates the navigation buttons after clicking previous.", async () => {
      await expect(nextPageButton).not.toBeDisabled();
      await expect(prevPageButton).toBeDisabled();
    });
  },
};

export const BasicStyles: Story = {
  args: {
    totalCount: 5,
    pageSize: 1,
    style: {
      backgroundColor: "lightgrey",
      border: "2px solid var(--blue)",
      borderRadius: "12px",
      padding: "16px",
    },
  },
};

export const HiddenPages: Story = {
  args: {
    totalCount: 100,
    pageSize: 1,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(`Renders the correct number of page buttons including "Back", "Forward" and "...".`, async () => {
      await expect(canvas.queryAllByRole("listitem")).toHaveLength(9);
    });

    await step("Renders the correct visible and hidden page buttons.", async () => {
      if (Number(new URLSearchParams(location.search).get("page")) > 4) {
        await expect(canvas.queryAllByText("...")).toHaveLength(2);
      } else {
        await expect(canvas.queryByText("1")).toBeInTheDocument();
        await expect(canvas.queryByText("2")).toBeInTheDocument();
        await expect(canvas.queryByText("3")).toBeInTheDocument();
        await expect(canvas.queryByText("4")).toBeInTheDocument();
        await expect(canvas.queryByText("5")).toBeInTheDocument();
        await expect(canvas.queryByText("6")).not.toBeInTheDocument();
        await expect(canvas.queryByText("7")).not.toBeInTheDocument();
        await expect(canvas.queryByText("...")).toBeInTheDocument();
        await expect(canvas.queryByText("98")).not.toBeInTheDocument();
        await expect(canvas.queryByText("99")).not.toBeInTheDocument();
        await expect(canvas.queryByText("100")).toBeInTheDocument();
      }
    });
  },
};

export const HigherSiblingCount: Story = {
  args: {
    totalCount: 100,
    pageSize: 1,
    siblingCount: 2,
  },
};