# API Design Philosophy for Astronomy Library

## Overview

This document outlines the API design philosophy for the Astronomy Library, covering authentication patterns, data storage strategies, and API response design using Firebase Admin SDK and Next.js App Router.

## Current Architecture

### Authentication System

**Server-Side Session Management**

-   **HTTP-only cookies** for session storage (immune to XSS attacks)
-   **Firebase Admin SDK** for server-side token verification
-   **Middleware-based route protection** for automatic authentication
-   **Server Actions** and **Server Components** for enhanced security

```typescript
// Authentication utilities
export async function requireAuth(): Promise<User> {
    const user = await getCurrentUser();
    if (!user) throw new Error('Authentication required');
    return user;
}

// API route protection
export const GET = withAuth(async (request, context, user) => {
    // Authenticated route logic
});
```

### Data Storage Strategy (Firestore)

**Global Collections with User Ownership**

-   **Global `/projects` collection** with `userId` field for ownership
-   **User references** stored in user documents for efficient lookup
-   **Firebase Admin SDK** for server-side database operations
-   **Atomic operations** for data consistency

```typescript
// Current storage pattern
/projects/{projectId} {
  userId: "user123",
  name: "NGC 7000",
  sessions: { /* embedded session data */ },
  collaborators: ["user456"], // Future collaboration support
  // ... other fields
}
```

### API Response Strategy

**Denormalized Responses with Server-Side Population**

-   **Complete objects** returned in single requests
-   **Server-side data joining** using Firebase Admin SDK
-   **Consistent response format** across all endpoints
-   **Error handling** with proper HTTP status codes

## Core Design Principles

### 1. **Server-First Architecture**

```typescript
// Server Component with direct data access
export default async function ProjectsPage() {
    const user = await requireAuth();
    const projects = await getUserProjects(user.id);

    return (
        <div>
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}

// Server Action for data mutations
async function refreshProjects() {
    'use server';
    revalidatePath('/projects');
}
```

### 2. **Transport Layer Pattern**

**Centralized Data Operations**

-   **`/lib/server/transport/`** for all data access functions
-   **Firebase Admin SDK** for server-side operations
-   **Proper error handling** and logging
-   **TypeScript integration** with Zod schemas

```typescript
// Transport layer example
export async function getUserProjects(userId: string): Promise<Project[]> {
    try {
        const db = await getDb();
        const projectDocs = await db
            .collection('projects')
            .where('userId', '==', userId)
            .orderBy('updatedAt', 'desc')
            .get();

        return projectDocs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Project[];
    } catch (error) {
        console.error('Error fetching user projects:', error);
        return [];
    }
}
```

### 3. **API Route Protection**

**Consistent Authentication Patterns**

-   **`withAuth`** for routes requiring authentication
-   **`withOptionalAuth`** for routes with optional authentication
-   **Proper error responses** for unauthorized access
-   **User context** passed to all handlers

```typescript
// Protected API route
export const GET = withAuth(async (request, context, user) => {
    try {
        const projects = await getUserProjects(user.id);
        return NextResponse.json({
            success: true,
            data: projects,
            count: projects.length,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
});
```

## Data Relationships

### Project-Centric Architecture

**Embedded Session Data**

```typescript
// Project document structure
{
  id: "proj_123",
  userId: "user123",
  name: "NGC 7000 - North America Nebula",
  sessions: {
    "2024-07-15": {
      date: "2024-07-15",
      totalExposureTime: 180,
      numberOfFrames: 36,
      filters: [
        { name: "Ha", exposureTime: 300, frameCount: 20 },
        { name: "OIII", exposureTime: 300, frameCount: 16 }
      ],
      equipmentIds: ["eq_camera", "eq_telescope"],
      seeing: 3,
      transparency: 4,
      notes: "Excellent conditions"
    }
  },
  catalogueDesignation: "NGC 7000",
  tags: ["nebula", "emission"],
  visibility: "private",
  status: "active"
}
```

### Collection References

**Reference-Based Relationships**

```typescript
// Collections reference projects
{
  id: "col_summer2024",
  userId: "user123",
  name: "Summer 2024 Projects",
  projectIds: ["proj_123", "proj_456"]
}
```

## API Response Patterns

### Standard Response Format

```typescript
// Success response
{
  "success": true,
  "data": [...],
  "count": 5,
  "message": "Projects fetched successfully"
}

// Error response
{
  "success": false,
  "error": "Authentication required",
  "code": "AUTH_REQUIRED"
}
```

### Pagination and Filtering

```typescript
// Query parameters
GET /api/projects?limit=10&offset=0&status=active&tags=nebula

// Response with pagination
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

## Performance Considerations

### Caching Strategy

**Next.js Built-in Caching**

-   **Server Component caching** for static data
-   **`revalidatePath()`** for targeted cache invalidation
-   **Server Actions** for optimistic updates

```typescript
// Cache revalidation
async function updateProject(projectId: string, data: UpdateProjectInput) {
    'use server';

    await updateProjectInDb(projectId, data);
    revalidatePath('/projects');
    revalidatePath(`/projects/${projectId}`);
}
```

### Database Optimization

**Firestore Best Practices**

-   **Composite indexes** for complex queries
-   **Batch operations** for multiple updates
-   **Proper field selection** to minimize data transfer
-   **Connection pooling** via Firebase Admin SDK

```typescript
// Optimized query with indexes
const projects = await db
    .collection('projects')
    .where('userId', '==', userId)
    .where('status', '==', 'active')
    .orderBy('updatedAt', 'desc')
    .limit(20)
    .get();
```

## Security Considerations

### Authentication Security

-   **HTTP-only cookies** prevent XSS attacks
-   **Server-side token verification** ensures authenticity
-   **Middleware protection** for automatic route guarding
-   **Session expiration** handling with proper cleanup

### Data Access Control

```typescript
// Access control example
export const GET = withOptionalAuth(async (request, context, user) => {
    const project = await getProjectById(projectId);

    // Check access permissions
    const isOwner = user && project.userId === user.id;
    const isCollaborator = user && project.collaborators?.includes(user.id);
    const isPublic = project.visibility === 'public';

    if (!isPublic && !isOwner && !isCollaborator) {
        return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: project });
});
```

## Migration and Evolution

### Schema Evolution

**Backward Compatibility**

-   **Optional fields** for new features
-   **Default values** for missing properties
-   **Migration scripts** for major changes
-   **Versioned API endpoints** when necessary

### Future Considerations

-   **Real-time updates** via Firestore listeners
-   **Collaboration features** with shared projects
-   **Advanced caching** with Redis or similar
-   **GraphQL integration** for complex queries

This architecture provides a solid foundation for the astronomy library while maintaining security, performance, and developer experience as core priorities.
