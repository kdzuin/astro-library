import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects_/new")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/projects_/new"!</div>;
}
