import { z } from 'zod';

/**
 * Acquisition Details Schema
 * 
 * Acquisition details are stored as a subcollection under sessions.
 * Each row represents one set of exposures with specific settings.
 */

// Base acquisition details data that gets stored in Firestore
export const acquisitionDetailsBaseSchema = z.object({
    filterName: z.string().optional(), // Custom filter name (filterId ignored for now)
    numberOfExposures: z.number().min(1, 'Must have at least 1 exposure'),
    exposureTime: z.number().min(0.1, 'Exposure time must be at least 0.1 seconds'), // in seconds
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

// Full acquisition details data with id, projectId, userId, and sessionId (added by transport layer)
export const acquisitionDetailsDataSchema = acquisitionDetailsBaseSchema.extend({
    id: z.string(), // Firestore document ID
    projectId: z.string(), // Project ID (added by transport layer)
    userId: z.string(), // User ID (added by transport layer)
    sessionId: z.string(), // Session ID (added by transport layer)
});

// For cases where you need the exact output type from the schema
export type AcquisitionDetailsData = z.infer<typeof acquisitionDetailsDataSchema>;

// Schema for creating new acquisition details (all fields optional except required ones)
export const createAcquisitionDetailsSchema = acquisitionDetailsBaseSchema.omit({
    createdAt: true,
    updatedAt: true,
});

export type CreateAcquisitionDetailsInput = z.infer<typeof createAcquisitionDetailsSchema>;

// Schema for updating acquisition details (all fields optional)
export const updateAcquisitionDetailsSchema = acquisitionDetailsBaseSchema.partial();

export type UpdateAcquisitionDetailsInput = z.infer<typeof updateAcquisitionDetailsSchema>;
