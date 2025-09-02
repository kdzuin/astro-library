import { withSbSidebarProvider } from "@/../.storybook/preview";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppSidebar } from "./app-sidebar";

export default {
	title: "Layout/App Sidebar",
	component: AppSidebar,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	decorators: [withSbSidebarProvider],
} as Meta<typeof AppSidebar>;

export const WithAuthenticatedUser: StoryObj<typeof AppSidebar> = {
	parameters: {
		// Override the default context for this story
		routerContext: {
			auth: {
				currentUser: {
					uid: "user-123",
					email: "john.doe@example.com",
					displayName: "John Doe",
					photoURL: "https://example.com/avatar.jpg",
				},
			},
		},
	},
};

export const WithoutUser: StoryObj<typeof AppSidebar> = {
	parameters: {
		routerContext: {
			auth: {
				currentUser: null,
			},
		},
	},
};
