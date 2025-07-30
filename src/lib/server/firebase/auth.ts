'use server';

import { getAuth, Auth } from 'firebase-admin/auth';
import { getAdminApp } from './admin';

let authInstance: Auth | null = null;

/**
 * Get Firebase Auth instance
 * Uses the shared Firebase Admin app for consistency
 */
export async function getFirebaseAuth(): Promise<Auth> {
    if (authInstance) {
        return authInstance;
    }

    const app = await getAdminApp();
    authInstance = getAuth(app);
    return authInstance;
}

/**
 * Verify a Firebase ID token and return the user ID
 * @param token Firebase ID token
 * @returns User ID if token is valid, null otherwise
 */
export async function verifyAuthToken(token: string): Promise<string | null> {
    try {
        const auth = await getFirebaseAuth();
        const decodedToken = await auth.verifyIdToken(token);
        return decodedToken.uid;
    } catch (error) {
        console.error('Error verifying auth token:', error);
        return null;
    }
}

/**
 * Verify a session cookie and return the decoded token
 * @param sessionCookie Session cookie to verify
 * @returns Decoded token if valid, null otherwise
 */
export async function verifySessionCookie(sessionCookie: string) {
    try {
        const auth = await getFirebaseAuth();
        const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
        return decodedToken;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // Handle specific Firebase auth errors
        if (error?.code === 'auth/session-cookie-expired') {
            console.log('Session cookie expired, user needs to re-authenticate');
        } else if (error?.code === 'auth/session-cookie-revoked') {
            console.log('Session cookie revoked, user needs to re-authenticate');
        } else {
            console.error('Error verifying session cookie:', error);
        }
        return null;
    }
}

/**
 * Create a session cookie from an ID token
 * @param idToken Firebase ID token
 * @param expiresIn Session duration in milliseconds
 * @returns Session cookie string
 */
export async function createSessionCookie(idToken: string, expiresIn: number): Promise<string> {
    try {
        const auth = await getFirebaseAuth();
        // Verify the ID token first
        await auth.verifyIdToken(idToken);
        // Create session cookie
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
        return sessionCookie;
    } catch (error) {
        console.error('Error creating session cookie:', error);
        throw new Error('Failed to create session cookie');
    }
}
