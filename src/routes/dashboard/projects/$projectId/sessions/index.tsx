import { AllSessionsByProjectPage } from "@/components/sessions/all-sessions-by-project.tsx";
import { useAuth } from "@/lib/client/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/dashboard/projects/$projectId/sessions/",
)({
    component: SessionsPage,
});

function SessionsPage() {
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

    return <AllSessionsByProjectPage projectId={projectId} />;
}
