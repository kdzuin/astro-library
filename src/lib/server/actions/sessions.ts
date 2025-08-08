import { createSessionSchema, sessionSchema } from '@/schemas/session';
import { requireAuth } from '@/lib/server/auth/utils';
import { getDb } from '@/lib/server/firebase/firestore';

export async function createSession(projectId: string, formData: FormData) {
    try {
        const user = await requireAuth();
        const userId = user.id;

        const data = {
            date: formData.get('date') as string,
        };

        const validatedData = createSessionSchema.parse(data);

        const db = await getDb();
        const docRef = await db
            .collection('projects')
            .doc(projectId)
            .collection('sessions')
            .add({
                ...validatedData,
                projectId,
                userId,
            });

        return {
            success: true,
            data: { id: docRef.id },
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An error occurred',
        };
    }
}

export function updateSession() {}

export function deleteSession() {}

export async function getSessionsByProjectId(projectId: string) {
    try {
        const db = await getDb();
        const sessionsDocs = await db
            .collection('projects')
            .doc(projectId)
            .collection('sessions')
            .orderBy('date', 'desc')
            .get();

        const sessions = sessionsDocs.docs.map((doc) => {
            const data = doc.data();
            return sessionSchema.parse({
                ...data,
                id: doc.id,
            });
        });

        return {
            success: true,
            data: sessions,
        };
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return { success: false, data: [], error: 'Internal server error' };
    }
}

export async function getSessionsByUserId(userId: string, limit: number) {
    try {
        const db = await getDb();

        const sessionsDocs = await db
            .collectionGroup('sessions')
            .where('userId', '==', userId)
            .orderBy('date', 'desc')
            .limit(limit)
            .get();

        const sessions = sessionsDocs.docs.map((doc) => {
            const data = doc.data();
            return sessionSchema.parse({
                ...data,
                id: doc.id,
            });
        });

        return {
            success: true,
            data: sessions,
        };
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return { success: false, data: [], error: 'Internal server error' };
    }
}
