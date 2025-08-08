'use server';

import {
    getFirestore as getAdminFirestore,
    Firestore,
    Query,
    DocumentData,
} from 'firebase-admin/firestore';
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

export async function deleteCollection(db: Firestore, collectionPath: string, batchSize: number) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(
    db: Firestore,
    query: Query<DocumentData, DocumentData>,
    resolve: (value?: unknown) => void
) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}
