'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/server/auth/utils';
import { getProjectById } from '@/lib/server/transport/projects';
import {
    getSessionById,
    updateSessionWithAcquisitionDetails,
} from '@/lib/server/transport/sessions';
import { createAcquisitionDetailsSchema } from '@/schemas/acquisition-details';

export async function getSessionWithDetails(projectId: string, sessionId: string) {
    try {
        const user = await requireAuth();

        // Verify project belongs to user
        const project = await getProjectById(projectId);
        if (!project || project.userId !== user.id) {
            throw new Error('Project not found or unauthorized');
        }

        // Get session with acquisition details
        const sessionWithDetails = await getSessionById(projectId, sessionId);
        if (!sessionWithDetails) {
            throw new Error('Session not found');
        }

        return {
            success: true,
            data: sessionWithDetails,
        };
    } catch (error) {
        console.error('Error fetching session:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch session',
        };
    }
}

export async function updateSessionAcquisitionDetails(
    projectId: string,
    sessionId: string,
    acquisitionDetails: unknown[]
) {
    try {
        const user = await requireAuth();

        // Verify project belongs to user
        const project = await getProjectById(projectId);
        if (!project || project.userId !== user.id) {
            throw new Error('Project not found or unauthorized');
        }

        // Validate acquisition details
        const validatedDetails = [];
        for (const detail of acquisitionDetails) {
            const result = createAcquisitionDetailsSchema.safeParse(detail);
            if (!result.success) {
                throw new Error(
                    `Invalid acquisition details: ${result.error.issues
                        .map((i) => i.message)
                        .join(', ')}`
                );
            }
            validatedDetails.push(result.data);
        }

        // Update session with acquisition details
        await updateSessionWithAcquisitionDetails(
            projectId,
            sessionId,
            user.id,
            {}, // No session data updates for now
            validatedDetails
        );

        // Revalidate the session page
        revalidatePath(`/projects/${projectId}/sessions/${sessionId}`);

        return {
            success: true,
            message: 'Session updated successfully',
        };
    } catch (error) {
        console.error('Error updating session:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update session',
        };
    }
}
