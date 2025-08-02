# API Testing Guide

This guide covers testing Next.js API routes, from simple endpoints to complex authentication-protected routes.

## Overview

API testing in the Astro Library covers:

- **Unit Tests** - Individual API route handlers
- **Integration Tests** - API routes with database/external services
- **Authentication Tests** - Protected API endpoints
- **Error Handling** - Various error scenarios
- **Request/Response Validation** - Input validation and output formatting

## API Route Testing Structure

### 1. Basic API Route Test

```typescript
// src/app/api/health/route.test.ts
import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('/api/health', () => {
  it('returns health status', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      status: 'healthy',
      timestamp: expect.any(String),
    });
  });
});
```

### 2. API Route with Request Parameters

```typescript
// src/app/api/projects/[id]/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from './route';

// Mock dependencies
vi.mock('@/lib/server/projects', () => ({
  getProjectById: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}));

vi.mock('@/lib/server/firebase/auth', () => ({
  verifySessionCookie: vi.fn(),
}));

describe('/api/projects/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('returns project by ID', async () => {
      const { getProjectById } = await import('@/lib/server/projects');
      const mockProject = {
        id: 'project-123',
        name: 'NGC 7000',
        userId: 'user-123',
      };

      vi.mocked(getProjectById).mockResolvedValue(mockProject);

      const response = await GET(
        new NextRequest('http://localhost:3000/api/projects/project-123'),
        { params: { id: 'project-123' } }
      );

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.project).toEqual(mockProject);
      expect(getProjectById).toHaveBeenCalledWith('project-123');
    });

    it('returns 404 for non-existent project', async () => {
      const { getProjectById } = await import('@/lib/server/projects');
      
      vi.mocked(getProjectById).mockResolvedValue(null);

      const response = await GET(
        new NextRequest('http://localhost:3000/api/projects/non-existent'),
        { params: { id: 'non-existent' } }
      );

      expect(response.status).toBe(404);
    });
  });
});
```

## Testing Different HTTP Methods

### 1. POST Request Testing

```typescript
// src/app/api/projects/route.test.ts
import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

describe('POST /api/projects', () => {
  it('creates new project with valid data', async () => {
    const { createProject } = await import('@/lib/server/projects');
    const { verifySessionCookie } = await import('@/lib/server/firebase/auth');

    // Mock authentication
    vi.mocked(verifySessionCookie).mockResolvedValue({
      uid: 'user-123',
      email: 'user@example.com',
    });

    // Mock project creation
    const newProject = {
      id: 'project-456',
      name: 'M31 - Andromeda Galaxy',
      userId: 'user-123',
    };
    vi.mocked(createProject).mockResolvedValue(newProject);

    // Create request with JSON body
    const requestBody = {
      name: 'M31 - Andromeda Galaxy',
      description: 'The nearest spiral galaxy to the Milky Way',
      visibility: 'public',
    };

    const request = new NextRequest('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: 'session=valid-session-cookie',
      },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.project).toEqual(newProject);
    expect(createProject).toHaveBeenCalledWith({
      ...requestBody,
      userId: 'user-123',
    });
  });

  it('validates required fields', async () => {
    const { verifySessionCookie } = await import('@/lib/server/firebase/auth');

    vi.mocked(verifySessionCookie).mockResolvedValue({
      uid: 'user-123',
      email: 'user@example.com',
    });

    // Request with missing required field
    const request = new NextRequest('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: 'session=valid-session-cookie',
      },
      body: JSON.stringify({
        description: 'Missing name field',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('name');
  });
});
```

### 2. PUT Request Testing

```typescript
describe('PUT /api/projects/[id]', () => {
  it('updates existing project', async () => {
    const { updateProject, getProjectById } = await import('@/lib/server/projects');
    const { verifySessionCookie } = await import('@/lib/server/firebase/auth');

    // Mock authentication
    vi.mocked(verifySessionCookie).mockResolvedValue({
      uid: 'user-123',
      email: 'user@example.com',
    });

    // Mock existing project (for ownership check)
    vi.mocked(getProjectById).mockResolvedValue({
      id: 'project-123',
      userId: 'user-123',
      name: 'Old Name',
    });

    // Mock update
    const updatedProject = {
      id: 'project-123',
      userId: 'user-123',
      name: 'New Name',
    };
    vi.mocked(updateProject).mockResolvedValue(updatedProject);

    const request = new NextRequest('http://localhost:3000/api/projects/project-123', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        cookie: 'session=valid-session-cookie',
      },
      body: JSON.stringify({ name: 'New Name' }),
    });

    const response = await PUT(request, { params: { id: 'project-123' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.project).toEqual(updatedProject);
  });

  it('prevents updating other users projects', async () => {
    const { getProjectById } = await import('@/lib/server/projects');
    const { verifySessionCookie } = await import('@/lib/server/firebase/auth');

    vi.mocked(verifySessionCookie).mockResolvedValue({
      uid: 'user-123',
      email: 'user@example.com',
    });

    // Mock project owned by different user
    vi.mocked(getProjectById).mockResolvedValue({
      id: 'project-123',
      userId: 'other-user',
      name: 'Other User Project',
    });

    const request = new NextRequest('http://localhost:3000/api/projects/project-123', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        cookie: 'session=valid-session-cookie',
      },
      body: JSON.stringify({ name: 'Hacked Name' }),
    });

    const response = await PUT(request, { params: { id: 'project-123' } });

    expect(response.status).toBe(403);
  });
});
```

### 3. DELETE Request Testing

```typescript
describe('DELETE /api/projects/[id]', () => {
  it('deletes project successfully', async () => {
    const { deleteProject, getProjectById } = await import('@/lib/server/projects');
    const { verifySessionCookie } = await import('@/lib/server/firebase/auth');

    vi.mocked(verifySessionCookie).mockResolvedValue({
      uid: 'user-123',
      email: 'user@example.com',
    });

    vi.mocked(getProjectById).mockResolvedValue({
      id: 'project-123',
      userId: 'user-123',
      name: 'Project to Delete',
    });

    vi.mocked(deleteProject).mockResolvedValue(true);

    const request = new NextRequest('http://localhost:3000/api/projects/project-123', {
      method: 'DELETE',
      headers: {
        cookie: 'session=valid-session-cookie',
      },
    });

    const response = await DELETE(request, { params: { id: 'project-123' } });

    expect(response.status).toBe(204);
    expect(deleteProject).toHaveBeenCalledWith('project-123');
  });
});
```

## Testing Authentication in API Routes

### 1. Protected Route Testing

```typescript
// src/app/api/projects/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock auth utilities BEFORE importing the route
vi.mock('@/lib/server/auth/auth-utils', () => ({
  requireAuth: vi.fn(),
  getCurrentUser: vi.fn(),
}));

// Mock transport functions to avoid Firestore calls
vi.mock('@/lib/server/user/utils', () => ({
  getUserProjects: vi.fn(),
}));

// Import route AFTER mocking dependencies
import { GET } from './route';

describe('/api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns projects for authenticated user', async () => {
    const { requireAuth } = await import('@/lib/server/auth/auth-utils');
    const { getUserProjects } = await import('@/lib/server/user/utils');

    // Mock authenticated user
    const mockUser = {
      id: 'user-123',
      email: 'user@example.com',
      displayName: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(requireAuth).mockResolvedValue(mockUser);

    // Mock projects data
    const mockProjects = [
      {
        id: 'project-1',
        name: 'NGC 7000',
        description: 'North America Nebula',
        userId: 'user-123',
        visibility: 'public' as const,
        status: 'active' as const,
        tags: ['nebula'],
        sessions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    vi.mocked(getUserProjects).mockResolvedValue(mockProjects);

    const request = new NextRequest('http://localhost:3000/api/projects');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.projects).toEqual(mockProjects);
    expect(requireAuth).toHaveBeenCalled();
    expect(getUserProjects).toHaveBeenCalledWith('user-123');
  });

  it('returns 401 for unauthenticated requests', async () => {
    const { requireAuth } = await import('@/lib/server/auth/auth-utils');
    
    // Mock authentication failure
    vi.mocked(requireAuth).mockRejectedValue(new Error('Unauthorized'));

    const request = new NextRequest('http://localhost:3000/api/projects');
    const response = await GET(request);

    expect(response.status).toBe(401);
  });
});
```

### 2. Role-Based Access Testing

```typescript
describe('Admin API Route', () => {
  it('allows access for admin users', async () => {
    const { verifySessionCookie } = await import('@/lib/server/firebase/auth');
    const { getUserRole } = await import('@/lib/server/users');
    
    vi.mocked(verifySessionCookie).mockResolvedValue({
      uid: 'admin-user',
      email: 'admin@example.com',
    });

    vi.mocked(getUserRole).mockResolvedValue('admin');

    const request = new NextRequest('http://localhost:3000/api/admin/users', {
      headers: {
        cookie: 'session=admin-session-cookie',
      },
    });

    const response = await GET(request);

    expect(response.status).toBe(200);
  });

  it('denies access for regular users', async () => {
    const { verifySessionCookie } = await import('@/lib/server/firebase/auth');
    const { getUserRole } = await import('@/lib/server/users');
    
    vi.mocked(verifySessionCookie).mockResolvedValue({
      uid: 'regular-user',
      email: 'user@example.com',
    });

    vi.mocked(getUserRole).mockResolvedValue('user');

    const request = new NextRequest('http://localhost:3000/api/admin/users', {
      headers: {
        cookie: 'session=user-session-cookie',
      },
    });

    const response = await GET(request);

    expect(response.status).toBe(403);
  });
});
```

## Testing Input Validation

### 1. Request Body Validation

```typescript
describe('Input Validation', () => {
  it('validates email format', async () => {
    const request = new NextRequest('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email',
        name: 'John Doe',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('email');
  });

  it('validates required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@example.com',
        // Missing required 'name' field
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('name');
  });

  it('validates field length limits', async () => {
    const request = new NextRequest('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: 'session=valid-session-cookie',
      },
      body: JSON.stringify({
        name: 'x'.repeat(256), // Exceeds 255 character limit
        description: 'Valid description',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('name');
  });
});
```

### 2. Query Parameter Validation

```typescript
describe('Query Parameter Validation', () => {
  it('validates pagination parameters', async () => {
    const request = new NextRequest('http://localhost:3000/api/projects?page=-1&limit=1000');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/page|limit/);
  });

  it('handles missing optional parameters', async () => {
    const request = new NextRequest('http://localhost:3000/api/projects');

    const response = await GET(request);

    expect(response.status).toBe(200);
    // Should use default pagination values
  });
});
```

## Testing Error Handling

### 1. Database Errors

```typescript
describe('Error Handling', () => {
  it('handles database connection errors', async () => {
    const { getProjects } = await import('@/lib/server/projects');
    
    vi.mocked(getProjects).mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/projects');

    const response = await GET(request);

    expect(response.status).toBe(500);
  });

  it('handles validation errors gracefully', async () => {
    const { createProject } = await import('@/lib/server/projects');
    
    vi.mocked(createProject).mockRejectedValue(new Error('Validation failed: name is required'));

    const request = new NextRequest('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: 'session=valid-session-cookie',
      },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('name is required');
  });
});
```

### 2. External Service Errors

```typescript
describe('External Service Integration', () => {
  it('handles third-party API failures', async () => {
    const { uploadToCloudStorage } = await import('@/lib/server/storage');
    
    vi.mocked(uploadToCloudStorage).mockRejectedValue(new Error('Storage service unavailable'));

    const request = new NextRequest('http://localhost:3000/api/upload', {
      method: 'POST',
      body: new FormData(), // Mock file upload
    });

    const response = await POST(request);

    expect(response.status).toBe(503); // Service Unavailable
  });
});
```

## Testing Response Formats

### 1. Success Response Format

```typescript
describe('Response Formats', () => {
  it('returns consistent success format', async () => {
    const { getProjects } = await import('@/lib/server/projects');
    
    vi.mocked(getProjects).mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/projects');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('projects');
    expect(data).toHaveProperty('pagination');
    expect(Array.isArray(data.projects)).toBe(true);
  });
});
```

### 2. Error Response Format

```typescript
describe('Error Response Format', () => {
  it('returns consistent error format', async () => {
    const request = new NextRequest('http://localhost:3000/api/projects/invalid-id');

    const response = await GET(request, { params: { id: 'invalid-id' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error');
    expect(data).toHaveProperty('message');
    expect(typeof data.error).toBe('string');
  });
});
```

## Testing File Uploads

### 1. File Upload API Testing

```typescript
describe('File Upload API', () => {
  it('handles valid file uploads', async () => {
    const { uploadFile } = await import('@/lib/server/storage');
    
    vi.mocked(uploadFile).mockResolvedValue({
      url: 'https://storage.example.com/file.jpg',
      filename: 'file.jpg',
    });

    // Create mock FormData
    const formData = new FormData();
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    formData.append('file', file);

    const request = new NextRequest('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.url).toBe('https://storage.example.com/file.jpg');
  });

  it('rejects invalid file types', async () => {
    const formData = new FormData();
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    formData.append('file', file);

    const request = new NextRequest('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
```

## Testing Pagination and Filtering

### 1. Pagination Testing

```typescript
describe('Pagination', () => {
  it('returns paginated results', async () => {
    const { getProjects } = await import('@/lib/server/projects');
    
    const mockProjects = Array.from({ length: 5 }, (_, i) => ({
      id: `project-${i}`,
      name: `Project ${i}`,
    }));

    vi.mocked(getProjects).mockResolvedValue({
      projects: mockProjects,
      total: 25,
      page: 1,
      limit: 5,
    });

    const request = new NextRequest('http://localhost:3000/api/projects?page=1&limit=5');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.projects).toHaveLength(5);
    expect(data.pagination).toEqual({
      total: 25,
      page: 1,
      limit: 5,
      totalPages: 5,
    });
  });
});
```

### 2. Filtering Testing

```typescript
describe('Filtering', () => {
  it('filters projects by status', async () => {
    const { getProjects } = await import('@/lib/server/projects');
    
    const activeProjects = [
      { id: 'project-1', name: 'Active Project 1', status: 'active' },
      { id: 'project-2', name: 'Active Project 2', status: 'active' },
    ];

    vi.mocked(getProjects).mockResolvedValue({
      projects: activeProjects,
      total: 2,
    });

    const request = new NextRequest('http://localhost:3000/api/projects?status=active');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.projects).toHaveLength(2);
    expect(data.projects.every(p => p.status === 'active')).toBe(true);
    expect(getProjects).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'active' })
    );
  });
});
```

## Running API Tests

```bash
# Run all API tests
npm run test api

# Run specific API route tests
npm run test projects/route.test.ts

# Run tests in watch mode
npm run test:watch api

# Run with coverage
npm run test:coverage
```

## Test Utilities for APIs

### 1. Request Helper Functions

```typescript
// src/test/api-helpers.ts
import { NextRequest } from 'next/server';

export function createAuthenticatedRequest(
  url: string,
  options: RequestInit = {}
): NextRequest {
  return new NextRequest(url, {
    ...options,
    headers: {
      ...options.headers,
      cookie: 'session=valid-session-cookie',
    },
  });
}

export function createJsonRequest(
  url: string,
  body: object,
  options: RequestInit = {}
): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
  });
}
```

### 2. Mock Data Factories

```typescript
// src/test/factories.ts
export function createMockProject(overrides = {}) {
  return {
    id: 'project-123',
    userId: 'user-123',
    name: 'NGC 7000',
    description: 'North America Nebula',
    status: 'active',
    visibility: 'public',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createMockUser(overrides = {}) {
  return {
    id: 'user-123',
    email: 'user@example.com',
    displayName: 'John Doe',
    role: 'user',
    ...overrides,
  };
}
```

## Best Practices

1. **Test all HTTP methods** your API supports
2. **Mock external dependencies** (database, third-party APIs)
3. **Test authentication and authorization** thoroughly
4. **Validate input and output** formats
5. **Test error scenarios** and edge cases
6. **Use realistic test data** that matches your schema
7. **Test pagination and filtering** logic
8. **Keep tests isolated** and independent

## Common Patterns

### 1. Setup and Teardown

```typescript
describe('API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset any global state
  });

  afterEach(() => {
    // Clean up if needed
  });
});
```

### 2. Parameterized Tests

```typescript
describe('Input Validation', () => {
  it.each([
    ['', 'Name is required'],
    ['x'.repeat(256), 'Name is too long'],
    ['   ', 'Name cannot be empty'],
  ])('validates name: "%s" should return "%s"', async (name, expectedError) => {
    const request = createJsonRequest('http://localhost:3000/api/projects', {
      name,
      description: 'Valid description',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain(expectedError);
  });
});
```

## Next Steps

- **Practice**: Write tests for your existing API routes
- **Extend**: Add integration tests with real database
- **Automate**: Set up CI/CD pipeline for API testing

## Resources

- [Next.js API Testing](https://nextjs.org/docs/app/building-your-application/testing)
- [Vitest API Testing Examples](https://vitest.dev/guide/testing-types.html#testing-apis)
- [HTTP Status Codes Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
