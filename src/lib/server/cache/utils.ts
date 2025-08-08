'use server';

import { revalidateTag } from 'next/cache';

/**
 * Cache invalidation utilities for the astro-library application
 *
 * These functions help manage cache invalidation when data is updated,
 * ensuring users see fresh data after mutations.
 */

/**
 * Invalidate all project-related caches
 * Call this after creating, updating, or deleting projects
 */
export async function invalidateProjectsCache(): Promise<void> {
    revalidateTag('projects');
}

/**
 * Invalidate all session-related caches
 * Call this after creating, updating, or deleting sessions
 */
export async function invalidateSessionsCache(): Promise<void> {
    revalidateTag('sessions');
}

/**
 * Invalidate both projects and sessions caches
 * Useful for operations that affect both data types
 */
export async function invalidateAllCache(): Promise<void> {
    revalidateTag('projects');
    revalidateTag('sessions');
}

/**
 * Invalidate cache for a specific user's projects
 * More granular invalidation when only one user's data changes
 */
export async function invalidateUserProjectsCache(): Promise<void> {
    // For now, we invalidate all projects cache
    // In the future, we could implement user-specific cache keys
    revalidateTag('projects');
}

/**
 * Invalidate cache for a specific project's sessions
 * More granular invalidation when only one project's sessions change
 */
export async function invalidateProjectSessionsCache(): Promise<void> {
    // For now, we invalidate all sessions cache
    // In the future, we could implement project-specific cache keys
    revalidateTag('sessions');
}
