import { z } from "zod";

// Base tag schema
export const tagSchema = z.object({
	id: z.string(),
	name: z.string().min(1).max(50),
	description: z.string().optional(),
	color: z.string().optional(), // from palette
	userId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Type inference from schema
export type Tag = z.infer<typeof tagSchema>;

// Schema for creating tags
export const createTagSchema = tagSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type CreateTag = z.infer<typeof createTagSchema>;

// Schema for updating tags
export const updateTagSchema = tagSchema.partial().required({ id: true });

export type UpdateTag = z.infer<typeof updateTagSchema>;

// createTagSchema already includes userId, so no need for separate private schema
