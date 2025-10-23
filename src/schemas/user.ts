import { z } from "zod";

// Base user schema matching BetterAuth database structure
export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    emailVerified: z.boolean().default(false),
    image: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Type inference from schema
export type User = z.infer<typeof userSchema>;

// Schema for user creation (without timestamps and id)
export const createUserSchema = userSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type CreateUser = z.infer<typeof createUserSchema>;

// Schema for user updates (all fields optional except id)
export const updateUserSchema = userSchema.partial().required({ id: true });

export type UpdateUser = z.infer<typeof updateUserSchema>;

// Public user schema (excludes sensitive fields if any)
export const publicUserSchema = userSchema.pick({
    id: true,
    name: true,
    email: true,
    image: true,
    createdAt: true,
});

export type PublicUser = z.infer<typeof publicUserSchema>;
