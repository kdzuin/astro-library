# Caching Strategy Implementation

This document outlines the caching strategy implemented in the astro-library project using Next.js's `unstable_cache` API.

## Overview

We've implemented a comprehensive caching strategy to improve performance by reducing database queries for frequently accessed data. The implementation focuses on the transport layer functions that interact with Firebase Firestore.

## Cached Functions

### Projects Transport (`src/lib/server/transport/projects.ts`)

| Function                | Cache Key          | Cache Duration    | Tags       |
| ----------------------- | ------------------ | ----------------- | ---------- |
| `getProjectsByUserId()` | `projects-by-user` | 5 minutes (300s)  | `projects` |
| `getProjectById()`      | `project-by-id`    | 10 minutes (600s) | `projects` |

### Sessions Transport (`src/lib/server/transport/sessions.ts`)

| Function                   | Cache Key             | Cache Duration   | Tags       |
| -------------------------- | --------------------- | ---------------- | ---------- |
| `getSessionsByProjectId()` | `sessions-by-project` | 3 minutes (180s) | `sessions` |
| `getSessionById()`         | `session-by-id`       | 5 minutes (300s) | `sessions` |

## Cache Invalidation

Cache invalidation is automatically handled when data is modified through the following mutation functions:

### Projects

-   `createProject()` - Invalidates all project caches
-   `updateProject()` - Invalidates all project caches
-   `deleteProject()` - Invalidates all project caches

### Sessions

-   `addSession()` - Invalidates all session caches
-   `updateSessionWithAcquisitionDetails()` - Invalidates all session caches

## Cache Utilities

The `src/lib/server/cache/utils.ts` file provides helper functions for cache management:

-   `invalidateProjectsCache()` - Invalidates all project-related caches
-   `invalidateSessionsCache()` - Invalidates all session-related caches
-   `invalidateAllCache()` - Invalidates both projects and sessions caches
-   `invalidateUserProjectsCache()` - Future: User-specific invalidation
-   `invalidateProjectSessionsCache()` - Future: Project-specific invalidation

## Implementation Details

### Cache Configuration

Each cached function uses the following pattern:

```typescript
const getCachedFunctionName = unstable_cache(
    async (params) => {
        // Original function logic
    },
    ['cache-key'],
    {
        tags: ['tag-name'],
        revalidate: 300, // Cache duration in seconds
    }
);
```

### Cache Keys and Tags

-   **Cache Keys**: Unique identifiers for each cached function
-   **Tags**: Used for bulk invalidation of related caches
-   **Revalidate**: Time-based cache expiration in seconds

### Cache Duration Strategy

-   **Projects**: Longer cache duration (5-10 minutes) as project data changes less frequently
-   **Sessions**: Shorter cache duration (3-5 minutes) as session data is more dynamic
-   **Individual items**: Longer cache than lists to optimize single-item lookups

## Benefits

1. **Reduced Database Load**: Fewer Firestore queries for frequently accessed data
2. **Improved Performance**: Faster response times for cached data
3. **Automatic Invalidation**: Cache is automatically cleared when data changes
4. **Scalable**: Can handle increased traffic without proportional database load

## Future Enhancements

1. **User-Specific Caching**: Implement user-specific cache keys for more granular invalidation
2. **Project-Specific Caching**: Implement project-specific cache keys for sessions
3. **Cache Metrics**: Add monitoring for cache hit rates and performance
4. **Background Revalidation**: Implement ISR-style background revalidation for critical data

## Testing Cache Behavior

To test the caching implementation:

1. **Cache Hits**: Make repeated requests to the same data - subsequent requests should be faster
2. **Cache Invalidation**: Modify data and verify that fresh data is returned immediately
3. **Cache Expiration**: Wait for cache duration to expire and verify data is refreshed

## Important Notes

-   `unstable_cache` is currently an experimental Next.js API
-   Cache is stored in memory and will be cleared on server restart
-   In production, consider implementing Redis or similar for persistent caching
-   Monitor cache performance and adjust durations based on usage patterns

## Troubleshooting

If you experience stale data:

1. Check that mutation functions are calling the appropriate invalidation functions
2. Verify cache tags are correctly configured
3. Consider reducing cache duration for frequently changing data
4. Use `invalidateAllCache()` for debugging purposes
