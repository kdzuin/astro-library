'use server';

import { getDb } from '@/lib/server/firebase/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { SessionData, sessionDataSchema } from '@/schemas/session';

/**
 * Get all sessions for a specific project
 */
export async function getSessionByProjectId(projectId: string): Promise<SessionData[]> {
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

/**
 * Add new session for a specific project
 */
export async function addSession(
    projectId: string,
    session: Omit<SessionData, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
    try {
        const db = await getDb();
        const sessionsRef = db.collection('projects').doc(projectId).collection('sessions');
        const docRef = await sessionsRef.add({
            ...session,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding project session:', error);
        throw error;
    }
}
