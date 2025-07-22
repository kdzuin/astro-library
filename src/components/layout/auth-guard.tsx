'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { SignIn } from '@/components/features/auth/sign-in';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';

interface AuthLayoutProps {
    children: React.ReactNode;
    sidebarInitialState?: boolean;
}

export function AuthGuard({ children, sidebarInitialState }: AuthLayoutProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Handle authentication redirects
    useEffect(() => {
        // Redirect authenticated users on the home page to dashboard
        if (user && !loading && pathname === '/') {
            router.push('/dashboard');
            return;
        }

        // Protect dashboard routes
        if (!user && !loading && pathname.startsWith('/dashboard')) {
            router.push('/');
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <SignIn />
            </div>
        );
    }

    return (
        <SidebarProvider defaultOpen={sidebarInitialState}>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 w-full px-6 py-4">{children}</main>
            </div>
        </SidebarProvider>
    );
}
