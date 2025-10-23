import { Button } from "@/components/ui/button.tsx";
import { useProjectsByUserQuery } from "@/hooks/use-projects-query.ts";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, LucidePlus } from "lucide-react";

export function AllProjectsByUserPage({ userId }: { userId: string }) {
    const projectsQuery = useProjectsByUserQuery(userId);

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
                <div>
                    Problem getting your projects. Likely, it's the network
                    connection. Please{" "}
                    <button
                        type="button"
                        className="underline cursor-pointer"
                        onClick={() => projectsQuery.refetch()}
                    >
                        try again
                    </button>
                    .
                </div>
            ) : null}
            {projectsQuery.isSuccess ? (
                <div className="">
                    {projectsQuery.data.projects.map((project) => (
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
            ) : null}
        </main>
    );
}
