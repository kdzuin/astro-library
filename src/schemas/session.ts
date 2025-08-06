import { z } from 'zod';

/**
 * Session Data Schema
 *
 * Sessions are just YYYY-MM-DD date values associated with projects.
 * Session data (acquisition info, equipment, conditions) is stored within the project.
 */

export const sessionDateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format');

export type SessionDate = z.infer<typeof sessionDateSchema>;

// Base session data that gets stored in Firestore (without id and projectId)
export const sessionBaseSchema = z.object({
    date: sessionDateSchema, // YYYY-MM-DD
    location: z.string().optional(), // Imaging location
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

// Full session data with id, projectId, and userId (added by transport layer)
export const sessionDataSchema = sessionBaseSchema.extend({
    id: z.string(), // Firestore document ID
    projectId: z.string(), // Project ID (added by transport layer)
    userId: z.string(), // User ID (added by transport layer)
});

// For cases where you need the exact output type from the schema
export type SessionData = z.infer<typeof sessionDataSchema>;

// Schema for creating new session data (all fields optional except date)
export const createSessionDataSchema = sessionBaseSchema.partial().required({ date: true });

export type CreateSessionDataInput = z.infer<typeof createSessionDataSchema>;

// Schema for updating session data (all fields optional)
export const updateSessionDataSchema = sessionBaseSchema.partial();

export type UpdateSessionDataInput = z.infer<typeof updateSessionDataSchema>;
