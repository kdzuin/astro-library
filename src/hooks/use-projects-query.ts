import {
	getProjectById,
	getProjectsByUserId,
} from "@/lib/server/functions/projects";
import type { Project } from "@/schemas/project";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

export const useProjectsByUserQuery = (
	userId: string,
	options?: Partial<UseQueryOptions<Project[], Error>>,
) =>
	useQuery<Project[], Error>({
		queryKey: projectQueryKeys.byUser(userId),
		queryFn: () => {
			if (!userId) throw new Error("User ID required");
			return getProjectsByUserId({ data: userId });
		},
		enabled: !!userId,
		staleTime: 5 * 60 * 1000,
		gcTime: 30 * 60 * 1000,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		...options,
	});

export const useProjectByIdQuery = (projectId: string) =>
	useQuery<Project | null, Error>({
		queryKey: projectQueryKeys.byId(projectId),
		queryFn: () => {
			if (!projectId) throw new Error("Project ID required");
			return getProjectById({ data: projectId });
		},
		enabled: !!projectId,
		staleTime: 10 * 60 * 1000,
		gcTime: 60 * 60 * 1000,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});

export const projectQueryKeys = {
	all: ["projects"] as const,
	byUser: (userId: string) => ["projects", "by-user", userId] as const,
	byId: (id: string) => ["projects", "by-id", id] as const,
};
