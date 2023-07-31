import type { Meta, StoryObj } from "@storybook/react";
import RadioChip from "./RadioChip";

const meta: Meta<typeof RadioChip> = {
  component: RadioChip,
};

export default meta;
type Story = StoryObj<typeof RadioChip>;

export const Regular: Story = {
  args: {
    label: "Basic",
    isChecked: false,
  }
};