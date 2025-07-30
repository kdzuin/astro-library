import { NextResponse } from 'next/server';
import { withAuth, withOptionalAuth } from '@/lib/server/auth/with-auth';
import { createCatalogueSchema, type Catalogue } from '@/schemas/catalogue';

// GET /api/catalogues - Fetch all catalogues (system + user-specific)
export const GET = withOptionalAuth(async (request, context, user) => {
    try {
        // TODO: Replace with actual Firestore queries
        // Example Firestore queries:
        // 1. Get system catalogues (global)
        // const systemCataloguesRef = db.collection('catalogues').where('type', '==', 'system');
        // const systemSnapshot = await systemCataloguesRef.get();
        // const systemCatalogues = systemSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // 2. Get user catalogues (if authenticated)
        // let userCatalogues = [];
        // if (user) {
        //     const userCataloguesRef = db.collection('users').doc(user.id).collection('catalogues');
        //     const userSnapshot = await userCataloguesRef.get();
        //     userCatalogues = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // }
        
        const systemCatalogues: Catalogue[] = [
            // Example system catalogues
            // {
            //     id: 'ngc_catalogue',
            //     name: 'New General Catalogue',
            //     description: 'NGC catalogue of nebulae and star clusters',
            //     type: 'system',
            //     userId: undefined,
            //     abbreviation: 'NGC',
            //     prefix: 'NGC ',
            //     coverImageUrl: undefined,
            //     tags: ['deep_sky', 'historical'],
            //     visibility: 'public',
            //     objectCount: 7840,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     id: 'messier_catalogue',
            //     name: 'Messier Catalogue',
            //     description: 'Charles Messier\'s catalogue of comet-like objects',
            //     type: 'system',
            //     userId: undefined,
            //     abbreviation: 'M',
            //     prefix: 'M',
            //     coverImageUrl: undefined,
            //     tags: ['deep_sky', 'popular'],
            //     visibility: 'public',
            //     objectCount: 110,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // }
        ];

        const userCatalogues: Catalogue[] = user ? [
            // Example user catalogues (only if authenticated)
            // {
            //     id: 'user_summer_targets',
            //     name: 'My Summer Targets',
            //     description: 'Personal collection of summer deep sky objects',
            //     type: 'user',
            //     userId: user.id,
            //     abbreviation: undefined,
            //     prefix: undefined,
            //     coverImageUrl: undefined,
            //     tags: ['summer', 'personal'],
            //     visibility: 'private',
            //     objectCount: 25,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // }
        ] : [];

        const allCatalogues = [...systemCatalogues, ...userCatalogues];
        
        return NextResponse.json({
            success: true,
            data: allCatalogues,
            count: allCatalogues.length,
            systemCount: systemCatalogues.length,
            userCount: userCatalogues.length
        });
    } catch (error) {
        console.error('Error fetching catalogues:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch catalogues' },
            { status: 500 }
        );
    }
});

// POST /api/catalogues - Create new user catalogue (requires authentication)
export const POST = withAuth(async (request, context, user) => {
    try {
        const body = await request.json();
        
        // Validate input using Zod schema
        const validatedData = createCatalogueSchema.parse({
            ...body,
            type: 'user', // Force user type for user-created catalogues
            userId: user.id, // Ensure catalogue belongs to current user
        });
        
        // TODO: Replace with actual Firestore insertion
        // Example Firestore insertion:
        // const cataloguesRef = db.collection('users').doc(user.id).collection('catalogues');
        // const docRef = await cataloguesRef.add({
        //     ...validatedData,
        //     createdAt: admin.firestore.FieldValue.serverTimestamp(),
        //     updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        // });
        // const newCatalogue = { id: docRef.id, ...validatedData, createdAt: new Date(), updatedAt: new Date() };
        
        const newCatalogue: Catalogue = {
            id: `cat_${Date.now()}`, // Generate proper ID (use Firestore auto-generated ID in real implementation)
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        return NextResponse.json(
            {
                success: true,
                data: newCatalogue,
                message: 'Catalogue created successfully'
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating catalogue:', error);
        
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
                error: 'Failed to create catalogue'
            },
            { status: 500 }
        );
    }
});
