import { type AppUser, appUserSchema } from "@/schemas/app-user";
import { createServerFn } from "@tanstack/react-start";

export const getUserById = createServerFn({ method: "GET" })
	.validator((userId: string) => userId)
	.handler(async ({ data: userId }): Promise<AppUser | null> => {
		try {
			throw new Error("Not implemented");
		} catch (error) {
			console.error("Error fetching user:", error);
			throw new Error("Failed to fetch user data");
		}
	});

export const ensureUserExists = createServerFn({ method: "POST" })
	.validator(
		(userData: {
			id: string;
			email: string;
			displayName?: string;
			photoURL?: string;
		}) => userData,
	)
	.handler(async ({ data: userData }): Promise<AppUser> => {
		try {
			throw new Error("Not implemented");
		} catch (error) {
			console.error("Error ensuring user exists:", error);
			throw new Error("Failed to create or fetch user");
		}
	});
