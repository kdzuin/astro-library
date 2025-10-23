import { getUserById } from "@/lib/server/functions/users";
import type { User } from "@/schemas/user";
import { useQuery } from "@tanstack/react-query";

/**
 * Query hook to fetch a user by ID
 * @param userId
 */
export const useUserQuery = (userId: string | undefined) =>
    useQuery<User | null, Error>({
        queryKey: ["users", userId],
        queryFn: () => {
            if (!userId) throw new Error("User ID required");
            return getUserById({ data: userId });
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

/**
 * Query cache keys for users
 */
export const userQueryKeys = {
    all: ["users"] as const,
    byId: (id: string) => ["users", id] as const,
};
