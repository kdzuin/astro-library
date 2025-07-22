import { z } from 'zod';

export const userSchema = z.object({
    id: z.string(),
    email: z.string(),
    displayName: z.string().optional(),
    photoURL: z.string().optional(),
    createdAt: z.date(),
});

// For cases where you need the exact output type from the schema
export type User = z.infer<typeof userSchema>;
