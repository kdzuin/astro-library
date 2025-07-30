import { z } from 'zod';

/**
 * Zod schema for astronomical Catalogue
 *
 * Catalogues can be:
 * - System catalogues: NGC, Messier, Caldwell, IC, etc. (managed by system)
 * - User catalogues: Custom catalogues created by users for organization
 */
export const catalogueSchema = z.object({
    id: z.string(),
    name: z.string(), // e.g. "NGC", "Messier", "My Summer Targets"
    description: z.string().optional(),
    
    // Catalogue type and ownership
    type: z.enum(['system', 'user']).default('user'),
    userId: z.string().optional(), // null for system catalogues, userId for user catalogues
    
    // System catalogue metadata
    abbreviation: z.string().optional(), // e.g. "NGC", "M", "C", "IC"
    prefix: z.string().optional(), // Prefix used in designations, e.g. "NGC ", "M", "C"
    
    // Visual and organizational
    coverImageUrl: z.string().optional(),
    tags: z.array(z.string()).default([]),
    visibility: z.enum(['public', 'private']).default('public'), // System catalogues are public
    
    // Metadata
    objectCount: z.number().default(0), // Number of objects in this catalogue
    createdAt: z.date(),
    updatedAt: z.date(),
});

// For cases where you need the exact output type from the schema
export type Catalogue = z.infer<typeof catalogueSchema>;

// Schema for creating a new catalogue (excludes auto-generated fields)
export const createCatalogueSchema = catalogueSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type CreateCatalogueInput = z.infer<typeof createCatalogueSchema>;

// Schema for updating a catalogue (all fields optional except id)
export const updateCatalogueSchema = catalogueSchema.partial().required({ id: true });

export type UpdateCatalogueInput = z.infer<typeof updateCatalogueSchema>;
