import { EntrySimple } from "@/components/molecules/entry-simple";
import { EntryWithScale } from "@/components/molecules/entry-with-scale";
import type { Project } from "@/schemas/project";
import { Link } from "@tanstack/react-router";

interface ProjectList {
    projects: Project[];
    variant?: "simple" | "detailed";
}

export function ProjectList({ projects, variant }: ProjectList) {
    if (variant === "simple") {
        return (
            <ul className="flex gap-2 flex-wrap">
                {projects.map((item) => (
                    <Link
                        to="/dashboard/projects/$projectId"
                        params={{ projectId: item.id }}
                        key={item.id}
                    >
                        <EntrySimple title={item.name} />
                    </Link>
                ))}
            </ul>
        );
    }

    return (
        <ul className="grid auto-rows-auto gap-4 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
            {projects.map((item) => (
                <Link
                    to="/dashboard/projects/$projectId"
                    params={{ projectId: item.id }}
                    key={item.id}
                >
                    <EntryWithScale title={item.name} />
                </Link>
            ))}
        </ul>
    );
}
