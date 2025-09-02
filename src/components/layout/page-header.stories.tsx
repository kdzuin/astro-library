import { withSbSidebarProvider } from "@/../.storybook/preview";
import { Button } from "@/components/ui/button";
import type { StoryObj } from "@storybook/react-vite";
import { PageHeader } from "./page-header";

export default {
	title: "Layout/PageHeader",
	component: PageHeader,
	tags: ["autodocs"],
	decorators: [withSbSidebarProvider],
};

export const Primary: StoryObj<typeof PageHeader> = {
	args: {
		title: "Page Header",
		hasBackButton: true,
	},
};

export const WithActions: StoryObj<typeof PageHeader> = {
	args: {
		title: "Page Header",
		hasBackButton: true,
		actions: <Button>Button</Button>,
	},
};
