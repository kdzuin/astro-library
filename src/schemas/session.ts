import { z } from 'zod';

export const sessionSchema = z.object({
    id: z.string(),
    userId: z.string(),
    projectId: z.string(),
    date: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

// Schema for creating a new session (excludes server-generated fields)
export const createSessionSchema = sessionSchema.omit({
    id: true,
    userId: true,
    projectId: true,
});

export const updateSessionSchema = sessionSchema.omit({
    id: true,
    userId: true,
    projectId: true,
});

export type Session = z.infer<typeof sessionSchema>;
export type CreateSession = z.infer<typeof createSessionSchema>;
export type UpdateSession = z.infer<typeof updateSessionSchema>;
