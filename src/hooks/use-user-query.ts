import { getUserById } from "@/lib/server/functions/users";
import { useQuery } from "@tanstack/react-query";

export const useUserQuery = (userId: string | undefined) =>
	useQuery({
		queryKey: ["users", userId],
		queryFn: () => {
			if (!userId) throw new Error("User ID required");
			return getUserById({ data: userId });
		},
		enabled: !!userId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

// Export query keys for cache management
export const userQueryKeys = {
	all: ["users"] as const,
	byId: (id: string) => ["users", id] as const,
};
