import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { getCurrentUser } from '@/lib/server/auth/utils';

import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Astro Library',
    description: 'A library management system for astronomers',
};

export default async function RootLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {user ? (
                    // Authenticated layout with sidebar
                    <SidebarProvider defaultOpen={true}>
                        <div className="flex min-h-screen w-full">
                            <AppSidebar user={user} />
                            <main className="flex-1 w-full px-6 py-4 pe-15">
                                {children}
                                {modal}
                            </main>
                        </div>
                        <Toaster />
                    </SidebarProvider>
                ) : (
                    // Unauthenticated layout (simple)
                    <>
                        {children}
                        {modal}
                        <Toaster />
                    </>
                )}
            </body>
        </html>
    );
}
