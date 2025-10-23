import { ProjectByIdPage } from "@/components/projects/project-by-id.tsx";
import { getUserId } from "@/lib/server/auth-server-func.ts";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/projects/$projectId/")({
	component: ProjectById,
	beforeLoad: async ({ params }) => {
		const userId = await getUserId();
		return { projectId: params.projectId, userId };
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

function ProjectById() {
	const { projectId } = Route.useLoaderData();

	return <ProjectByIdPage projectId={projectId} />;
}
