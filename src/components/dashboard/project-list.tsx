import { Badge } from "@/components/ui/badge";
import type { Project } from "@/schemas/project";
import { Link } from "@tanstack/react-router";

interface ProjectList {
	projects: Project[];
}

export function ProjectList({ projects }: ProjectList) {
	return (
		<ul className="flex flex-wrap gap-x-1.5 gap-y-1">
			{projects.map((project) => (
				<li key={project.id}>
					<Badge asChild>
						<Link
							to={"/projects/$projectId"}
							params={{ projectId: project.id }}
						>
							{project.name}
						</Link>
					</Badge>
				</li>
			))}
		</ul>
	);
}
