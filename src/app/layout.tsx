import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';

import { AuthProvider } from '@/lib/auth/auth-context';
import { AuthGuard } from '@/components/layout/auth-guard';
import { Toaster } from '@/components/ui/sonner';

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
    const cookieStore = await cookies();
    const sidebarInitialState = cookieStore.get('sidebar_state')?.value === 'true';

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <AuthProvider>
                    <AuthGuard sidebarInitialState={sidebarInitialState}>
                        {children}
                        {modal}
                        <Toaster />
                    </AuthGuard>
                </AuthProvider>
            </body>
        </html>
    );
}
