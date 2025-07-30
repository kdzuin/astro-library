import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/server/auth/with-auth';
import { createProjectSchema, type Project } from '@/schemas/project';
import { getDb } from '@/lib/server/firebase/firestore';
import { FieldValue } from 'firebase-admin/firestore';

// GET /api/projects - Fetch all projects for current user
export const GET = withAuth(async (request, context, user) => {
    try {
        const db = await getDb();
        
        // 1. Get user's project references
        const userDoc = await db.collection('users').doc(user.id).get();
        const userData = userDoc.data();
        const projectIds = userData?.projects || [];
        
        if (projectIds.length === 0) {
            return NextResponse.json({ 
                success: true,
                data: [],
                count: 0
            });
        }
        
        // 2. Batch fetch all user's projects
        const projectRefs = projectIds.map((id: string) => db.collection('projects').doc(id));
        const projectDocs = await db.getAll(...projectRefs);
        
        // 3. Process and sort projects
        const projects: Project[] = projectDocs
            .filter(doc => doc.exists)
            .map(doc => {
                const data = doc.data()!;
                return {
                    id: doc.id,
                    ...data,
                    // Convert Firestore timestamps to Date objects
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                } as Project;
            })
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()); // Sort by updatedAt desc
        
        return NextResponse.json({ 
            success: true,
            data: projects,
            count: projects.length
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
        
        // Validate input using Zod schema
        const validatedData = createProjectSchema.parse({
            ...body,
            userId: user.id, // Ensure project belongs to current user
        });
        
        const db = await getDb();
        
        // Use batch to create project and update user references atomically
        const batch = db.batch();
        
        // 1. Create the project document
        const projectRef = db.collection('projects').doc();
        batch.set(projectRef, {
            ...validatedData,
            userId: user.id,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
        
        // 2. Add project ID to user's projects array
        const userRef = db.collection('users').doc(user.id);
        batch.update(userRef, {
            projects: FieldValue.arrayUnion(projectRef.id),
            updatedAt: FieldValue.serverTimestamp(),
        });
        
        // 3. Commit the batch
        await batch.commit();
        
        // 4. Fetch the created document to return it
        const createdDoc = await projectRef.get();
        const createdData = createdDoc.data()!;
        
        const project: Project = {
            id: createdDoc.id,
            ...createdData,
            // Convert Firestore timestamps to Date objects for response
            createdAt: createdData.createdAt?.toDate() || new Date(),
            updatedAt: createdData.updatedAt?.toDate() || new Date(),
        } as Project;
        
        return NextResponse.json(
            { 
                success: true,
                data: project,
                message: 'Project created successfully'
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
                    details: error.message 
                },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to create project' 
            },
            { status: 500 }
        );
    }
});
