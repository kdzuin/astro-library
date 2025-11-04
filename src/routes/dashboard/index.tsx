import { DashboardPage } from "@/components/dashboard/page.tsx";
import { useAuth } from "@/lib/client/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
    component: Dashboard,
});

function Dashboard() {
    const { userId, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!userId) {
        throw redirect({
            to: "/",
        });
    }

    return <DashboardPage userId={userId} />;
}
