# API Routes vs Transport Layer

This document explains when to use API routes vs transport functions in the Astro Library application.

## Architecture Overview

```
External Clients ──→ API Routes ──→ Transport Layer ──→ Database
                                        ↑
Internal Code (Server Components) ──────┘
```

## When to Use Each Layer

### 🚀 Use Transport Functions (Internal)

**For internal application code that runs on the server:**

- ✅ **Server Components** - Direct data fetching
- ✅ **Server Actions** - Form submissions, mutations
- ✅ **Background jobs** - Cron jobs, scheduled tasks
- ✅ **Internal business logic** - Data processing
- ✅ **Testing** - Easier to mock and test

**Benefits:**
- **Performance**: No HTTP overhead
- **Type Safety**: Full TypeScript support
- **Error Handling**: Native exception handling
- **Caching**: Automatic Next.js caching
- **Authentication**: Direct server-side auth hooks

**Example:**
```typescript
// ✅ Server Component using transport
export default async function ProjectsPage() {
    const user = await requireAuth();
    const projects = await getUserProjects(user.id); // Direct function call
    return <ProjectsList projects={projects} />;
}
```

### 🌐 Use API Routes (External)

**For external clients and HTTP-based interactions:**

- ✅ **External clients** - Mobile apps, third-party services
- ✅ **Client-side JavaScript** - Browser-based data fetching
- ✅ **Webhooks** - External service callbacks
- ✅ **Public API** - Developer-facing endpoints
- ✅ **Cross-origin requests** - Different domains

**Benefits:**
- **Standardized**: REST/HTTP conventions
- **Cacheable**: HTTP cache headers
- **Accessible**: Any HTTP client can use
- **Documented**: OpenAPI/Swagger compatible
- **Versioned**: API versioning strategies

**Example:**
```typescript
// ✅ API Route for external clients
export const GET = withAuth(async (request, context, user) => {
    const projects = await getUserProjects(user.id); // Uses transport internally
    return NextResponse.json({
        success: true,
        data: projects,
        count: projects.length,
    });
});
```

## Implementation Guidelines

### 1. Transport Layer Structure

```
src/lib/server/transport/
├── projects.ts          # Project operations
├── users.ts            # User operations
├── sessions.ts         # Session operations
└── catalogues.ts       # Catalogue operations
```

**Transport functions should:**
- Be pure business logic
- Handle database operations
- Return typed data structures
- Throw meaningful exceptions
- Be easily testable

### 2. API Route Structure

```
src/app/api/
├── projects/
│   ├── route.ts        # GET /api/projects, POST /api/projects
│   └── [id]/route.ts   # GET /api/projects/[id], PUT /api/projects/[id]
├── users/
│   └── route.ts        # User management endpoints
└── auth/
    ├── login/route.ts  # Authentication endpoints
    └── logout/route.ts
```

**API routes should:**
- Be thin wrappers around transport functions
- Handle HTTP concerns (status codes, headers)
- Validate input/output schemas
- Provide consistent error responses
- Include proper authentication

### 3. Code Examples

#### ❌ Don't: Server Component calling API

```typescript
// ❌ Inefficient - HTTP overhead for internal call
export default async function ProjectsPage() {
    const response = await fetch('/api/projects'); // Unnecessary HTTP call
    const data = await response.json();
    return <ProjectsList projects={data.projects} />;
}
```

#### ✅ Do: Server Component using transport

```typescript
// ✅ Efficient - Direct function call
export default async function ProjectsPage() {
    const user = await requireAuth();
    const projects = await getUserProjects(user.id); // Direct call
    return <ProjectsList projects={projects} />;
}
```

#### ✅ Do: Client Component calling API

```typescript
// ✅ Appropriate - Client-side data fetching
'use client';
export function ProjectsClient() {
    const { data: projects } = useSWR('/api/projects', fetcher);
    return <ProjectsList projects={projects} />;
}
```

## Testing Strategy

### Transport Functions
```typescript
// ✅ Easy to test - Mock dependencies directly
vi.mock('@/lib/server/firebase/firestore');
const projects = await getUserProjects('user-123');
expect(projects).toHaveLength(2);
```

### API Routes
```typescript
// ✅ Test HTTP interface - Mock transport functions
vi.mock('@/lib/server/transport/projects', () => ({
    getUserProjects: vi.fn().mockResolvedValue(mockProjects),
}));
const response = await GET(request);
expect(response.status).toBe(200);
```

## Performance Considerations

| Operation | Transport | API Route | Performance Impact |
|-----------|-----------|-----------|-------------------|
| Server Component | ✅ Direct | ❌ HTTP overhead | ~10-50ms saved |
| Client Component | ❌ Not possible | ✅ Standard | Normal |
| Server Action | ✅ Direct | ❌ HTTP overhead | ~10-50ms saved |
| External Client | ❌ Not accessible | ✅ Standard | Normal |

## Security Considerations

### Transport Functions
- Run in server context only
- Direct access to auth context
- No HTTP attack vectors
- Type-safe parameters

### API Routes
- Exposed to HTTP requests
- Require explicit authentication
- Input validation essential
- Rate limiting recommended

## Migration Guidelines

If you have existing code that needs to be migrated:

### From API calls to Transport (Internal)
```typescript
// Before: Internal API call
const response = await fetch('/api/projects');
const data = await response.json();

// After: Direct transport call
const projects = await getUserProjects(user.id);
```

### From Transport to API (External)
```typescript
// Before: Direct transport (not accessible externally)
const projects = await getUserProjects(userId);

// After: API endpoint (accessible externally)
// Create /api/projects route that uses transport internally
```

## Conclusion

This dual-layer approach provides:
- **Optimal performance** for internal operations
- **Standard HTTP interface** for external clients
- **Clear separation of concerns**
- **Easy testing and maintenance**
- **Type safety** where possible
- **Flexibility** for different use cases

Follow these guidelines to maintain a clean, efficient, and maintainable architecture.
