'use server';

import { createProjectSchema, Project, projectSchema } from '@/schemas/project';
import { requireAuth } from '@/lib/server/auth/utils';
import { deleteCollection, getDb } from '@/lib/server/firebase/firestore';
import { FieldValue } from 'firebase-admin/firestore';

export async function createProject(formData: FormData) {
    try {
        const user = await requireAuth();
        const data = {
            name: formData.get('name') as string,
            description: (formData.get('description') as string) || '',
            visibility: formData.get('visibility') as string,
            tags: JSON.parse((formData.get('tags') as string) || '[]'),
            status: 'planning' as const,
        };

        const validatedData = createProjectSchema.parse(data);

        const db = await getDb();
        const projectRef = await db.collection('projects').add({
            ...validatedData,
            userId: user.id,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        return {
            success: true,
            data: { id: projectRef.id },
            message: 'Project created successfully',
        };
    } catch (error) {
        console.error('Error creating project:', error);

        if (error instanceof Error && error.name === 'ZodError') {
            return {
                success: false,
                error: 'Invalid project data',
            };
        }

        return {
            success: false,
            error: 'Failed to create project',
        };
    }
}

export async function getProjectById(projectId: string) {
    try {
        const db = await getDb();
        const projectRef = await db.collection('projects').doc(projectId).get();

        if (!projectRef.exists) {
            return { success: false, error: 'Project not found' };
        }

        const projectData = projectRef.data();

        const project = projectSchema.parse({
            ...projectData,
            id: projectRef.id,
            createdAt: projectData?.createdAt?.toDate() || new Date(),
            updatedAt: projectData?.updatedAt?.toDate() || new Date(),
        });

        return {
            success: true,
            data: project,
        };
    } catch (error) {
        console.error('Error fetching project:', error);
        return { success: false, error: 'Internal server error' };
    }
}

export async function getProjectsByUserId(userId: string) {
    try {
        const db = await getDb();
        const projectDocs = await db
            .collection('projects')
            .where('userId', '==', userId)
            .orderBy('updatedAt', 'desc')
            .get();

        const projects = projectDocs.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Project;
        });

        return {
            success: true,
            data: projects,
        };
    } catch (error) {
        console.error('Error fetching projects:', error);
        return { success: false, data: [], error: 'Internal server error' };
    }
}

export async function deleteProjectById(projectId: string) {
    try {
        const db = await getDb();
        const projectRef = await db.collection('projects').doc(projectId);

        await deleteCollection(db, `projects/${projectId}/sessions`, 10);
        await projectRef.delete();

        return {
            success: true,
        };
    } catch (error) {
        console.error('Error deleting project:', error);
        return { success: false, error: 'Internal server error' };
    }
}
