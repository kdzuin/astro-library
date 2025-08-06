'use server';

import { getDb } from '@/lib/server/firebase/firestore';
import { FieldValue } from 'firebase-admin/firestore';

export interface SessionData {
    id: string;
    projectId: string;
    userId: string;
    date: string;
    location?: string;
    notes?: string;
    tags?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AcquisitionDetailsData {
    id: string;
    projectId: string;
    userId: string;
    sessionId: string;
    filterId?: string; // id of existing filter in the db
    filterName?: string; // alternatively, custom name
    exposureTime: number;
    numberOfExposures: number;
    gain?: number;
    iso?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Get all sessions for a specific project
 *
 * @param projectId
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

        return sessionsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                projectId,
                ...data,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            } as SessionData;
        });
    } catch (error) {
        console.error('Error fetching project sessions:', error);
        return [];
    }
}

/**
 * Get all sessions for a specific user
 *
 * @param userId
 * @param limit
 */
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

        return sessionsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            } as SessionData;
        });
    } catch (error) {
        console.error('Error fetching user sessions:', error);
        return [];
    }
}

/**
 * Add new session for a specific project
 *
 * @param projectId
 * @param userId
 * @param session
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

/**
 * Add acquisition details to the session
 */
export async function addAcquisitionDetails(
    projectId: string,
    userId: string,
    sessionId: string,
    acquisitionDetails: Omit<
        AcquisitionDetailsData,
        'id' | 'projectId' | 'userId' | 'createdAt' | 'updatedAt'
    >
): Promise<string> {
    try {
        const db = await getDb();
        const sessionsRef = db.collection('projects').doc(projectId).collection('sessions');
        const docRef = await sessionsRef
            .doc(sessionId)
            .collection('acquisitionDetails')
            .add({
                ...acquisitionDetails,
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

/**
 * Get all acquisition details for a specific session
 */
export async function getAcquisitionDetailsBySessionId(
    sessionId: string
): Promise<AcquisitionDetailsData[]> {
    try {
        const db = await getDb();
        const acquisitionDetailsRef = db
            .collectionGroup('acquisitionDetails')
            .where('sessionId', '==', sessionId);
        const acquisitionDetailsSnapshot = await acquisitionDetailsRef.get();

        return acquisitionDetailsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                sessionId: sessionId,
                ...data,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            } as AcquisitionDetailsData;
        });
    } catch (error) {
        console.error('Error fetching acquisition details:', error);
        return [];
    }
}
