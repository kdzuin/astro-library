/**
 * This file is required by Next.js for the root route ('/') to exist.
 * It's intentionally minimal because AuthLayout handles:
 * - Showing the sign-in form for unauthenticated users
 * - Redirecting authenticated users to the dashboard
 * - Showing a loading state while authentication is being determined
 */
export default function Home() {
    return null;
}
