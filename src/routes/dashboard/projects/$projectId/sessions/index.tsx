import { AllSessionsByProjectPage } from "@/components/sessions/all-sessions-by-project.tsx";
import { getUserId } from "@/lib/server/auth-server-func.ts";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/dashboard/projects/$projectId/sessions/",
)({
	component: SessionsPage,
	beforeLoad: async ({ params }) => {
		const userId = await getUserId();
		return { userId, projectId: params.projectId };
	},
	loader: async ({ context }) => {
		if (!context.userId) {
			throw redirect({
				to: "/",
			});
		}

		return {
			userId: context.userId,
			projectId: context.projectId,
		};
	},
});

function SessionsPage() {
	const { projectId } = Route.useLoaderData();

	return <AllSessionsByProjectPage projectId={projectId} />;
}
