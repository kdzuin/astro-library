import { SignIn } from '@/components/features/auth/sign-in';
export const dynamic = 'force-dynamic';

/**
 * This file is required by Next.js for the root route ('/') to exist.
 * It's intentionally minimal because AuthLayout handles:
 * - Showing the sign-in form for unauthenticated users
 * - Redirecting authenticated users to the dashboard
 * - Showing a loading state while authentication is being determined
 */
export default function Home() {
    return (
        <div className="flex min-h-screen w-full">
            <main className="flex-1 w-full px-6 py-4 pe-15 flex items-center justify-center">
                <SignIn />
            </main>
        </div>
    );
}
