'use server';


import { createProjectSchema } from '@/schemas/project';
import { getProjectsByUserId, createProject, getProjectById } from '@/lib/server/transport/projects';
import { getCurrentUser } from '@/lib/server/auth/utils';

/**
 * Server action to fetch all projects for current user
 * Replaces GET /api/projects
 */
export async function getProjectsAction() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }

        const projects = await getProjectsByUserId(user.id);

        return {
            success: true,
            data: projects,
            count: projects.length,
        };
    } catch (error) {
        console.error('Error fetching projects:', error);
        return { success: false, error: 'Failed to fetch projects' };
    }
}

/**
 * Server action to create a new project
 * Replaces POST /api/projects
 */
export async function createProjectAction(formData: FormData) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }

        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string || '',
            visibility: formData.get('visibility') as string,
            tags: JSON.parse(formData.get('tags') as string || '[]'),
            status: 'planning' as const,
            userId: user.id,
        };

        const validatedData = createProjectSchema.parse(data);
        const projectId = await createProject(validatedData);

        return {
            success: true,
            data: { id: projectId },
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

/**
 * Server action to get a project by ID
 * Replaces GET /api/projects/[id]
 */
export async function getProjectByIdAction(projectId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }

        if (!projectId || typeof projectId !== 'string') {
            return { success: false, error: 'Project ID is required' };
        }

        const project = await getProjectById(projectId);

        if (!project) {
            return { success: false, error: 'Project not found' };
        }

        // Verify project belongs to user
        if (project.userId !== user.id) {
            return { success: false, error: 'Unauthorized' };
        }

        return {
            success: true,
            data: project,
        };
    } catch (error) {
        console.error('Error fetching project:', error);
        return { success: false, error: 'Internal server error' };
    }
}
