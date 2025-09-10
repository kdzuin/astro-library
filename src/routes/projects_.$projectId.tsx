import { Button } from "@/components/ui/button";
import { getProjectById } from "@/lib/server/functions/projects";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/projects_/$projectId")({
	component: RouteComponent,
	beforeLoad: async ({ params }) => {
		const projectData = await getProjectById({
			data: params.projectId,
		});
		return { projectId: params.projectId, projectData };
	},
	loader: async ({ context }) => {
		return {
			projectId: context.projectId,
			projectData: context.projectData,
		};
	},
});

function RouteComponent() {
	const { projectId, projectData } = Route.useLoaderData();

	return (
		<main className="w-full min-h-screen bg-brand-gradient text-white/80  px-4 sm:px-6 lg:px-8 py-10 space-y-4">
			<div className="flex items-center gap-4">
				<Button asChild variant="modest">
					<Link to="..">
						<ArrowLeft /> Go Back
					</Link>
				</Button>
				<div className="text-3xl md:text-4xl font-bold">
					{projectData?.name}
				</div>
			</div>
			<h2>Project</h2>
			<div>{projectId}</div>
			<div>
				<pre>{JSON.stringify(projectData, null, 2)}</pre>
			</div>
		</main>
	);
}
