import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AuthProvider } from '@/lib/client/auth/auth-context';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <AuthProvider>
                    <SidebarProvider defaultOpen={true}>
                        <div className="flex min-h-screen w-full">
                            <AppSidebar />
                            <SidebarInset>
                                <main className="flex-1 w-full px-6 py-4 pe-15">{children}</main>
                            </SidebarInset>
                        </div>
                        <Toaster />
                    </SidebarProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
