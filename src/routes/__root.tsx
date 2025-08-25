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
import { useUserSession } from "@/hooks/use-user-session";
import { authFn } from "@/lib/server/auth";
import type { AppUser } from "@/schemas/app-user";
import type { QueryClient } from "@tanstack/react-query";

export interface MyRouterContext {
	queryClient: QueryClient;
	auth: {
		currentUser?: AppUser | null;
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

	beforeLoad: async () => {
		const { currentUser } = await authFn();
		return {
			auth: {
				currentUser,
			},
		};
	},

	shellComponent: RootDocument,
});

function RootDocument() {
	const { auth } = Route.useRouteContext();
	useUserSession(auth.currentUser);

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
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
