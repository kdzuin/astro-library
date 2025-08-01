'use server';

import { Project } from '@/schemas/project';
import { getDb } from '@/lib/server/firebase/firestore';
import { FieldValue } from 'firebase-admin/firestore';

const PROJECTS_COLLECTION = 'projects';

/**
 * Get all projects for a specific user, sorted by most recently updated
 */
export async function getUserProjects(userId: string): Promise<Project[]> {
    try {
        const db = await getDb();
        
        // Query projects where userId matches
        const projectDocs = await db.collection(PROJECTS_COLLECTION)
            .where('userId', '==', userId)
            .orderBy('updatedAt', 'desc')
            .get();
        
        const projects: Project[] = projectDocs.docs
            .filter((doc) => doc.exists)
            .map((doc) => {
                const data = doc.data()!;
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                } as Project;
            });
        
        return projects;
    } catch (error) {
        console.error('Error fetching user projects:', error);
        return [];
    }
}

/**
 * Get a project by its ID
 */
export async function getProjectById(projectId: string): Promise<Project | null> {
    try {
        const db = await getDb();
        const docRef = db.collection(PROJECTS_COLLECTION).doc(projectId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data()!;
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Project;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting project:', error);
        throw error;
    }
}

/**
 * Create a new project for a user
 */
export async function createProject(
    project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
    try {
        const db = await getDb();
        const projectsRef = db.collection(PROJECTS_COLLECTION);
        
        // Create the project document with server timestamps
        const docRef = await projectsRef.add({
            ...project,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
        
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
        const docRef = db.collection(PROJECTS_COLLECTION).doc(projectId);
        
        await docRef.update({
            ...updates,
            updatedAt: FieldValue.serverTimestamp(),
        });
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
        const docRef = db.collection(PROJECTS_COLLECTION).doc(projectId);
        await docRef.delete();
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}
