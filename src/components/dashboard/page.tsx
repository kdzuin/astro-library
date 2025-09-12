import { HeatMap } from "@/components/dashboard/heat-map";
import { ProjectList } from "@/components/dashboard/project-list";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/schemas/project";
import { ClientOnly, Link } from "@tanstack/react-router";
import { LucideArrowLeft, LucidePlus, LucideSearch } from "lucide-react";

interface DashboardPageProps {
	projects?: Project[];
	isLoading?: boolean;
}

export function DashboardPage({ projects, isLoading }: DashboardPageProps) {
	return (
		<main className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-4">
			<div className="flex items-center gap-4">
				<Button asChild variant="modest" size="icon">
					<Link to="..">
						<LucideArrowLeft />
					</Link>
				</Button>
				<div className="text-3xl md:text-4xl font-bold">Dashboard</div>
			</div>
			{/* <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
				<span className="text-xs font-bold">Quick Actions:</span>
				<Button asChild size="small">
					<Link to="/projects/new">
						<PlusIcon />
						New Project
					</Link>
				</Button>
			</div> */}

			{isLoading && !projects?.length ? (
				<div className="flex justify-start py-12 text-2xl text-white/50">
					Loading...
				</div>
			) : null}

			<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Heatmap</CardTitle>
						<CardDescription>
							Heatmap for the last 26 weeks in total exposure time per calendar
							day.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ClientOnly
							fallback={
								<div className="w-full h-full bg-slate-50/5 animate-pulse rounded-md" />
							}
						>
							<HeatMap
								data={[
									{ date: "2025-08-04", value: 4 },
									{ date: "2025-08-05", value: 100 },
									{ date: "2025-09-01", value: 200 },
									{ date: "2025-09-12", value: 100 },
								]}
								numberOfWeeks={26}
							/>
						</ClientOnly>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Last Projects</CardTitle>
						<CardDescription>
							Your most recently updated astrophotography projects.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ProjectList projects={projects || []} />
					</CardContent>
					<CardFooter className="border-t flex gap-2">
						<Button asChild size="small">
							<Link to="/projects">
								<LucideSearch />
								Open all projects
							</Link>
						</Button>
						<Button asChild size="small">
							<Link to="/projects/new">
								<LucidePlus />
								Add new project
							</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
		</main>
	);
}
