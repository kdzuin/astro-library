import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/server/auth/with-auth';
import { createEquipmentSchema, type Equipment } from '@/schemas/equipment';

// GET /api/equipment - Fetch all equipment for current user
export const GET = withAuth(async (request, context, user) => {
    try {
        // TODO: Replace with actual Firestore query
        // Example Firestore query:
        // const equipmentRef = db.collection('users').doc(user.id).collection('equipment');
        // const snapshot = await equipmentRef.get();
        // const equipment = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const equipment: Equipment[] = [
            // Example equipment structure
            // {
            //     id: 'eq_camera_1',
            //     userId: user.id,
            //     name: 'ZWO ASI2600MC Pro',
            //     category: 'camera',
            //     brand: 'ZWO',
            //     model: 'ASI2600MC Pro',
            //     description: 'Color CMOS camera for astrophotography',
            //     specifications: {
            //         sensor: 'Sony IMX571',
            //         resolution: '6248x4176',
            //         pixelSize: '3.76μm',
            //         cooled: true,
            //         filterWheel: false
            //     },
            //     purchaseDate: new Date('2023-01-15'),
            //     purchasePrice: 1299.00,
            //     status: 'active',
            //     notes: 'Excellent camera for one-shot color imaging',
            //     tags: ['color', 'cooled', 'main_camera'],
            //     imageUrls: [],
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     id: 'eq_telescope_1',
            //     userId: user.id,
            //     name: 'William Optics RedCat 71',
            //     category: 'telescope',
            //     brand: 'William Optics',
            //     model: 'RedCat 71',
            //     description: 'Apochromatic refractor telescope',
            //     specifications: {
            //         aperture: '71mm',
            //         focalLength: '348mm',
            //         focalRatio: 'f/4.9',
            //         type: 'Apochromatic Refractor',
            //         weight: '1.9kg'
            //     },
            //     purchaseDate: new Date('2022-08-20'),
            //     purchasePrice: 899.00,
            //     status: 'active',
            //     notes: 'Perfect for wide-field imaging',
            //     tags: ['apo', 'wide_field', 'portable'],
            //     imageUrls: [],
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // }
        ];
        
        return NextResponse.json({
            success: true,
            data: equipment,
            count: equipment.length
        });
    } catch (error) {
        console.error('Error fetching equipment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch equipment' },
            { status: 500 }
        );
    }
});

// POST /api/equipment - Create new equipment
export const POST = withAuth(async (request, context, user) => {
    try {
        const body = await request.json();
        
        // Validate input using Zod schema
        const validatedData = createEquipmentSchema.parse({
            ...body,
            userId: user.id, // Ensure equipment belongs to current user
        });
        
        // TODO: Replace with actual Firestore insertion
        // Example Firestore insertion:
        // const equipmentRef = db.collection('users').doc(user.id).collection('equipment');
        // const docRef = await equipmentRef.add({
        //     ...validatedData,
        //     createdAt: admin.firestore.FieldValue.serverTimestamp(),
        //     updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        // });
        // const newEquipment = { id: docRef.id, ...validatedData, createdAt: new Date(), updatedAt: new Date() };
        
        const newEquipment: Equipment = {
            id: `eq_${Date.now()}`, // Generate proper ID (use Firestore auto-generated ID in real implementation)
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        return NextResponse.json(
            {
                success: true,
                data: newEquipment,
                message: 'Equipment created successfully'
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating equipment:', error);
        
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
                error: 'Failed to create equipment'
            },
            { status: 500 }
        );
    }
});
