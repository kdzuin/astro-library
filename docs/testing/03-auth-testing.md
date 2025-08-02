# Authentication Testing Guide

This guide covers testing authentication flows, from unit tests to integration tests.

## Overview

Authentication testing in the Astro Library covers:

- **Unit Tests** - Auth utility functions (token validation, session handling)
- **Component Tests** - Auth-related UI components (login forms, user profiles)
- **Integration Tests** - API routes with authentication
- **E2E Tests** - Complete authentication flows

## Auth Testing Levels

### 1. Unit Tests - Auth Utilities

Test pure authentication functions without external dependencies.

#### Example: Email Validation

```typescript
// src/lib/auth/auth-utils.test.ts
import { describe, it, expect } from 'vitest';

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

describe('Auth Utils', () => {
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user+tag@domain.co.uk')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });
});
```

#### Example: Session Management

```typescript
function createSessionData(userId: string, email: string) {
  return {
    userId,
    email,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  };
}

function isSessionExpired(session: { expiresAt: Date }): boolean {
  return session.expiresAt < new Date();
}

describe('Session Management', () => {
  it('creates session with correct structure', () => {
    const session = createSessionData('user-123', 'user@example.com');

    expect(session.userId).toBe('user-123');
    expect(session.email).toBe('user@example.com');
    expect(session.createdAt).toBeInstanceOf(Date);
    expect(session.expiresAt).toBeInstanceOf(Date);
    expect(session.expiresAt.getTime()).toBeGreaterThan(session.createdAt.getTime());
  });

  it('detects expired sessions', () => {
    const expiredSession = {
      expiresAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
    };

    expect(isSessionExpired(expiredSession)).toBe(true);
  });

  it('detects valid sessions', () => {
    const validSession = {
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
    };

    expect(isSessionExpired(validSession)).toBe(false);
  });
});
```

### 2. Component Tests - Auth UI

Test authentication-related components like login forms and user profiles.

#### Example: Login Form

```typescript
// src/components/auth/login-form.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './login-form';

// Mock the auth service
vi.mock('@/lib/auth/auth-service', () => ({
  signInWithEmail: vi.fn(),
}));

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
  });

  it('submits form with valid credentials', async () => {
    const user = userEvent.setup();
    const mockSignIn = vi.fn().mockResolvedValue({ success: true });
    
    // Mock the auth service
    const { signInWithEmail } = await import('@/lib/auth/auth-service');
    vi.mocked(signInWithEmail).mockImplementation(mockSignIn);

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockSignIn).toHaveBeenCalledWith('user@example.com', 'password123');
  });
});
```

#### Example: User Profile Component

```typescript
// src/components/auth/user-profile.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserProfile } from './user-profile';

const mockUser = {
  id: 'user-123',
  email: 'user@example.com',
  displayName: 'John Doe',
  photoURL: 'https://example.com/avatar.jpg',
};

describe('UserProfile', () => {
  it('displays user information when authenticated', () => {
    render(<UserProfile user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  it('shows login prompt when not authenticated', () => {
    render(<UserProfile user={null} />);

    expect(screen.getByText(/please sign in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays user avatar when available', () => {
    render(<UserProfile user={mockUser} />);

    const avatar = screen.getByRole('img', { name: /avatar/i });
    expect(avatar).toHaveAttribute('src', mockUser.photoURL);
  });
});
```

### 3. Integration Tests - API Routes

Test API routes that require authentication.

#### Example: Protected API Route

```typescript
// src/app/api/projects/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

// Mock auth utilities
vi.mock('@/lib/server/firebase/auth', () => ({
  verifySessionCookie: vi.fn(),
}));

vi.mock('@/lib/server/projects', () => ({
  getUserProjects: vi.fn(),
}));

describe('/api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns projects for authenticated user', async () => {
    const { verifySessionCookie } = await import('@/lib/server/firebase/auth');
    const { getUserProjects } = await import('@/lib/server/projects');

    // Mock successful authentication
    vi.mocked(verifySessionCookie).mockResolvedValue({
      uid: 'user-123',
      email: 'user@example.com',
    });

    // Mock project data
    const mockProjects = [
      { id: 'project-1', name: 'NGC 7000', userId: 'user-123' },
    ];
    vi.mocked(getUserProjects).mockResolvedValue(mockProjects);

    // Create mock request with session cookie
    const request = new NextRequest('http://localhost:3000/api/projects', {
      headers: {
        cookie: 'session=valid-session-cookie',
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.projects).toEqual(mockProjects);
    expect(getUserProjects).toHaveBeenCalledWith('user-123');
  });

  it('returns 401 for unauthenticated requests', async () => {
    const { verifySessionCookie } = await import('@/lib/server/firebase/auth');

    // Mock failed authentication
    vi.mocked(verifySessionCookie).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/projects');

    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it('handles missing session cookie', async () => {
    const request = new NextRequest('http://localhost:3000/api/projects');

    const response = await GET(request);

    expect(response.status).toBe(401);
  });
});
```

### 4. Server-Side Hook Tests

Test server-side authentication hooks.

#### Example: useAuth Hook

```typescript
// src/lib/server/auth/use-auth.test.ts
import { describe, it, expect, vi } from 'vitest';
import { useAuth, useRequireAuth } from './use-auth';

// Mock the underlying auth functions
vi.mock('./auth-helpers', () => ({
  getCurrentUser: vi.fn(),
  requireAuth: vi.fn(),
}));

describe('Server Auth Hooks', () => {
  describe('useAuth', () => {
    it('returns user when authenticated', async () => {
      const { getCurrentUser } = await import('./auth-helpers');
      const mockUser = { id: 'user-123', email: 'user@example.com' };
      
      vi.mocked(getCurrentUser).mockResolvedValue(mockUser);

      const result = await useAuth();

      expect(result).toEqual({
        user: mockUser,
        loading: false,
      });
    });

    it('returns null when unauthenticated', async () => {
      const { getCurrentUser } = await import('./auth-helpers');
      
      vi.mocked(getCurrentUser).mockResolvedValue(null);

      const result = await useAuth();

      expect(result).toEqual({
        user: null,
        loading: false,
      });
    });
  });

  describe('useRequireAuth', () => {
    it('returns user when authenticated', async () => {
      const { requireAuth } = await import('./auth-helpers');
      const mockUser = { id: 'user-123', email: 'user@example.com' };
      
      vi.mocked(requireAuth).mockResolvedValue(mockUser);

      const result = await useRequireAuth();

      expect(result).toEqual({
        user: mockUser,
        loading: false,
      });
    });

    it('throws when unauthenticated', async () => {
      const { requireAuth } = await import('./auth-helpers');
      
      vi.mocked(requireAuth).mockRejectedValue(new Error('Unauthorized'));

      await expect(useRequireAuth()).rejects.toThrow('Unauthorized');
    });
  });
});
```

### 5. Middleware Tests

Test authentication middleware that protects routes.

**Important**: The middleware uses simple JWT-like session validation (not Firebase calls) due to Edge Runtime limitations. Tests should reflect this actual implementation.

#### Key Testing Principles

1. **Test actual behavior, not assumptions**
2. **Next.js middleware always returns a response object**
3. **Status codes**: 307 for redirects, 200 with `x-middleware-next: 1` for allowed requests
4. **No Firebase mocking needed** - middleware uses client-side session validation

#### Example: Auth Middleware

```typescript
// src/middleware.test.ts
import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';

// Helper to create valid JWT-like session cookies
function createValidSessionCookie(): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    uid: 'user-123', 
    email: 'user@example.com',
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
  }));
  const signature = 'mock-signature';
  return `${header}.${payload}.${signature}`;
}

function createExpiredSessionCookie(): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    uid: 'user-123', 
    email: 'user@example.com',
    exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago (expired)
  }));
  const signature = 'mock-signature';
  return `${header}.${payload}.${signature}`;
}

describe('Auth Middleware', () => {
  describe('Protected Routes', () => {
    it('allows access to dashboard with valid session', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard', {
        headers: {
          cookie: `session=${createValidSessionCookie()}`
        }
      });

      const response = await middleware(request);

      // Should allow access (NextResponse.next())
      expect(response?.status).toBe(200);
      expect(response?.headers.get('x-middleware-next')).toBe('1');
    });

    it('redirects to home when accessing dashboard without session', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard');

      const response = await middleware(request);

      expect(response?.status).toBe(307); // Next.js uses 307 for redirects
      expect(response?.headers.get('location')).toBe('http://localhost:3000/');
    });

    it('redirects to home with expired session cookie', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard', {
        headers: {
          cookie: `session=${createExpiredSessionCookie()}`
        }
      });

      const response = await middleware(request);

      expect(response?.status).toBe(307);
      expect(response?.headers.get('location')).toBe('http://localhost:3000/');
      // Should also clear the expired cookie
      expect(response?.headers.get('set-cookie')).toContain('session=; Path=/; Expires=');
    });
  });

  describe('Public Routes', () => {
    it('allows access to home page without authentication', async () => {
      const request = new NextRequest('http://localhost:3000/');

      const response = await middleware(request);

      // Should allow access (NextResponse.next())
      expect(response?.status).toBe(200);
      expect(response?.headers.get('x-middleware-next')).toBe('1');
    });

    it('redirects authenticated users from home to dashboard', async () => {
      const request = new NextRequest('http://localhost:3000/', {
        headers: {
          cookie: `session=${createValidSessionCookie()}`
        }
      });

      const response = await middleware(request);

      expect(response?.status).toBe(307);
      expect(response?.headers.get('location')).toBe('http://localhost:3000/dashboard');
    });
  });

  describe('API Routes', () => {
    it('allows API requests (middleware ignores API routes)', async () => {
      const request = new NextRequest('http://localhost:3000/api/projects');

      const response = await middleware(request);

      // API routes are excluded by matcher config, so middleware doesn't run
      expect(response?.status).toBe(200);
      expect(response?.headers.get('x-middleware-next')).toBe('1');
    });
  });
});
```

## Mocking Strategies

### 1. Firebase Auth Mocking

```typescript
// Mock Firebase Admin SDK
vi.mock('firebase-admin/auth', () => ({
  getAuth: vi.fn(() => ({
    verifyIdToken: vi.fn(),
    verifySessionCookie: vi.fn(),
    createSessionCookie: vi.fn(),
  })),
}));

// Mock your auth utilities
vi.mock('@/lib/server/firebase/auth', () => ({
  verifyAuthToken: vi.fn(),
  verifySessionCookie: vi.fn(),
  getFirebaseAuth: vi.fn(),
}));
```

### 2. Next.js Mocking

```typescript
// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  redirect: vi.fn(),
}));

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));
```

### 3. User Context Mocking

```typescript
// Mock user context provider
vi.mock('@/contexts/auth-context', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// In tests, control the mock return value
const mockUseAuth = vi.mocked(useAuth);
mockUseAuth.mockReturnValue({
  user: mockUser,
  loading: false,
  signIn: vi.fn(),
  signOut: vi.fn(),
});
```

## TDD Workflow for Auth

### 1. Red - Write Failing Test

```typescript
it('redirects to login when session expires', async () => {
  // This test will fail initially
  const expiredRequest = createExpiredSessionRequest();
  const response = await middleware(expiredRequest);
  
  expect(response?.status).toBe(302);
  expect(response?.headers.get('location')).toBe('/login');
});
```

### 2. Green - Make Test Pass

```typescript
// Add session expiration check to middleware
export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  
  if (sessionCookie) {
    const decodedToken = await verifySessionCookie(sessionCookie);
    
    // Check if session is expired
    if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // ... rest of middleware logic
}
```

### 3. Refactor - Improve Code

```typescript
// Extract session validation logic
async function validateSession(sessionCookie: string): Promise<boolean> {
  try {
    const decodedToken = await verifySessionCookie(sessionCookie);
    return decodedToken && decodedToken.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
```

## Running Auth Tests

```bash
# Run all auth tests
npm run test auth

# Run specific auth test file
npm run test auth-utils.test.ts

# Run tests in watch mode
npm run test:watch auth

# Run with coverage
npm run test:coverage
```

## Common Auth Test Patterns

### 1. Test Authentication States

```typescript
describe('Component with Auth', () => {
  it('shows content when authenticated', () => {
    render(<ProtectedComponent user={mockUser} />);
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('shows login prompt when unauthenticated', () => {
    render(<ProtectedComponent user={null} />);
    expect(screen.getByText('Please log in')).toBeInTheDocument();
  });
});
```

### 2. Test Error Handling

```typescript
it('handles authentication errors gracefully', async () => {
  const mockSignIn = vi.fn().mockRejectedValue(new Error('Invalid credentials'));
  
  render(<LoginForm onSignIn={mockSignIn} />);
  
  // Trigger sign in
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  
  expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
});
```

### 3. Test Loading States

```typescript
it('shows loading state during authentication', () => {
  render(<LoginForm loading={true} />);
  
  expect(screen.getByRole('button')).toBeDisabled();
  expect(screen.getByText(/signing in/i)).toBeInTheDocument();
});
```

## Best Practices

1. **Test user flows, not implementation details**
2. **Mock external dependencies (Firebase, APIs)**
3. **Test both success and error cases**
4. **Use realistic test data**
5. **Test loading and error states**
6. **Keep tests focused and isolated**

## Next Steps

- **Read**: [API Testing](./04-api-testing.md)
- **Practice**: Write tests for your auth components
- **Extend**: Add E2E auth tests with Playwright

## Resources

- [Firebase Testing Guide](https://firebase.google.com/docs/rules/unit-tests)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)
- [React Testing Library Auth Examples](https://testing-library.com/docs/example-react-router/)
