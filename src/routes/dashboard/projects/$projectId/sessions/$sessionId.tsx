import { useAuth } from "@/lib/client/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/dashboard/projects/$projectId/sessions/$sessionId",
)({
    component: RouteComponent,
});

function RouteComponent() {
    const { userId, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!userId) {
        throw redirect({
            to: "/",
        });
    }

    return (
        <div>Hello "/dashboard/projects/$projectId/sessions/$sessionId"!</div>
    );
}
