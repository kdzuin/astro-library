'use server';

import { getDb } from '@/lib/server/firebase/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { unstable_cache } from 'next/cache';
import { invalidateProjectsCache } from '@/lib/server/cache/utils';

// Simple TypeScript interface for Project data
export interface Project {
    id: string;
    userId: string;
    name: string;
    description?: string;
    tags?: string[];
    visibility: 'public' | 'private';
    status: 'planning' | 'active' | 'processing' | 'completed';
    totalExposureTime?: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Get all projects for a specific user, sorted by most recently updated (cached)
 */
const getCachedProjectsByUserId = unstable_cache(
    async (userId: string): Promise<Project[]> => {
        try {
            const db = await getDb();

            // Query projects where userId matches
            const projectDocs = await db
                .collection('projects')
                .where('userId', '==', userId)
                .orderBy('updatedAt', 'desc')
                .get();

            return projectDocs.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                } as Project;
            });
        } catch (error) {
            console.error('Error fetching user projects:', error);
            return [];
        }
    },
    ['projects-by-user'],
    {
        tags: ['projects'],
        revalidate: 300, // Cache for 5 minutes
    }
);

export async function getProjectsByUserId(userId: string): Promise<Project[]> {
    return getCachedProjectsByUserId(userId);
}

/**
 * Get a project by its ID (cached)
 */
const getCachedProjectById = unstable_cache(
    async (projectId: string): Promise<Project | null> => {
        try {
            const db = await getDb();
            const projectRef = db.collection('projects').doc(projectId);
            const projectDoc = await projectRef.get();

            if (!projectDoc.exists) {
                return null;
            }

            const data = projectDoc.data()!;
            return {
                id: projectDoc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Project;
        } catch (error) {
            console.error('Error getting project:', error);
            throw error;
        }
    },
    ['project-by-id'],
    {
        tags: ['projects'],
        revalidate: 600, // Cache for 10 minutes
    }
);

export async function getProjectById(projectId: string): Promise<Project | null> {
    return getCachedProjectById(projectId);
}

/**
 * Create a new project for a user
 */
export async function createProject(
    project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
    try {
        const db = await getDb();
        const projectsRef = db.collection('projects');

        // Create the project document with server timestamps
        const docRef = await projectsRef.add({
            ...project,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        // Invalidate projects cache after creation
        await invalidateProjectsCache();

        return docRef.id;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}

/**
 * Update an existing project
 */
export async function updateProject(
    projectId: string,
    updates: Partial<Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
    try {
        const db = await getDb();
        const docRef = db.collection('projects').doc(projectId);

        await docRef.update({
            ...updates,
            updatedAt: FieldValue.serverTimestamp(),
        });

        // Invalidate projects cache after update
        await invalidateProjectsCache();
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<void> {
    try {
        const db = await getDb();
        const docRef = db.collection('projects').doc(projectId);
        await docRef.delete();

        // Invalidate projects cache after deletion
        await invalidateProjectsCache();
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}
