'use client';

import { clearExpiredSessionAction } from '@/lib/server/actions/auth';

/**
 * Client-side session management utilities
 * Handles expired sessions and cookie cleanup
 */

/**
 * Clear expired session cookie via API call
 * This is needed because cookie modifications can only happen in Route Handlers
 */
export async function clearExpiredSession(): Promise<boolean> {
    try {
        const result = await clearExpiredSessionAction();

        if (result.success) {
            console.log('Expired session cleared successfully');
            return true;
        } else {
            console.error('Failed to clear expired session:', result.error);
            return false;
        }
    } catch (error) {
        console.error('Error clearing expired session:', error);
        return false;
    }
}

/**
 * Handle session expiration by clearing cookie and optionally redirecting
 */
export async function handleSessionExpiration(redirectToLogin = true): Promise<void> {
    await clearExpiredSession();

    if (redirectToLogin && typeof window !== 'undefined') {
        // Redirect to login page
        window.location.href = '/';
    }
}

/**
 * Check if current page requires authentication
 */
export function isAuthRequiredPage(): boolean {
    if (typeof window === 'undefined') return false;

    const authRequiredPaths = ['/dashboard', '/projects', '/equipment'];
    return authRequiredPaths.some((path) => window.location.pathname.startsWith(path));
}
