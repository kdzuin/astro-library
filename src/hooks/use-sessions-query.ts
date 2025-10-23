import {
    getSessionById,
    getSessionsByProjectId,
    getSessionsByUserId,
} from "@/lib/server/functions/sessions.ts";
import type { Session } from "@/schemas/session.ts";
import { useQuery } from "@tanstack/react-query";

/**
 * Query Hook to fetch sessions by user ID
 * @param userId
 */
export const useSessionsByUserQuery = (userId: string) =>
    useQuery<{ sessions: Session[] }, Error>({
        queryKey: sessionsQueryKeys.byUser(userId),
        queryFn: () => {
            if (!userId) throw new Error("User ID required");
            return getSessionsByUserId({ data: userId });
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });

/**
 * Query Hook to fetch a single session by ID
 * @param sessionId
 */
export const useSessionByIdQuery = (sessionId: string) =>
    useQuery<Session | null, Error>({
        queryKey: sessionsQueryKeys.byId(sessionId),
        queryFn: () => {
            if (!sessionId) throw new Error("Session ID required");
            return getSessionById({ data: sessionId });
        },
        enabled: !!sessionId,
        staleTime: 10 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });

/**
 * Query Hook to fetch sessions by project ID
 * @params projectId
 */
export const useSessionsByProjectQuery = (projectId: string) =>
    useQuery<{ sessions: Session[] }, Error>({
        queryKey: sessionsQueryKeys.byProject(projectId),
        queryFn: () => {
            if (!projectId) throw new Error("Project ID required");
            return getSessionsByProjectId({ data: projectId });
        },
        enabled: !!projectId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });

/**
 * Query cache keys for projects
 */
export const sessionsQueryKeys = {
    all: ["sessions"] as const,
    byUser: (userId: string) => ["sessions", "by-user", userId] as const,
    byId: (id: string) => ["sessions", "by-id", id] as const,
    byProject: (projectId: string) =>
        ["sessions", "by-project", projectId] as const,
};
