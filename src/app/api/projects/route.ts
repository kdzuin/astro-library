import { NextRequest, NextResponse } from 'next/server';
import { getProjectsByUserId, createProject } from '@/lib/server/transport/projects';
import { verifyAuthToken } from '@/lib/server/firebase/admin-auth';
import { projectSchema } from '@/schemas/project';
import z from 'zod';

export async function GET(request: NextRequest) {
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

        // Fetch projects for the authenticated user
        const rawProjects = await getProjectsByUserId(userId);

        // Parse and transform the projects using Zod schema
        const validatedProjects = z.array(projectSchema).parse(rawProjects);

        // Return the validated and serialized projects as JSON
        return NextResponse.json({ projects: validatedProjects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

// Schema for project creation request
const createProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    visibility: z.enum(['public', 'private']).default('private'),
});

export async function POST(request: NextRequest) {
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

        // Parse and validate the request body
        const body = await request.json();
        const validatedData = createProjectSchema.parse(body);

        // Create the project
        const projectId = await createProject({
            ...validatedData,
            userId,
        });

        // Return the project ID
        return NextResponse.json({ id: projectId }, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        
        // Handle validation errors
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
