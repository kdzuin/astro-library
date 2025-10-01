import { Button } from "@/components/ui/button.tsx";
import { useProjectsByUserQuery } from "@/hooks/use-projects-query.ts";
import { getUserId } from "@/lib/server/auth-server-func.ts";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

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
			})
		}

		return {
			userId: context.userId,
		}
	},
});

function ProjectsPage() {
	const { userId } = Route.useLoaderData();
	const { data } = useProjectsByUserQuery(userId);

	return (
		<main className="w-full min-h-screen bg-brand-gradient text-white/80  px-4 sm:px-6 lg:px-8 py-10 space-y-4">
			<div className="flex items-center gap-4">
				<Button asChild variant="modest">
					<Link to="..">
						<ArrowLeft /> Go Back
					</Link>
				</Button>
				<div className="text-3xl md:text-4xl font-bold">Projects</div>
			</div>
			<div className="">
				{data?.projects.map((project) => (
					<div key={project.id}>
						<Link
							to="/dashboard/projects/$projectId"
							params={{ projectId: project.id }}
						>
							{project.name}
						</Link>
					</div>
				))}
			</div>
		</main>
	)
}
