import { AllProjectsByUserPage } from "@/components/projects/all-projects-by-user.tsx";
import { useAuth } from "@/lib/client/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/projects/")({
    component: ProjectsPage,
});

function ProjectsPage() {
    const { userId, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!userId) {
        throw redirect({
            to: "/",
        });
    }

    return <AllProjectsByUserPage userId={userId} />;
}
