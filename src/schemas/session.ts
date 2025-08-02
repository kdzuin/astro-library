import { z } from 'zod';

/**
 * Session Data Schema
 *
 * Sessions are just YYYY-MM-DD date values associated with projects.
 * Session data (acquisition info, equipment, conditions) is stored within the project.
 */

// Session is now just a date string in YYYY-MM-DD format
export const sessionDateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format');

export type SessionDate = z.infer<typeof sessionDateSchema>;

// Session data that gets stored within a project for a specific date
export const sessionDataSchema = z.object({
    date: sessionDateSchema, // YYYY-MM-DD
    location: z.string().optional(), // Imaging location

    // Filter/wavelength data
    filters: z
        .array(
            z.object({
                name: z.string(), // e.g. "Ha", "OIII", "SII", "L", "R", "G", "B"
                exposureTime: z.number(), // Individual exposure time in seconds
                frameCount: z.number(), // Number of frames for this filter
            })
        )
        .default([]),

    // Equipment used (references to Equipment entities)
    equipmentIds: z.array(z.string()).default([]), // References to equipment used

    // Environmental conditions
    seeing: z.number().optional(), // Seeing conditions (1-5 scale)
    transparency: z.number().optional(), // Sky transparency (1-5 scale)
    temperature: z.number().optional(), // Temperature in Celsius
    humidity: z.number().optional(), // Humidity percentage

    // Session notes and issues
    notes: z.string().optional(),
    issues: z.string().optional(), // Any issues encountered during the session

    // Metadata
    tags: z.array(z.string()).default([]),
});

// For cases where you need the exact output type from the schema
export type SessionData = z.infer<typeof sessionDataSchema>;

// Schema for creating new session data (all fields optional except date)
export const createSessionDataSchema = sessionDataSchema.partial().required({ date: true });

export type CreateSessionDataInput = z.infer<typeof createSessionDataSchema>;

// Schema for updating session data (all fields optional)
export const updateSessionDataSchema = sessionDataSchema.partial();

export type UpdateSessionDataInput = z.infer<typeof updateSessionDataSchema>;
