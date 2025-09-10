import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Link,
	createFileRoute,
	redirect,
	useRouter,
} from "@tanstack/react-router";
import React, { useState } from "react";
import { z } from "zod";

import { signOut } from "@/lib/client/auth-client";
import { getUserId, getUserInfo } from "@/lib/server/auth-server-func";

const welcomeSearchSchema = z.object({
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/welcome")({
	component: WelcomePage,
	notFoundComponent: () => {
		return <p>This page doesn't exist!</p>;
	},
	validateSearch: welcomeSearchSchema,
	beforeLoad: async () => {
		const currentUserId = await getUserId();
		if (!currentUserId) {
			throw redirect({
				to: "/",
			});
		}
	},
	loader: async () => {
		const currentUser = await getUserInfo();
		return {
			userId: currentUser?.id,
			currentUser: currentUser,
		};
	},
});

function WelcomePage() {
	const { currentUser } = Route.useLoaderData();
	const [isAuthPending, setIsAuthPending] = useState(false);

	const handleSignOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setIsAuthPending(true);
		await signOut();
		window.location.reload();
	};

	return (
		<main className="w-full min-h-screen flex items-center justify-center bg-brand-gradient text-white/80">
			<div className="flex flex-col items-center space-y-6 p-8">
				{/* User Avatar */}
				<div className="flex flex-col items-center space-y-4">
					{currentUser?.image ? (
						<Avatar className="w-32 h-32 rounded-full border-4 border-white/20 shadow-lg">
							<AvatarImage
								src={currentUser.image}
								alt={currentUser.name || currentUser.email}
							/>
							<AvatarFallback>
								{(currentUser?.name || currentUser?.email || "U")
									.charAt(0)
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>
					) : (
						<div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
							{(currentUser?.name || currentUser?.email || "U")
								.charAt(0)
								.toUpperCase()}
						</div>
					)}

					{/* Welcome Message */}
					<div className="text-center">
						<h1 className="text-2xl font-bold">
							Welcome back,{" "}
							{currentUser?.name || currentUser?.email?.split("@")[0]}!
						</h1>
						<p className="text-white/50 mt-1">{currentUser?.email}</p>
					</div>
				</div>

				{/* Actions */}
				<div className="flex space-x-4">
					<Button variant="accent" asChild>
						<Link to="/dashboard">Go to Dashboard</Link>
					</Button>
					<Button
						variant="default"
						onClick={handleSignOut}
						disabled={isAuthPending}
					>
						Sign out
					</Button>
				</div>
			</div>
		</main>
	);
}
