'use server';

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
        const docRef = db.collection('projects').doc(projectId).collection('sessions').doc(); // Generate a new document reference with ID

        // Store the document with the ID included as a field
        await docRef.set({
            ...validatedData,
            id: docRef.id, // Include the document ID as a field
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

export async function updateSession() {}

export async function deleteSession() {}

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

export async function getSessionsByUserId() {
    try {
        const user = await requireAuth();
        const db = await getDb();

        const sessionsDocs = await db
            .collectionGroup('sessions')
            .where('userId', '==', user.id)
            .orderBy('date', 'desc')
            .get();

        const sessions = sessionsDocs.docs.map((doc) => sessionSchema.parse(doc.data()));

        return {
            success: true,
            data: sessions,
        };
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return { success: false, data: [], error: 'Internal server error' };
    }
}

export async function getSessionById(sessionId: string) {
    try {
        const user = await requireAuth();
        const db = await getDb();

        const sessionsDocs = await db
            .collectionGroup('sessions')
            .where('userId', '==', user.id)
            .where('id', '==', sessionId)
            .get();

        if (!sessionsDocs.docs.length) {
            throw new Error('Session not found');
        }

        const session = sessionSchema.parse(sessionsDocs.docs[0].data());

        return {
            success: true,
            data: session,
        };
    } catch (error) {
        console.error('Error fetching session:', error);
        return { success: false, data: null, error: 'Internal server error' };
    }
}
