'use client';

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
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Database, FolderKanban, LayoutDashboard, LucideSparkle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { NavUser } from '@/components/layout/nav-user';
import { AuthService } from '@/lib/client/auth/auth-service';
import { User } from '@/schemas/user';
import Link from 'next/link';

// Menu items
const items = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Projects',
        url: '/projects',
        icon: FolderKanban,
    },
    {
        title: 'Catalogues',
        url: '/catalogues',
        icon: Database,
    },
];

interface AppSidebarProps {
    user: User;
}

export function AppSidebar({ user }: AppSidebarProps) {
    const currentPathname = usePathname();

    const handleSignOut = async () => {
        try {
            await AuthService.signOut();
            // Force a full page refresh to update server-side auth state
            window.location.href = '/';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <>
            <SidebarTrigger className="absolute end-4 top-4" />

            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/">
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
                                            isActive={currentPathname.startsWith(item.url)}
                                        >
                                            <Link href={item.url}>
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
                            name: user.displayName || user.email.split('@')[0] || 'User',
                            initials: user.displayName
                                ? user.displayName
                                      .split(' ')
                                      .map((name) => name[0])
                                      .join('')
                                      .toUpperCase()
                                : user.email.charAt(0).toUpperCase(),
                            email: user.email,
                            avatar: user.photoURL || '',
                            id: user.id,
                        }}
                    />
                </SidebarFooter>
            </Sidebar>
        </>
    );
}
