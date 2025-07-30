'use server';

import { cookies } from 'next/headers';

/**
 * Session management utilities for handling expired or invalid sessions
 */

const SESSION_COOKIE_NAME = 'session';

/**
 * Check if a session cookie exists
 */
export async function hasSessionCookie(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
        return !!sessionCookie?.value;
    } catch (error) {
        console.error('Error checking session cookie:', error);
        return false;
    }
}

/**
 * Force clear session cookie (useful for expired sessions)
 */
export async function forceLogout(): Promise<void> {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(SESSION_COOKIE_NAME);
        console.log('Session cookie cleared due to expiration/invalidity');
    } catch (error) {
        console.error('Error clearing session cookie:', error);
    }
}

/**
 * Get session expiration info (if available)
 */
export async function getSessionInfo(): Promise<{ hasSession: boolean; cookieName: string }> {
    const hasSession = await hasSessionCookie();
    return {
        hasSession,
        cookieName: SESSION_COOKIE_NAME,
    };
}
