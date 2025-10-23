import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { userSchema, type User } from "@/schemas/user";
import { eq } from "drizzle-orm";

export const getUserById = createServerFn({ method: "GET" })
    .validator((userId: string) => userId)
    .handler(async ({ data: userId }): Promise<User | null> => {
        try {
            const result = await db
                .select()
                .from(user)
                .where(eq(user.id, userId))
                .limit(1);

            if (result.length === 0) {
                return null;
            }

            const userData = result[0];

            // Validate the data using Zod schema with safeParse
            const validationResult = userSchema.safeParse(userData);

            if (!validationResult.success) {
                console.error(
                    "User data validation failed:",
                    validationResult.error,
                );
                return null;
            }

            return validationResult.data;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw new Error("Failed to fetch user data");
        }
    });
