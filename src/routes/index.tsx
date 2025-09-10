import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Camera, Database, Telescope } from "lucide-react";

import { AuthCTA } from "@/components/landing/auth-cta";
import { FeatureCard } from "@/components/landing/feature-card";
import { getUserInfo } from "@/lib/server/auth-server-func";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
	component: LandingPage,
	notFoundComponent: () => {
		return <p>This page doesn't exist!</p>;
	},
	loader: async () => {
		return {
			currentUser: await getUserInfo(),
		};
	},
});

// Feature data
const features = [
	{
		icon: Telescope,
		gradientClass: "bg-gradient-blue-purple",
		title: "Project Management",
		description:
			"Organize your astrophotography projects with detailed planning, target tracking, and progress monitoring.",
	},
	{
		icon: Camera,
		gradientClass: "bg-gradient-purple-pink",
		title: "Session Tracking",
		description:
			"Log imaging sessions with detailed acquisition data, weather conditions, and equipment settings.",
	},
	{
		icon: Database,
		gradientClass: "bg-gradient-green-blue",
		title: "Equipment Library",
		description:
			"Maintain a comprehensive database of your telescopes, cameras, filters, and accessories.",
	},
	{
		icon: BarChart3,
		gradientClass: "bg-gradient-yellow-orange",
		title: "Analytics & Insights",
		description:
			"Analyze your imaging performance with detailed statistics and progress tracking over time.",
	},
];

function LandingPage() {
	const { currentUser } = Route.useLoaderData();

	return (
		<main className="min-h-screen w-full bg-brand-gradient">
			{/* Hero Section */}
			<div className="relative overflow-hidden">
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
					<h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
						Astro
						<span className="bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent">
							Library
						</span>
					</h1>

					<p className="text-xl md:text-2xl leading-tight text-white/80 mb-8 max-w-3xl mx-auto">
						The complete open-source platform for astro-photographers to manage
						projects, track imaging sessions, organize equipment and know your
						results in numbers with precision and ease.
					</p>

					<div
						className={cn(
							"flex flex-wrap gap-4 justify-center ",
							"starting:opacity-0",
						)}
					>
						<AuthCTA isLoggedIn={!!currentUser} />
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Everything you need for astrophotography
					</h2>
					<p className="text-xl text-white/80 max-w-3xl mx-auto leading-tight">
						From planning sessions to analyzing results, manage every aspect of
						your celestial photography workflow.
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-6 mx-auto max-w-4xl">
					{features.map((feature) => (
						<FeatureCard
							key={feature.title}
							icon={feature.icon}
							gradientClass={feature.gradientClass}
							title={feature.title}
							description={feature.description}
						/>
					))}
				</div>
			</div>
		</main>
	);
}
