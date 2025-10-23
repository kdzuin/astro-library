import { DashboardPage } from "@/components/dashboard/page.tsx";
import { getUserId } from "@/lib/server/auth-server-func.ts";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	component: Dashboard,
	beforeLoad: async () => {
		const userId = await getUserId();
		return { userId };
	},
	loader: async ({ context }) => {
		if (!context.userId) {
			throw redirect({
				to: "/",
			});
		}

		return {
			userId: context.userId,
		};
	},
});

function Dashboard() {
	const { userId } = Route.useLoaderData();

	return <DashboardPage userId={userId} />;
}
