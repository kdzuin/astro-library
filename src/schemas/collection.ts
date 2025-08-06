import { z } from 'zod';

/**
 * Zod schema for Collection
 *
 * Collections are user-defined sets of projects for organization purposes
 * e.g. "Summer 2024 Projects", "Nebulae Collection", "Work in Progress"
 */
export const collectionSchema = z.object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    coverImageUrl: z.string().optional(),
    projectIds: z.array(z.string()).default([]), // Array of project IDs in this collection
    tags: z.array(z.string()).optional(),
    visibility: z.enum(['public', 'private']).default('private'),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// For cases where you need the exact output type from the schema
export type Collection = z.infer<typeof collectionSchema>;

// Schema for creating a new collection (excludes auto-generated fields)
export const createCollectionSchema = collectionSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;

// Schema for updating a collection (all fields optional except id)
export const updateCollectionSchema = collectionSchema.partial().required({ id: true });

export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
