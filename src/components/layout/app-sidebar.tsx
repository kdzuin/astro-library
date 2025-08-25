"use client";

import { NavUser } from "@/components/layout/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FolderKanban, LayoutDashboard, LucideSparkle } from "lucide-react";

import { signOut } from "@/lib/client/auth";
import { Link, useMatchRoute, useRouteContext } from "@tanstack/react-router";

// Menu items
const items = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Projects",
		url: "/projects",
		icon: FolderKanban,
	},
];

export function AppSidebar() {
	const { auth } = useRouteContext({ from: "__root__" });
	const currentUser = auth.currentUser;
	const matchRoute = useMatchRoute();

	const handleSignOut = async () => {
		signOut();
	};

	const isActiveRoute = (itemUrl: string) => {
		return !!matchRoute({ to: itemUrl, fuzzy: true });
	};

	if (!currentUser) {
		return null;
	}

	return (
		<>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link to="/">
									<LucideSparkle />
									<span className="text-lg font-semibold">Astro Library</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Navigation</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={isActiveRoute(item.url)}
										>
											<Link to={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<NavUser
						handleSignOut={handleSignOut}
						user={{
							name:
								currentUser.displayName ||
								currentUser.email?.split("@")[0] ||
								"User",
							initials: currentUser.displayName
								? currentUser.displayName
										.split(" ")
										.map((name) => name[0])
										.join("")
										.toUpperCase()
								: currentUser.email?.charAt(0).toUpperCase() || "",
							email: currentUser.email || "",
							avatar: currentUser.photoURL || "",
							id: currentUser.id || "",
						}}
					/>
				</SidebarFooter>
			</Sidebar>
		</>
	);
}
