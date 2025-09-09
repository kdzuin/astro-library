import { TanstackDevtools } from "@tanstack/react-devtools";
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useSession } from "@/lib/auth-client";
import type { QueryClient } from "@tanstack/react-query";
import type { User } from "better-auth";
import { useEffect, useState } from "react";

export interface MyRouterContext {
	queryClient: QueryClient;
	auth: {
		currentUser?: User | null;
		userId?: User["id"] | null;
	};
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Astro Library",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	notFoundComponent: () => {
		return <p>This page doesn't exist!</p>;
	},
	shellComponent: RootDocument,
});

function RootDocument() {
	const [currentUser, setUser] = useState<User | null>(null);
	const session = useSession();

	useEffect(() => {
		setUser(session?.data?.user ?? null);
	}, [session]);

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<AuthProvider
					value={{
						currentUser,
						userId: session?.data?.user?.id,
					}}
				>
					<SidebarProvider defaultOpen={true}>
						<div className="flex min-h-screen w-full">
							<AppSidebar />
							<SidebarInset>
								<main className="flex-1 w-full px-6 py-4 pe-15">
									<Outlet />
								</main>
							</SidebarInset>
						</div>
						<Toaster />
					</SidebarProvider>
				</AuthProvider>

				<TanstackDevtools
					config={{
						position: "bottom-left",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
