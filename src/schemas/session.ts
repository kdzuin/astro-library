import { z } from "zod";
import { tagSchema } from "./tag";

// Base session schema for database table
export const sessionSchema = z.object({
	id: z.string(),
	userId: z.string(),
	projectId: z.string(),
	date: z.string(),
	description: z.string().optional().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Extended session schema with tags (for API responses)
export const sessionWithTagsSchema = sessionSchema.extend({
	tags: z.array(tagSchema).optional().nullable(),
});

// Schema for creating a new session (excludes server-generated fields)
export const createSessionSchema = sessionSchema.omit({
	createdAt: true,
	updatedAt: true,
});

// Schema for updating sessions
export const updateSessionSchema = sessionSchema
	.omit({
		id: true,
		userId: true,
		createdAt: true,
		updatedAt: true,
	})
	.partial();

// Schema for session-tag association
export const sessionTagSchema = z.object({
	id: z.string(),
	sessionId: z.string(),
	tagId: z.string(),
	createdAt: z.date(),
});

// Schema for creating session-tag associations
export const createSessionTagSchema = sessionTagSchema.omit({
	id: true,
	createdAt: true,
});

// Type exports
export type Session = z.infer<typeof sessionSchema>;
export type SessionWithTags = z.infer<typeof sessionWithTagsSchema>;
export type CreateSession = z.infer<typeof createSessionSchema>;
export type UpdateSession = z.infer<typeof updateSessionSchema>;
export type SessionTag = z.infer<typeof sessionTagSchema>;
export type CreateSessionTag = z.infer<typeof createSessionTagSchema>;
