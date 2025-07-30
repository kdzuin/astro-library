'use server';

import { getApps, cert, initializeApp, App } from 'firebase-admin/app';

let adminApp: App | null = null;

/**
 * Initialize Firebase Admin SDK if it hasn't been initialized already
 * This is the single source of truth for Firebase Admin initialization
 */
export async function initFirebaseAdmin(): Promise<App> {
    if (adminApp) {
        return adminApp;
    }

    if (getApps().length === 0) {
        adminApp = initializeApp({
            credential: cert({
                projectId:
                    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    } else {
        adminApp = getApps()[0];
    }

    return adminApp;
}

/**
 * Get the Firebase Admin app instance
 */
export async function getAdminApp(): Promise<App> {
    return await initFirebaseAdmin();
}
