import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserId } from "@/lib/auth-server-func";
import { getAcquisitionDetailsByUserId } from "@/lib/server/functions/acquisitionDetails";
import { createFileRoute, redirect } from "@tanstack/react-router";

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
		<main className="space-y-4">
			<PageHeader title={`Dashboard ${userId}`} hasBackButton />
			<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Calendar Heatmap</CardTitle>
					</CardHeader>
					<CardContent>heatmap</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Projects</CardTitle>
					</CardHeader>
					<CardContent>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
						mollitia commodi veniam nihil? Ullam, nulla! Ad porro illo adipisci
						iste?
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
