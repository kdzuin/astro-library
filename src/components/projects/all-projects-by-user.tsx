import { ProjectList } from "@/components/molecules/project-list";
import { Button } from "@/components/ui/button.tsx";
import { useProjectsByUserQuery } from "@/hooks/use-projects-query.ts";
import type { UseQueryResult } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, LucidePlus } from "lucide-react";

function RefetchBlock({ query }: { query: UseQueryResult }) {
    return (
        <div>
            <p>
                Problem getting your data. Likely, it's the network connection.
            </p>
            <div>
                <Button type="button" onClick={() => query.refetch()}>
                    Try again
                </Button>
            </div>
        </div>
    );
}

export function AllProjectsByUserPage({ userId }: { userId: string }) {
    const projectsQuery = useProjectsByUserQuery(userId);

    return (
        <main className="w-full min-h-screen bg-brand-gradient text-white/80  px-4 sm:px-6 lg:px-8 py-10 space-y-4">
            <div className="flex items-center gap-4">
                <Button asChild>
                    <Link to="..">
                        <ArrowLeft />
                    </Link>
                </Button>
                <div className="text-3xl md:text-4xl font-bold">Projects</div>
            </div>
            <div className={"flex gap-2"}>
                <Button asChild size="small">
                    <Link to="/dashboard/projects/new">
                        <LucidePlus />
                        Add new project
                    </Link>
                </Button>
            </div>

            {projectsQuery.isPending ? <div>Loading...</div> : null}
            {projectsQuery.isError ? (
                <RefetchBlock query={projectsQuery} />
            ) : null}
            {projectsQuery.isSuccess ? (
                <ProjectList projects={projectsQuery.data.projects} />
            ) : null}
        </main>
    );
}
