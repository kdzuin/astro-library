'use server';

import { getProjectById } from '@/lib/server/transport/projects';
import { addSession } from '@/lib/server/transport/sessions';
import { createSessionDataSchema } from '@/schemas/session';
import { getCurrentUser } from '@/lib/server/auth/utils';

/**
 * Server action to create a new session for a project
 * Replaces POST /api/projects/[id]/sessions
 */
export async function createSessionAction(projectId: string, formData: FormData) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }

        if (!projectId || typeof projectId !== 'string') {
            return { success: false, error: 'Project ID is required' };
        }

        // Check if the projectId belongs to the current user
        const project = await getProjectById(projectId);

        if (!project) {
            return { success: false, error: 'Project not found' };
        }

        if (project.userId !== user.id) {
            return { success: false, error: 'You are not authorized to access this project' };
        }

        const data = {
            date: formData.get('date') as string,
            location: formData.get('location') as string,
            tags: JSON.parse(formData.get('tags') as string || '[]'),
            filters: JSON.parse(formData.get('filters') as string || '[]'),
            equipmentIds: JSON.parse(formData.get('equipmentIds') as string || '[]'),
        };

        const validatedData = createSessionDataSchema.parse(data);
        const sessionId = await addSession(projectId, user.id, validatedData);

        return {
            success: true,
            data: { id: sessionId },
            message: 'Session created successfully',
        };
    } catch (error) {
        console.error('Error creating session:', error);

        if (error instanceof Error && error.name === 'ZodError') {
            return {
                success: false,
                error: 'Invalid session data',
            };
        }

        return {
            success: false,
            error: 'Failed to create session',
        };
    }
}
