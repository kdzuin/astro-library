import { z } from 'zod';
import { projectSchema } from './project';
import { sessionDataSchema } from './session';
import { equipmentSchema } from './equipment';
import { collectionSchema } from './collection';

/**
 * API Response Schemas for Denormalized Data
 *
 * These schemas define how the API should return populated/denormalized data
 * to clients, even though Firestore stores normalized references.
 *
 * The API does the heavy lifting of populating relationships.
 */

// Project with populated relationships
export const projectWithRelationsSchema = projectSchema.extend({
    // Populated collections (if assigned to any)
    collections: z.array(collectionSchema).default([]),

    // Equipment used across all sessions (aggregated)
    equipmentUsed: z.array(equipmentSchema).default([]),
});

export type ProjectWithRelations = z.infer<typeof projectWithRelationsSchema>;

// Session data with populated equipment (sessions are now part of projects)
export const sessionWithEquipmentSchema = sessionDataSchema.extend({
    // Populated equipment used
    equipment: z.array(equipmentSchema).default([]),
});

export type SessionWithEquipment = z.infer<typeof sessionWithEquipmentSchema>;

// Collection with populated projects
export const collectionWithRelationsSchema = collectionSchema.extend({
    // Populated projects in this collection
    projects: z.array(projectSchema).default([]),
});

export type CollectionWithRelations = z.infer<typeof collectionWithRelationsSchema>;

// Equipment with usage statistics
export const equipmentWithUsageSchema = equipmentSchema.extend({
    // Usage statistics
    sessionCount: z.number().default(0),
    totalExposureTime: z.number().default(0), // in minutes
    lastUsed: z.date().optional(),

    // Recent session dates where this equipment was used
    recentSessionDates: z.array(z.string()).default([]), // YYYY-MM-DD dates
});

export type EquipmentWithUsage = z.infer<typeof equipmentWithUsageSchema>;

// API Response wrappers
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.boolean().default(true),
        data: dataSchema,
        message: z.string().optional(),
        timestamp: z.date().default(() => new Date()),
    });

export const apiErrorResponseSchema = z.object({
    success: z.boolean().default(false),
    error: z.string(),
    details: z.string().optional(),
    timestamp: z.date().default(() => new Date()),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        success: z.boolean().default(true),
        data: z.array(itemSchema),
        pagination: z.object({
            page: z.number(),
            limit: z.number(),
            total: z.number(),
            totalPages: z.number(),
            hasNext: z.boolean(),
            hasPrev: z.boolean(),
        }),
        timestamp: z.date().default(() => new Date()),
    });

// Specific API response types
export type ApiResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
    timestamp: Date;
};

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export type PaginatedResponse<T> = {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    timestamp: Date;
};
