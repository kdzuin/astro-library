import { z } from 'zod';

export const projectSchema = z.object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    visibility: z.enum(['public', 'private']).default('private'),
    status: z.enum(['planning', 'active', 'processing', 'completed']).default('planning'),
    totalExposureTime: z.number().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const createProjectSchema = projectSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export const updateProjectSchema = projectSchema.omit({
    id: true,
    userId: true,
    totalExposureTime: true,
    createdAt: true,
    updatedAt: true,
});

export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
