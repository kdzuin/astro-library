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
import { FolderKanban, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/client/auth/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/client/firebase/config';
import { usePathname, useRouter } from 'next/navigation';
import { NavUser } from '@/components/layout/nav-user';
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
    // {
    //     title: 'Sources',
    //     url: '/sources',
    //     icon: Database,
    // },
    // {
    //     title: 'Sessions',
    //     url: '/sessions',
    //     icon: Calendar,
    // },
];

export function AppSidebar() {
    const { user } = useAuth();
    const router = useRouter();
    const currentPathname = usePathname();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <>
            <SidebarTrigger className="absolute end-4 top-4" />

            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center px-2">
                        <div className="text-lg font-semibold">Astro Library</div>
                    </div>
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
                            name: user?.displayName || '',
                            initials:
                                user?.displayName
                                    ?.split(' ')
                                    .map((name) => name[0])
                                    .join('') || '',
                            email: user?.email || '',
                            avatar: user?.photoURL || '',
                            id: user?.id || '',
                        }}
                    />
                </SidebarFooter>
            </Sidebar>
        </>
    );
}
