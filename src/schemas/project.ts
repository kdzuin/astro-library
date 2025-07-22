import { z } from 'zod';

/**
 * Zod schema for Project
 *
 * This schema validates and transforms API data to match the Project type from @/types
 * It handles date serialization/deserialization automatically
 */
export const projectSchema = z.object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    coverImageUrl: z.string().optional(),
    visibility: z.enum(['public', 'private']).default('private'),
});

// For cases where you need the exact output type from the schema
export type Project = z.infer<typeof projectSchema>;
