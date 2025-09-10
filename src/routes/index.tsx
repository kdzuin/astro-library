import { Button } from "@/components/ui/button";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { BarChart3, Camera, Database, Star, Telescope, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { signIn, signOut } from "@/lib/client/auth-client";
import { getUserInfo } from "@/lib/server/auth-server-func";
import { cn } from "@/lib/utils";

const homeSearchSchema = z.object({
	redirect: z.string().optional(),
});

// Feature Icon Component
interface FeatureIconProps {
	icon: LucideIcon;
	gradientClass: string;
}

function FeatureIcon({ icon: Icon, gradientClass }: FeatureIconProps) {
	return (
		<div className={`w-12 h-12 ${gradientClass} rounded-lg flex items-center justify-center mb-4`}>
			<Icon className="h-6 w-6 text-white" />
		</div>
	);
}

// Feature Card Component
interface FeatureCardProps {
	icon: LucideIcon;
	gradientClass: string;
	title: string;
	description: string;
}

function FeatureCard({ icon, gradientClass, title, description }: FeatureCardProps) {
	return (
		<div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
			<FeatureIcon icon={icon} gradientClass={gradientClass} />
			<h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
			<p className="text-white/70">{description}</p>
		</div>
	);
}

// Feature data
const features = [
	{
		icon: Telescope,
		gradientClass: "bg-gradient-blue-purple",
		title: "Project Management",
		description: "Organize your astrophotography projects with detailed planning, target tracking, and progress monitoring."
	},
	{
		icon: Camera,
		gradientClass: "bg-gradient-purple-pink",
		title: "Session Tracking",
		description: "Log imaging sessions with detailed acquisition data, weather conditions, and equipment settings."
	},
	{
		icon: Database,
		gradientClass: "bg-gradient-green-blue",
		title: "Equipment Library",
		description: "Maintain a comprehensive database of your telescopes, cameras, filters, and accessories."
	},
	{
		icon: BarChart3,
		gradientClass: "bg-gradient-yellow-orange",
		title: "Analytics & Insights",
		description: "Analyze your imaging performance with detailed statistics and progress tracking over time."
	}
];

export const Route = createFileRoute("/")({
	component: LandingPage,
	notFoundComponent: () => {
		return <p>This page doesn't exist!</p>;
	},
	validateSearch: homeSearchSchema,
	async beforeLoad() {
		const currentUser = await getUserInfo();
		return { currentUser };
	},
	loader: async ({ context }) => {
		return {
			currentUserName: context.currentUser?.name,
			currentUserId: context.currentUser?.id,
		};
	},
});

function LandingPage() {
	const { currentUserName, currentUserId } = Route.useLoaderData();
	const [isAuthPending, setIsAuthPending] = useState(false);
	const search = Route.useSearch();
	const router = useRouter();

	const handleSignOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setIsAuthPending(true);
		await signOut();
		window.location.reload();
	};

	const handleSignIn = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setIsAuthPending(true);
		signIn.social({
			provider: "google",
			callbackURL: "/welcome",
			newUserCallbackURL: "/welcome",
		});
	};

	// Handle redirect after login
	useEffect(() => {
		if (currentUserId && search.redirect) {
			router.navigate({ to: search.redirect });
		}
	}, [currentUserId, search.redirect, router]);

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

					{/* Conditional CTAs based on auth status */}
					<div className="flex flex-wrap gap-4 justify-center">
						{currentUserId ? (
							// Authenticated user CTAs
							<>
								<Button asChild variant="accent">
									<Link to="/welcome">Continue as {currentUserName}</Link>
								</Button>
								<Button onClick={handleSignOut} disabled={isAuthPending}>
									Logout
								</Button>
							</>
						) : (
							// Anonymous user CTA
							<Button onClick={handleSignIn} disabled={isAuthPending}>
								Continue with Google
							</Button>
						)}
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
