import type { Meta, StoryObj } from "@storybook/react-vite";
import { EntryWithScale } from "./entry-with-scale";

const meta = {
    title: "Molecules/Entry With Scale",
    component: EntryWithScale,
    parameters: {
        layout: "padded",
    },
} satisfies Meta<typeof EntryWithScale>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: "Item",
    },
};
