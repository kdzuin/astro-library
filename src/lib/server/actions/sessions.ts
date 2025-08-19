'use server';

import { createSessionSchema, sessionSchema } from '@/schemas/session';
import { createAcquisitionDetailsSchema } from '@/schemas/acquisition-details';
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

        // Parse acquisition details if provided
        const acquisitionDetailsRaw = formData.get('acquisitionDetails') as string;
        let acquisitionDetails: ReturnType<typeof createAcquisitionDetailsSchema.parse>[] = [];
        
        if (acquisitionDetailsRaw) {
            try {
                const rawDetails = JSON.parse(acquisitionDetailsRaw);
                // Validate each acquisition detail
                acquisitionDetails = rawDetails.map((detail: unknown) => 
                    createAcquisitionDetailsSchema.parse(detail)
                );
            } catch {
                throw new Error('Invalid acquisition details format');
            }
        }

        const db = await getDb();
        const docRef = db.collection('projects').doc(projectId).collection('sessions').doc(); // Generate a new document reference with ID

        // Store the session document
        await docRef.set({
            ...validatedData,
            id: docRef.id, // Include the document ID as a field
            projectId,
            userId,
        });

        // Store acquisition details as subcollection if any
        if (acquisitionDetails.length > 0) {
            const batch = db.batch();
            
            acquisitionDetails.forEach((detail) => {
                const acquisitionRef = docRef.collection('acquisitionDetails').doc();
                batch.set(acquisitionRef, {
                    ...detail,
                    id: acquisitionRef.id,
                    sessionId: docRef.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
            });
            
            await batch.commit();
        }

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
