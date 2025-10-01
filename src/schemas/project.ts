import { z } from "zod";
import { tagSchema } from "./tag";

// Base project schema for a database table
export const projectSchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string(),
	description: z.string().optional().nullable(),
	status: z
		.enum(["planning", "active", "processing", "completed"])
		.default("planning"),
	totalExposureTime: z.number().optional().nullable(), // in seconds
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Extended project schema with tags (for API responses)
export const projectWithTagsSchema = projectSchema.extend({
	tags: z.array(tagSchema).optional(),
});

// Schema for creating projects
export const createProjectSchema = projectSchema.omit({
	createdAt: true,
	updatedAt: true,
});

// Schema for updating projects
export const updateProjectSchema = projectSchema
	.omit({
		id: true,
		userId: true,
		createdAt: true,
		updatedAt: true,
	})
	.partial();

// Schema for project-tag association
export const projectTagSchema = z.object({
	id: z.string(),
	projectId: z.string(),
	tagId: z.string(),
	createdAt: z.date(),
});

// Schema for creating project-tag associations
export const createProjectTagSchema = projectTagSchema.omit({
	id: true,
	createdAt: true,
});

// Type exports
export type Project = z.infer<typeof projectSchema>;
export type ProjectWithTags = z.infer<typeof projectWithTagsSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type ProjectTag = z.infer<typeof projectTagSchema>;
export type CreateProjectTag = z.infer<typeof createProjectTagSchema>;
