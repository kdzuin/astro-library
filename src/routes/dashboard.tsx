import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserId } from "@/lib/server/auth-server-func";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
	component: DashboardPage,
	beforeLoad: async () => {
		const userId = await getUserId();
		return { userId };
	},
	loader: async ({ context }) => {
		if (!context.userId) {
			throw redirect({
				to: "/",
				search: { redirect: location.href },
			});
		}

		return { userId: context.userId };
	},
});

function DashboardPage() {
	const { userId } = Route.useLoaderData();
	return (
		<main className="w-full min-h-screen bg-brand-gradient text-white/80  px-4 sm:px-6 lg:px-8 py-10 space-y-4">
			<Button asChild variant="modest">
				<Link to="..">
					<ArrowLeft /> Go Back
				</Link>
			</Button>
			<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
				<div>Heatmap</div>
				<div>Projects</div>
			</div>
		</main>
	);
}
