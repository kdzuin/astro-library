import { getDb } from '@/lib/server/firebase/firestore';
import { User, CreateUserInput, createUserSchema, userSchema } from '@/schemas/user';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Ensures a user document exists in Firestore, creating it if necessary
 */
export async function ensureUserExists(userData: CreateUserInput): Promise<User> {
    const db = await getDb();
    const userRef = db.collection('users').doc(userData.id);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
        // User exists, return existing data
        const existingData = userDoc.data()!;
        const userData = {
            id: userDoc.id,
            ...existingData,
            createdAt: existingData.createdAt?.toDate() || new Date(),
            updatedAt: existingData.updatedAt?.toDate() || new Date(),
        };
        
        const result = userSchema.safeParse(userData);
        if (!result.success) {
            console.error('Invalid existing user data for', userDoc.id, ':', result.error);
            // Fall through to recreate user with valid data
        } else {
            return result.data;
        }
    }

    // User doesn't exist, create new user document
    const createResult = createUserSchema.safeParse(userData);
    if (!createResult.success) {
        console.error('Invalid user creation data:', createResult.error);
        throw new Error('Invalid user data provided for creation');
    }
    const validatedData = createResult.data;
    const now = FieldValue.serverTimestamp();

    const newUserData = {
        ...validatedData,
        createdAt: now,
        updatedAt: now,
    };

    await userRef.set(newUserData);

    // Fetch the created document to return with proper timestamps
    const createdDoc = await userRef.get();
    const createdData = createdDoc.data()!;

    const createdUserData = {
        id: createdDoc.id,
        ...createdData,
        createdAt: createdData.createdAt?.toDate() || new Date(),
        updatedAt: createdData.updatedAt?.toDate() || new Date(),
    };
    
    const result = userSchema.safeParse(createdUserData);
    if (!result.success) {
        console.error('Invalid created user data:', result.error);
        throw new Error('Failed to create valid user document');
    }
    
    return result.data;
}

/**
 * Gets a user by ID, ensuring they exist in the database
 */
export async function getUserById(userId: string): Promise<User | null> {
    try {
        const db = await getDb();
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return null;
        }

        const userData = userDoc.data()!;
        const userDataWithId = {
            id: userDoc.id,
            ...userData,
            createdAt: userData.createdAt?.toDate() || new Date(),
            updatedAt: userData.updatedAt?.toDate() || new Date(),
        };
        
        const result = userSchema.safeParse(userDataWithId);
        if (!result.success) {
            console.error('Invalid user data for', userDoc.id, ':', result.error);
            return null;
        }
        
        return result.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}
