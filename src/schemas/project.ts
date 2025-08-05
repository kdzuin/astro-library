import { z } from 'zod';

/**
 * Zod schema for astronomical imaging Project
 *
 * Projects are main entities (e.g. NGC7000) that users work on.
 * They have sessions, can be assigned to collections/catalogues,
 * and include processing sections and final galleries.
 */
export const projectSchema = z.object({
    id: z.string(),
    userId: z.string(),
    name: z.string(), // e.g. "NGC 7000 - North America Nebula"
    description: z.string().optional(),

    // Catalogue assignment (optional)
    catalogueDesignation: z.string().optional(), // e.g. "NGC 7000", "M31", "C20"

    // Collection assignment (optional)
    collectionIds: z.array(z.string()).default([]), // Can belong to multiple collections

    // Visual elements
    coverImageUrl: z.string().optional(),
    tags: z.array(z.string()).default([]), // e.g. ["nebula", "emission", "summer"]

    // Processing section
    processingNotes: z.string().optional(),
    processingImageUrls: z.array(z.string()).default([]), // Work-in-progress images

    // Final gallery
    finalImageUrls: z.array(z.string()).default([]), // Final processed images

    // Metadata
    visibility: z.enum(['public', 'private']).default('private'),
    status: z.enum(['planning', 'active', 'processing', 'completed']).default('planning'),

    totalExposureTime: z.number().default(0),

    createdAt: z.date(),
    updatedAt: z.date(),
});

// Schema for creating a new project (excludes server-generated fields)
export const createProjectSchema = projectSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

// For cases where you need the exact output type from the schema
export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
