import { ProjectList } from "@/components/dashboard/project-list";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/lib/server/auth-server-func";
import { getProjectsByUserId } from "@/lib/server/functions/projects";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowLeft, PlusIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
	component: DashboardPage,
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

		const projects = await getProjectsByUserId({
			data: context.userId,
		});

		return { userId: context.userId, projects };
	},
});

function DashboardPage() {
	const { projects } = Route.useLoaderData();

	return (
		<main className="w-full min-h-screen bg-brand-gradient text-white/80  px-4 sm:px-6 lg:px-8 py-10 space-y-4">
			<div className="flex items-center gap-4">
				<Button asChild variant="modest" size="icon">
					<Link to="..">
						<ArrowLeft />
					</Link>
				</Button>
				<div className="text-3xl md:text-4xl font-bold">Dashboard</div>
			</div>
			<div className="flex flex-wrap items-center gap-x-4 gap-y-1">
				<span className="text-xs font-bold">Quick Actions:</span>
				<Button asChild size="small">
					<Link to="/projects/new">
						<PlusIcon />
						New Project
					</Link>
				</Button>
			</div>
			<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				<div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
					<h2 className="text-2xl font-bold mb-4">Heatmap</h2>
				</div>
				<div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
					<ProjectList projects={projects || []} />
				</div>
			</div>
		</main>
	);
}
