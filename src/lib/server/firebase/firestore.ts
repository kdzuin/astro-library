'use server';

import { getFirestore as getAdminFirestore, Firestore } from 'firebase-admin/firestore';
import { getAdminApp } from './admin';

let firestoreInstance: Firestore | null = null;

/**
 * Get Firestore instance
 * Uses the shared Firebase Admin app for consistency
 */
export async function getFirestore(): Promise<Firestore> {
    if (firestoreInstance) {
        return firestoreInstance;
    }

    const app = await getAdminApp();
    firestoreInstance = getAdminFirestore(app);
    return firestoreInstance;
}

/**
 * Alias for getFirestore() for convenience
 */
export async function getDb(): Promise<Firestore> {
    return await getFirestore();
}
