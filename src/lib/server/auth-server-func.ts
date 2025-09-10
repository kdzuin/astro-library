import { authMiddleware } from "@/lib/server/auth-middleware";
import { createServerFn } from "@tanstack/react-start";

export const getUserId = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		return context?.user?.id;
	});

export const getUserInfo = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		if (!context?.user || !context?.user.id) {
			return null;
		}

		return {
			id: context.user.id,
			name: context.user.name,
			email: context.user.email,
			image: context.user.image,
		};
	});
