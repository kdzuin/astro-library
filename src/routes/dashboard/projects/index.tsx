import { AllProjectsByUserPage } from "@/components/projects/all-projects-by-user.tsx";
import { getUserId } from "@/lib/server/auth-server-func.ts";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/projects/")({
	component: ProjectsPage,
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

function ProjectsPage() {
	const { userId } = Route.useLoaderData();

	return <AllProjectsByUserPage userId={userId} />;
}
