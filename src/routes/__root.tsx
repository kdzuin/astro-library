import { TanstackDevtools } from "@tanstack/react-devtools";
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
	useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import { AppSidebar } from "@/components/layout/app-sidebar";
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

function ConditionalLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = router.state.location.pathname;

	// Routes that should NOT have sidebar
	const publicRoutes = ["/", "/login"];
	const isPublicRoute = publicRoutes.includes(pathname);

	if (isPublicRoute) {
		return <div className="min-h-screen">{children}</div>;
	}

	// Routes that should have sidebar
	return (
		<AuthProvider>
			<div className="flex min-h-screen w-full">
				<main className="flex-1 w-full">{children}</main>
			</div>
		</AuthProvider>
	);
}

function RootDocument() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="dark">
				<ConditionalLayout>
					<Outlet />
				</ConditionalLayout>
				<Toaster />

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
