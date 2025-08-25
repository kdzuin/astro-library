import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Link,
	createFileRoute,
	useRouter,
} from "@tanstack/react-router";
import React from "react";
import { z } from "zod";

import { signInWithGoogle, signOut } from "@/lib/client/auth";
import { getUserById } from "@/lib/server/functions/users";

const homeSearchSchema = z.object({
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/")({
	component: App,
	notFoundComponent: () => {
		return <p>This page doesn't exist!</p>;
	},
	validateSearch: homeSearchSchema,
	async beforeLoad() {},
	loader: async ({ context }) => {
		if (!context.auth.currentUser?.id) {
			return {
				currentUser: null,
			};
		}

		const uid = context.auth.currentUser.id;
		const appUser = await getUserById({ data: uid });

		return {
			currentUser: appUser,
		};
	},
});

function App() {
	const { currentUser } = Route.useLoaderData();
	const search = Route.useSearch();
	const router = useRouter();

	const handleSignOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		await signOut();
		window.location.reload();
	};

	const handleSignIn = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		signInWithGoogle();
	};

	// Handle redirect after login
	React.useEffect(() => {
		if (currentUser && search.redirect) {
			router.navigate({ to: search.redirect });
		}
	}, [currentUser, search.redirect, router]);

	if (!currentUser) {
		return (
			<div className="w-full min-h-screen flex items-center justify-center">
				<Button onClick={handleSignIn}>Sign in</Button>
			</div>
		);
	}

	return (
		<div className="w-full min-h-screen flex items-center justify-center">
			<div className="flex flex-col items-center space-y-6 p-8">
				{/* User Avatar */}
				<div className="flex flex-col items-center space-y-4">
					{currentUser?.photoURL ? (
						<Avatar className="w-20 h-20 rounded-full border-4 border-white shadow-lg">
							<AvatarImage
								src={currentUser.photoURL}
								alt={currentUser.displayName || currentUser.email}
							/>
							<AvatarFallback>
								{(currentUser?.displayName || currentUser?.email || "U")
									.charAt(0)
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>
					) : (
						<div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
							{(currentUser?.displayName || currentUser?.email || "U")
								.charAt(0)
								.toUpperCase()}
						</div>
					)}

					{/* Welcome Message */}
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900">
							Welcome back,{" "}
							{currentUser?.displayName || currentUser?.email?.split("@")[0]}!
						</h1>
						<p className="text-gray-600 mt-1">{currentUser?.email}</p>
					</div>
				</div>

				{/* Actions */}
				<div className="flex space-x-4">
					<Button variant="default" asChild>
						<Link to="/dashboard">Go to Dashboard</Link>
					</Button>
					<Button onClick={handleSignOut} variant="outline">
						Sign out
					</Button>
				</div>
			</div>
		</div>
	);
}
