import type { Meta, StoryObj } from "@storybook/react";
import PasswordInput from "./PasswordInput";

const meta: Meta<typeof PasswordInput> = {
  component: PasswordInput,
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const MediumSize: Story = {
  args: {
    size: "medium",
    placeholder: "Enter your password",
  }
};

export const SmallSize: Story = {
  args: {
    size: "small",
    placeholder: "Enter your password",
  }
};