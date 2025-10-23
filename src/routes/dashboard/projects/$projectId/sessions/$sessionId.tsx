import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/dashboard/projects/$projectId/sessions/$sessionId",
)({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>Hello "/dashboard/projects/$projectId/sessions/$sessionId"!</div>
    );
}
