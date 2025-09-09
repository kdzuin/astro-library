import { z } from "zod";

export const appUserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	name: z.string().optional(),
	image: z.url().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const createAppUserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	name: z.string().optional(),
	image: z.url().optional(),
});

export const updateAppUserSchema = z
	.object({
		name: z.string().optional(),
		image: z.url().optional(),
	})
	.partial();

export type AppUser = z.infer<typeof appUserSchema>;
export type CreateAppUserInput = z.infer<typeof createAppUserSchema>;
export type UpdateAppUserInput = z.infer<typeof updateAppUserSchema>;
