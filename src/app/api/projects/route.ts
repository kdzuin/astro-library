import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/server/auth/with-auth';
import { createProjectSchema } from '@/schemas/project';
import { getProjectsByUserId, createProject } from '@/lib/server/transport/projects';

// GET /api/projects - Fetch all projects for current user
export const GET = withAuth(async (request, context, user) => {
    try {
        const projects = await getProjectsByUserId(user.id);

        return NextResponse.json({
            success: true,
            data: projects,
            count: projects.length,
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
});

// POST /api/projects - Create new project
export const POST = withAuth(async (request, context, user) => {
    try {
        const body = await request.json();

        const validatedData = createProjectSchema.parse({
            ...body,
            userId: user.id, // Ensure project belongs to current user
        });

        const projectId = await createProject(validatedData);

        return NextResponse.json(
            {
                success: true,
                data: { id: projectId },
                message: 'Project created successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating project:', error);

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
