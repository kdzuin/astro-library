import { ProjectsList } from "@/components/projects/projects-list";
import { Button } from "@/components/ui/button";
import { useProjectsByUserQuery } from "@/hooks/use-projects-query";
import { getUserId } from "@/lib/server/auth-server-func";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/projects")({
	component: ProjectsPage,
	beforeLoad: async () => {
		const userId = await getUserId();
		return { userId };
	},
	loader: async ({ context }) => {
		if (!context.userId) {
			throw redirect({
				to: "/",
				search: { redirect: location.href },
			});
		}

		return {
			userId: context.userId,
		};
	},
});

function ProjectsPage() {
	const { userId } = Route.useLoaderData();

	const { data: projects } = useProjectsByUserQuery(userId);

	return (
		<main className="space-y-4">
			<div className="">
				{projects?.map((project) => (
					<div key={project.id}>{project.name}</div>
				))}
			</div>
		</main>
	);
}
