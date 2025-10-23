import { Button } from "@/components/ui/button.tsx";
import { useProjectByIdQuery } from "@/hooks/use-projects-query.ts";
import { useSessionsByProjectQuery } from "@/hooks/use-sessions-query.ts";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function ProjectByIdPage({ projectId }: { projectId: string }) {
    const { data: projectData } = useProjectByIdQuery(projectId);
    const { data: projectSessions } = useSessionsByProjectQuery(projectId);

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
                Project Data:
                <pre>{JSON.stringify(projectData, null, 2)}</pre>
            </div>
            <div>
                <Link
                    to={"/dashboard/projects/$projectId/sessions"}
                    params={{
                        projectId,
                    }}
                >
                    Sessions:
                </Link>
                <pre>{JSON.stringify(projectSessions, null, 2)}</pre>
            </div>
        </main>
    );
}
