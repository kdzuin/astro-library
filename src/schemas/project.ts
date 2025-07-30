import { z } from 'zod';
import { sessionDataSchema } from './session';

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
    catalogueId: z.string().optional(), // Reference to NGC, Messier, Caldwell, or user catalogue
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

    // Session data - map of YYYY-MM-DD dates to session data
    sessions: z.record(z.string(), sessionDataSchema).default({}), // Key: YYYY-MM-DD, Value: SessionData

    // Metadata
    visibility: z.enum(['public', 'private']).default('private'),
    status: z.enum(['planning', 'active', 'processing', 'completed']).default('planning'),

    createdAt: z.date(),
    updatedAt: z.date(),
});

// For cases where you need the exact output type from the schema
export type Project = z.infer<typeof projectSchema>;

// Schema for creating a new project (excludes auto-generated fields)
export const createProjectSchema = projectSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// Schema for updating a project (all fields optional except id)
export const updateProjectSchema = projectSchema.partial().required({ id: true });

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
