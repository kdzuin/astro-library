'use server';

import { createSessionCookie, setSessionCookie, clearSessionCookie } from '@/lib/server/auth/utils';

/**
 * Server action to create a session cookie from Firebase ID token
 * Replaces POST /api/auth/login
 */
export async function loginAction(idToken: string) {
    try {
        if (!idToken) {
            return { success: false, error: 'ID token is required' };
        }

        // Create and set session cookie
        const sessionCookie = await createSessionCookie(idToken);
        await setSessionCookie(sessionCookie);

        return { success: true };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Failed to create session' };
    }
}

/**
 * Server action to clear session cookie
 * Replaces POST /api/auth/logout
 */
export async function logoutAction() {
    try {
        await clearSessionCookie();
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: 'Failed to clear session' };
    }
}

/**
 * Server action to clear expired session cookie
 * Replaces POST /api/auth/clear-expired
 */
export async function clearExpiredSessionAction() {
    try {
        await clearSessionCookie();
        return { success: true };
    } catch (error) {
        console.error('Clear expired session error:', error);
        return { success: false, error: 'Failed to clear expired session' };
    }
}
