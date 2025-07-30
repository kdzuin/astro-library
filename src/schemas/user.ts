import { z } from 'zod';

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    displayName: z.string().optional(),
    photoURL: z.url().optional(),
    projects: z.array(z.string()).default([]), // Array of project IDs user owns
    collaboratingProjects: z.array(z.string()).default([]), // Projects user collaborates on
    favoriteProjects: z.array(z.string()).default([]), // Future: favorite projects
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Create user schema (for initial creation)
export const createUserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    displayName: z.string().optional(),
    photoURL: z.url().optional(),
});

// Update user schema (for updates)
export const updateUserSchema = z
    .object({
        displayName: z.string().optional(),
        photoURL: z.url().optional(),
        projects: z.array(z.string()).optional(),
        collaboratingProjects: z.array(z.string()).optional(),
        favoriteProjects: z.array(z.string()).optional(),
    })
    .partial();

// Type exports
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
