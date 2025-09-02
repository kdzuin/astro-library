import { withSbSidebarProvider } from "@/../.storybook/preview";
import { NavUser } from "./nav-user";

export default {
	title: "Layout/NavUser",
	component: NavUser,
	tags: ["autodocs"],
	decorators: [withSbSidebarProvider],
};

export const Primary = {
	args: {
		user: {
			name: "John Doe",
			initials: "JD",
			email: "john.doe@example.com",
			avatar: "https://via.placeholder.com/150",
			id: "1",
		},
		handleSignOut: () => {},
	},
};
