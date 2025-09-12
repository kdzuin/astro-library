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

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/client/auth-client";
import type { QueryClient } from "@tanstack/react-query";
import type { User } from "better-auth";

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
	return (
		<html lang="en">
			<head>
				<HeadContent />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, viewport-fit=cover"
				/>
			</head>
			<body className="dark">
				<AuthProvider>
					<div className="flex min-h-screen w-full">
						<main className="flex-1 w-full">
							<Outlet />
						</main>
					</div>
					<Toaster />
				</AuthProvider>

				{import.meta.env.DEV && (
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
				)}
				<Scripts />
			</body>
		</html>
	);
}
