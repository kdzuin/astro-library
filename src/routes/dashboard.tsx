import { PageHeader } from "@/components/layout/page-header";
import { getUserById } from "@/lib/server/functions/users";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async ({ context, location }) => {
		if (!context.auth.currentUser) {
			throw redirect({
				to: "/",
				search: { redirect: location.href },
			});
		}
		return {};
	},
	loader: async ({ context }) => {
		if (context.auth.currentUser?.id) {
			const uid = context.auth.currentUser.id;
			const appUser = await getUserById({ data: uid });

			return {
				currentUser: appUser,
			};
		}

		return {};
	},
});

function RouteComponent() {
	// const { currentUser } = Route.useLoaderData();

	return (
		<main>
			<PageHeader title="Dashboard" hasBackButton />
		</main>
	);
}
