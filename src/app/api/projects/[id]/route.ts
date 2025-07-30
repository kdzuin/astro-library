import { NextResponse } from 'next/server';
import { withAuth, withOptionalAuth } from '@/lib/server/auth/with-auth';
import { getDb } from '@/lib/server/firebase/firestore';
import { Project, updateProjectSchema } from '@/schemas/project';
import { FieldValue } from 'firebase-admin/firestore';

// GET /api/projects/[id] - Get a specific project
export const GET = withOptionalAuth(async (request, context, user) => {
    const id = context.params?.id as string;
    
    if (!id) {
        return NextResponse.json(
            { success: false, error: 'Project ID is required' },
            { status: 400 }
        );
    }
    
    try {
        const db = await getDb();
        const projectRef = db.collection('projects').doc(id);
        const doc = await projectRef.get();
        
        if (!doc.exists) {
            return NextResponse.json(
                { success: false, error: 'Project not found' },
                { status: 404 }
            );
        }
        
        const projectData = doc.data();
        if (!projectData) {
            return NextResponse.json(
                { success: false, error: 'Project data not found' },
                { status: 404 }
            );
        }
        
        // Check if user has access to this project
        const isOwner = user && projectData.userId === user.id;
        const isCollaborator = user && projectData.collaborators?.includes(user.id);
        const isPublic = projectData.visibility === 'public';
        
        if (!isPublic && !isOwner && !isCollaborator) {
            return NextResponse.json(
                { success: false, error: 'Access denied' },
                { status: 403 }
            );
        }
        
        const project: Project = {
            id: doc.id,
            ...projectData,
            createdAt: projectData.createdAt?.toDate() || new Date(),
            updatedAt: projectData.updatedAt?.toDate() || new Date(),
        } as Project;
        
        if (!project) {
            return NextResponse.json(
                { success: false, error: 'Project not found' },
                { status: 404 }
            );
        }
        
        // Check if user owns this project (redundant with Firestore subcollection, but good practice)
        if (project.userId !== user.id) {
            return NextResponse.json(
                { success: false, error: 'Forbidden' },
                { status: 403 }
            );
        }
        
        return NextResponse.json({ 
            success: true,
            data: project 
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
});

// PUT /api/projects/[id] - Update project
export const PUT = withAuth(async (request, context, user) => {
    try {
        const { id } = context.params!;
        const body = await request.json();
        
        // Validate input using Zod schema
        const validatedData = updateProjectSchema.parse({
            ...body,
            id,
        });
        
        // TODO: Replace with actual database query and update
        // This is a placeholder - you'll need to implement your database layer
        // First, check if project exists and belongs to user
        const existingProject: Project | null = null;
        
        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }
        
        if (existingProject.userId !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }
        
        // Update the project
        const updatedProject: Project = {
            ...existingProject,
            ...validatedData,
            updatedAt: new Date(),
        };
        
        return NextResponse.json({ project: updatedProject });
    } catch (error) {
        console.error('Error updating project:', error);
        
        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.message },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
});

// DELETE /api/projects/[id] - Delete project
export const DELETE = withAuth(async (request, context, user) => {
    try {
        const { id } = context.params!;
        
        // TODO: Replace with actual database query and deletion
        // This is a placeholder - you'll need to implement your database layer
        // First, check if project exists and belongs to user
        const existingProject: Project | null = null;
        
        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }
        
        if (existingProject.userId !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }
        
        // Delete the project
        // await deleteProject(id);
        
        return NextResponse.json(
            { message: 'Project deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
});
