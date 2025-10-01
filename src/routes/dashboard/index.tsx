import { DashboardPage } from "@/components/dashboard/page.tsx";
import { getUserId } from "@/lib/server/auth-server-func.ts";
import { getProjectsByUserId } from "@/lib/server/functions/projects.ts";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	component: Dashboard,
	pendingComponent: (props) => <DashboardPage {...props} isLoading />,
	beforeLoad: async () => {
		const userId = await getUserId();
		return { userId };
	},
	loader: async ({ context }) => {
		if (!context.userId) {
			throw redirect({
				to: "/",
			})
		}

		const result = await getProjectsByUserId({
			data: {
				userId: context.userId,
				limit: 5,
				order: "updated",
				direction: "desc",
			},
		})

		return {
			userId: context.userId,
			projects: result.projects,
			nextCursor: result.nextCursor,
		}
	},
});

function Dashboard() {
	const { projects } = Route.useLoaderData();

	return <DashboardPage projects={projects} />;
}
