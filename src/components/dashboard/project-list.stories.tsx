import { ProjectList } from "@/components/dashboard/project-list";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Dashboard/Project List",
	component: ProjectList,
	parameters: {
		layout: "padded",
	},
} satisfies Meta<typeof ProjectList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		projects: [
			{
				id: "1",
				userId: "1",
				name: "Project 1",
				status: "planning",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		],
	},
};
