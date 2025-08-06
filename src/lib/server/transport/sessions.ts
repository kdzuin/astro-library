'use server';

import { getDb } from '@/lib/server/firebase/firestore';
import { sessionDataSchema, sessionBaseSchema, SessionData } from '@/schemas/session';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Get all sessions for a specific project
 */
export async function getSessionsByProjectId(projectId: string): Promise<SessionData[]> {
    try {
        const db = await getDb();
        const sessionsRef = db
            .collection('projects')
            .doc(projectId)
            .collection('sessions')
            .orderBy('date', 'desc');
        const sessionsSnapshot = await sessionsRef.get();

        const sessions: SessionData[] = [];

        for (const doc of sessionsSnapshot.docs) {
            if (!doc.exists) continue;

            const data = doc.data()!;
            const sessionData = {
                id: doc.id,
                ...data,
            };

            const result = sessionDataSchema.safeParse(sessionData);
            if (!result.success) {
                console.error('Invalid session data for doc', doc.id, ':', result.error);
                continue;
            }

            sessions.push(result.data);
        }

        return sessions;
    } catch (error) {
        console.error('Error fetching project sessions:', error);
        return [];
    }
}

export async function getSessionsByUserId(userId: string, limit?: number): Promise<SessionData[]> {
    try {
        const db = await getDb();

        let sessionsQuery = db
            .collectionGroup('sessions')
            .where('userId', '==', userId)
            .orderBy('date', 'desc');

        if (limit) {
            sessionsQuery = sessionsQuery.limit(limit);
        }

        const sessionsSnapshot = await sessionsQuery.get();
        const sessions: SessionData[] = [];

        // Process all session documents
        for (const doc of sessionsSnapshot.docs) {
            if (!doc.exists) continue;

            const firestoreData = doc.data();

            // First validate the Firestore data against the base schema
            const baseResult = sessionBaseSchema.safeParse(firestoreData);
            if (!baseResult.success) {
                console.error('Invalid base session data for doc', doc.id, ':', baseResult.error);
                continue;
            }

            // Then add the transport-layer fields and validate the complete object
            const sessionData = {
                ...baseResult.data,
                id: doc.id,
                projectId: firestoreData.projectId || '', // Use projectId from Firestore data
                userId: firestoreData.userId || userId, // Use userId from Firestore data or fallback
            };

            const fullResult = sessionDataSchema.safeParse(sessionData);
            if (fullResult.success) {
                sessions.push(fullResult.data);
            } else {
                console.error('Invalid full session data for doc', doc.id, ':', fullResult.error);
            }
        }

        return sessions;
    } catch (error) {
        console.error('Error fetching user sessions:', error);
        return [];
    }
}

/**
 * Add new session for a specific project
 */
export async function addSession(
    projectId: string,
    userId: string,
    session: Omit<SessionData, 'id' | 'projectId' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
    try {
        const db = await getDb();
        const sessionsRef = db.collection('projects').doc(projectId).collection('sessions');
        const docRef = await sessionsRef.add({
            ...session,
            projectId: projectId, // Store projectId in the document for collection group queries
            userId: userId, // Store userId in the document for direct user queries
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding project session:', error);
        throw error;
    }
}
