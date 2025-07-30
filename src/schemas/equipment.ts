import { z } from 'zod';

/**
 * Zod schema for astronomical Equipment
 *
 * Equipment represents user-specific gear used in imaging sessions
 * Categories: Cameras, Telescopes/Lenses, Filters, Mounts, etc.
 */
export const equipmentSchema = z.object({
    id: z.string(),
    userId: z.string().optional(),

    // Equipment identification
    name: z.string(), // e.g. "Canon EOS Ra", "Celestron EdgeHD 11", "Baader Ha 7nm"
    category: z.enum([
        'camera',
        'telescope',
        'lens',
        'filter',
        'mount',
        'focuser',
        'guide_camera',
        'guide_scope',
        'field_flattener',
        'reducer',
        'other',
    ]),
    manufacturer: z.string().optional(),
    model: z.string().optional(),

    // Technical specifications (varies by category)
    specifications: z.record(z.string(), z.union([z.string(), z.number()])).default({}),
    // Examples:
    // Camera: { "sensor": "APS-C", "megapixels": 32.5, "cooling": "yes" }
    // Telescope: { "aperture": 280, "focal_length": 2800, "f_ratio": 10 }
    // Filter: { "wavelength": "656nm", "bandwidth": "7nm", "type": "narrowband" }
    // Mount: { "payload": "50kg", "goto": "yes", "tracking": "yes" }

    // Organization and metadata
    description: z.string().optional(),
    imageUrl: z.string().optional(), // Photo of the equipment
    purchaseDate: z.date().optional(),
    purchasePrice: z.number().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).default([]),

    // Status
    status: z.enum(['active', 'retired', 'maintenance', 'sold']).default('active'),

    createdAt: z.date(),
    updatedAt: z.date(),
});

// For cases where you need the exact output type from the schema
export type Equipment = z.infer<typeof equipmentSchema>;

// Schema for creating new equipment (excludes auto-generated fields)
export const createEquipmentSchema = equipmentSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>;

// Schema for updating equipment (all fields optional except id)
export const updateEquipmentSchema = equipmentSchema.partial().required({ id: true });

export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>;
