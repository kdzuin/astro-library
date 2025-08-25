import { z } from "zod";

export const appUserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	displayName: z.string().optional(),
	photoURL: z.url().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const createAppUserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	displayName: z.string().optional(),
	photoURL: z.url().optional(),
});

export const updateAppUserSchema = z
	.object({
		displayName: z.string().optional(),
		photoURL: z.url().optional(),
	})
	.partial();

export type AppUser = z.infer<typeof appUserSchema>;
export type CreateAppUserInput = z.infer<typeof createAppUserSchema>;
export type UpdateAppUserInput = z.infer<typeof updateAppUserSchema>;
