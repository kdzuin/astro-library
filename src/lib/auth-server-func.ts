import { authMiddleware } from "@/lib/auth-middleware";
import { createServerFn } from "@tanstack/react-start";

export const getUserId = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		return context?.user?.id;
	});

export const getUserInfo = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		return {
			id: context?.user?.id,
			name: context?.user?.name,
			image: context?.user?.image,
		};
	});
