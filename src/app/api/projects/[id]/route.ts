import { NextRequest, NextResponse } from 'next/server';
import { deleteProject, getProjectById, updateProject } from '@/lib/server/transport/projects';
import { verifyAuthToken } from '@/lib/server/firebase/admin-auth';
import { projectSchema } from '@/schemas/project';
import z from 'zod';

// Schema for validating project updates
const projectUpdateSchema = projectSchema.omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split('Bearer ')[1];

        // If no token, user is not authenticated
        if (!token) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // Verify the Firebase ID token and get the user ID
        const userId = await verifyAuthToken(token);

        if (!userId) {
            return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
        }

        // Fetch the project
        const project = await getProjectById(params.id);

        // If project doesn't exist
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Check if user owns the project
        if (project.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Return the project
        return NextResponse.json({ project });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split('Bearer ')[1];

        // If no token, user is not authenticated
        if (!token) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // Verify the Firebase ID token and get the user ID
        const userId = await verifyAuthToken(token);

        if (!userId) {
            return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
        }

        // Get the project to check ownership
        const existingProject = await getProjectById(params.id);

        // If project doesn't exist
        if (!existingProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Check if user owns the project
        if (existingProject.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Parse and validate the request body
        const body = await request.json();
        const validatedUpdates = projectUpdateSchema.parse(body);

        // Update the project
        await updateProject(params.id, validatedUpdates);

        // Return success response
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating project:', error);

        // Handle validation errors
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid project data', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split('Bearer ')[1];

        // If no token, user is not authenticated
        if (!token) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // Verify the Firebase ID token and get the user ID
        const userId = await verifyAuthToken(token);

        if (!userId) {
            return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
        }

        // Get the project to check ownership
        const existingProject = await getProjectById(params.id);

        // If project doesn't exist
        if (!existingProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Check if user owns the project
        if (existingProject.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Delete the project
        await deleteProject(params.id);

        // Return success response
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
