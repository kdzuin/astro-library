import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/server/auth/with-auth';
import { getProjectById } from '@/lib/server/transport/projects';

// GET /api/projects/[id] - Get individual project
export const GET = withAuth(async (request: NextRequest, context, user) => {
    try {
        const params = await context.params;
        const projectId = params?.id;

        if (!projectId || typeof projectId !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const project = await getProjectById(projectId);

        if (!project) {
            return NextResponse.json(
                { success: false, error: 'Project not found' },
                { status: 404 }
            );
        }

        // Verify project belongs to user
        if (project.userId !== user.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        return NextResponse.json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
});
