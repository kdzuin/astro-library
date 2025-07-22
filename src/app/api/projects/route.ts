import { NextRequest, NextResponse } from 'next/server';
import { getProjectsByUserId } from '@/lib/server/projects';
import { verifyAuthToken } from '@/lib/firebase/admin-auth';
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
