import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/server/auth/with-auth';
import { getProjectById } from '@/lib/server/transport/projects';
import { addSession } from '@/lib/server/transport/sessions';
import { createSessionDataSchema } from '@/schemas/session';

export const POST = withAuth(async (request, context, user) => {
    try {
        const body = await request.json();
        const params = await context.params;

        const projectId = params?.id;

        if (!projectId || typeof projectId !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Project ID is required' },
                { status: 400 }
            );
        }

        // check if the projectId belongs to the current user
        const project = await getProjectById(projectId);

        if (!project) {
            return NextResponse.json(
                { success: false, error: 'Project not found' },
                { status: 404 }
            );
        }

        if (project.userId !== user.id) {
            return NextResponse.json(
                { success: false, error: 'You are not authorized to access this project' },
                { status: 403 }
            );
        }

        const validatedData = createSessionDataSchema.parse({
            ...body,
            filters: body.filters || [],
            equipmentIds: body.equipmentIds || [],
            tags: body.tags || [],
        });

        const sessionId = await addSession(projectId, user.id, validatedData);

        return NextResponse.json(
            {
                success: true,
                data: { id: sessionId },
                message: 'Session created successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating session:', error);

        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid input data',
                    details: error.message,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create project',
            },
            { status: 500 }
        );
    }
});
