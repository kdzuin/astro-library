import { createServerFn } from "@tanstack/react-start";
import { getFirestore } from "@/lib/server/firebase/admin";
import { type AppUser, appUserSchema } from "@/schemas/app-user";

export const getUserById = createServerFn({ method: "GET" })
	.validator((userId: string) => userId)
	.handler(async ({ data: userId }): Promise<AppUser | null> => {
		const adminDb = getFirestore();
		
		try {
			const userDoc = await adminDb.collection("users").doc(userId).get();

			if (!userDoc.exists) {
				return null;
			}

			const userData = userDoc.data();
			if (!userData) {
				return null;
			}

			const result = appUserSchema.safeParse({
				id: userDoc.id,
				...userData,
				createdAt: userData.createdAt?.toDate() || new Date(),
				updatedAt: userData.updatedAt?.toDate() || new Date(),
			});

			if (!result.success) {
				console.error("Invalid user data:", result.error);
				return null;
			}

			return result.data;
		} catch (error) {
			console.error("Error fetching user:", error);
			throw new Error("Failed to fetch user data");
		}
	});

export const ensureUserExists = createServerFn({ method: "POST" })
	.validator((userData: {
		id: string;
		email: string;
		displayName?: string;
		photoURL?: string;
	}) => userData)
	.handler(async ({ data: userData }): Promise<AppUser> => {
		const adminDb = getFirestore();
		
		try {
			const userRef = adminDb.collection("users").doc(userData.id);
			const userDoc = await userRef.get();

			if (userDoc.exists) {
				// User exists, return existing data
				const existingData = userDoc.data();
				if (existingData) {
					const result = appUserSchema.safeParse({
						id: userDoc.id,
						...existingData,
						createdAt: existingData.createdAt?.toDate() || new Date(),
						updatedAt: existingData.updatedAt?.toDate() || new Date(),
					});

					if (result.success) {
						return result.data;
					}
				}
			}

			// User doesn't exist or data is invalid, create new user
			const now = new Date();
			const newUser: AppUser = {
				id: userData.id,
				email: userData.email,
				displayName: userData.displayName,
				photoURL: userData.photoURL,
				createdAt: now,
				updatedAt: now,
			};

			await userRef.set({
				email: newUser.email,
				displayName: newUser.displayName,
				photoURL: newUser.photoURL,
				createdAt: now,
				updatedAt: now,
			});

			return newUser;
		} catch (error) {
			console.error("Error ensuring user exists:", error);
			throw new Error("Failed to create or fetch user");
		}
	});
