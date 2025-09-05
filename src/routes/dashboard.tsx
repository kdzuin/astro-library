import { ChartExposurePerSession } from "@/components/features/charts/chart-exposure-per-session";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
	component: DashboardPage,
	beforeLoad: async ({ context, location }) => {
		if (!context.auth.currentUser) {
			throw redirect({
				to: "/",
				search: { redirect: location.href },
			});
		}
		return {};
	},
	loader: async ({ context }) => {
		// if (context.auth.currentUser?.id) {
		// 	const uid = context.auth.currentUser.id;
		// 	const appUser = await getUserById({ data: uid });

		// 	return {
		// 		currentUser: appUser,
		// 	};
		// }

		// const timeline: any[] = [
		// 	{
		// 		date: "2025-07-04",
		// 		filters: {
		// 			Ha: 10000,
		// 			OIII: 4000,
		// 		},
		// 	},
		// 	{
		// 		date: "2025-08-01",
		// 		filters: {
		// 			Ha: 2000,
		// 			OIII: 1600,
		// 		},
		// 	},
		// 	{
		// 		date: "2025-08-02",
		// 		filters: {
		// 			Ha: 6000,
		// 			OIII: 4800,
		// 		},
		// 	},
		// 	{
		// 		date: "2025-08-03",
		// 		filters: {
		// 			Ha: 4200,
		// 			OIII: 3000,
		// 		},
		// 	},
		// 	{ date: "2025-08-18", filters: { L: 10000 } },
		// ];

		const uid = context.auth.currentUser?.id;

		// let's get acquisitionDetails subcollection by userId
		const acquisitionDetails = await getAcquisitionDetailsByUserId({
			data: uid,
		});

		const timeline = [];

		return {
			timeline: timeline,
			filters: [],
			projects: [],
		};
	},
});

function DashboardPage() {
	const { timeline } = Route.useLoaderData();
	return (
		<main className="space-y-4">
			<PageHeader title="Dashboard" hasBackButton />
			<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
				<ChartExposurePerSession timeline={timeline} chartHeight="h-[20em]" />

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
