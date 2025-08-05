import { z } from 'zod';
import { sessionDataSchema, SessionData } from './session';

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

    // Session data - map of YYYY-MM-DD dates to session data
    sessions: z.record(z.string(), sessionDataSchema).default({}), // Key: YYYY-MM-DD, Value: SessionData

    // Metadata
    visibility: z.enum(['public', 'private']).default('private'),
    status: z.enum(['planning', 'active', 'processing', 'completed']).default('planning'),

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

// Derived types for working with project sessions
export type ProjectSessions = Project['sessions']; // Record<string, SessionData>
export type ProjectSessionsArray = SessionData[]; // Array version for components that prefer arrays
export type ProjectSessionEntry = [string, SessionData]; // [date, sessionData] tuple
