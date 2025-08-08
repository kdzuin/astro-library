import { z } from 'zod';

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    displayName: z.string().optional(),
    photoURL: z.url().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const createUserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    displayName: z.string().optional(),
    photoURL: z.url().optional(),
});

export const updateUserSchema = z
    .object({
        displayName: z.string().optional(),
        photoURL: z.url().optional(),
    })
    .partial();

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
