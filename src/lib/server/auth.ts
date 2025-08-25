import { createServerFn } from "@tanstack/react-start";
import { getAuthenticatedAppForUser } from "./firebase/serverApp";
import type { AppUser } from "@/schemas/app-user";

export const authFn = createServerFn({ method: "GET" })
	.validator(() => ({}))
	.handler(async () => {
		try {
			const { currentUser } = await getAuthenticatedAppForUser();

			// Extract only serializable user data matching AppUser schema
			const appUser: Partial<AppUser> | null = currentUser
				? {
						id: currentUser.uid,
						email: currentUser.email || "",
						displayName: currentUser.displayName || undefined,
						photoURL: currentUser.photoURL || undefined,
					}
				: null;

			return { currentUser: appUser };
		} catch (error) {
			console.error("Authentication error:", error);
			return { currentUser: null };
		}
	});
