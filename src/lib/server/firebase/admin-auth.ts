'use server';

import { getApps, cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK if it hasn't been initialized already
export async function initFirebaseAdmin() {
    if (getApps().length === 0) {
        initializeApp({
            credential: cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    }

    return getAuth();
}

/**
 * Verify a Firebase ID token and return the user ID
 * @param token Firebase ID token
 * @returns User ID if token is valid, null otherwise
 */
export async function verifyAuthToken(token: string): Promise<string | null> {
    try {
        const auth = await initFirebaseAdmin();
        const decodedToken = await auth.verifyIdToken(token);
        return decodedToken.uid;
    } catch (error) {
        console.error('Error verifying auth token:', error);
        return null;
    }
}
