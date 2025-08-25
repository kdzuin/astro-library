import { onIdTokenChanged } from "@/lib/client/auth";
import { deleteCookieFn, setCookieFn } from "@/lib/server/functions/cookies";
import type { AppUser } from "@/schemas/app-user";
import { useEffect } from "react";

export function useUserSession(initialUser?: Partial<AppUser> | null) {
	useEffect(() => {
		return onIdTokenChanged(async (user) => {
			if (user) {
				const idToken = await user.getIdToken();
				await setCookieFn({ data: { name: "__session", value: idToken } });
			} else {
				await deleteCookieFn({ data: { name: "__session" } });
			}
			if (initialUser?.id === user?.uid) {
				return;
			}
			window.location.reload();
		});
	}, [initialUser]);

	return initialUser;
}
