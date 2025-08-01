import { getDb } from '@/lib/server/firebase/firestore';
import { User, CreateUserInput, createUserSchema } from '@/schemas/user';
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
        return {
            id: userDoc.id,
            ...existingData,
            createdAt: existingData.createdAt?.toDate() || new Date(),
            updatedAt: existingData.updatedAt?.toDate() || new Date(),
        } as User;
    }

    // User doesn't exist, create new user document
    const validatedData = createUserSchema.parse(userData);
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

    return {
        id: createdDoc.id,
        ...createdData,
        createdAt: createdData.createdAt?.toDate() || new Date(),
        updatedAt: createdData.updatedAt?.toDate() || new Date(),
    } as User;
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
        return {
            id: userDoc.id,
            ...userData,
            createdAt: userData.createdAt?.toDate() || new Date(),
            updatedAt: userData.updatedAt?.toDate() || new Date(),
        } as User;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}
