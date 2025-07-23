'use server';

import { Project } from '@/schemas/project';
import { db } from '@/lib/client/firebase/config';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    serverTimestamp,
} from 'firebase/firestore';

const PROJECTS_COLLECTION = 'projects';

/**
 * Create a new project for a user
 */
export async function createProject(
    project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
            ...project,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}

/**
 * Get all projects for a specific user
 */
export async function getProjectsByUserId(userId: string): Promise<Project[]> {
    try {
        const projectsQuery = query(
            collection(db, PROJECTS_COLLECTION),
            where('userId', '==', userId)
        );

        const querySnapshot = await getDocs(projectsQuery);
        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                userId: data.userId,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
                visibility: data.visibility,
            };
        });
    } catch (error) {
        console.error('Error getting projects:', error);
        throw error;
    }
}

/**
 * Get a project by its ID
 */
export async function getProjectById(projectId: string): Promise<Project | null> {
    try {
        const docRef = doc(db, PROJECTS_COLLECTION, projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                name: data.name,
                userId: data.userId,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
                visibility: data.visibility,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting project:', error);
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
        const docRef = doc(db, PROJECTS_COLLECTION, projectId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
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
        const docRef = doc(db, PROJECTS_COLLECTION, projectId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}
