import { ProjectByIdPage } from "@/components/projects/project-by-id.tsx";
import { useAuth } from "@/lib/client/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/projects/$projectId/")({
    component: ProjectById,
});

function ProjectById() {
    const { projectId } = Route.useParams();
    const { userId, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!userId || !projectId) {
        throw redirect({
            to: "/",
        });
    }

    return <ProjectByIdPage projectId={projectId} />;
}
