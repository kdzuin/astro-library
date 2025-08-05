# Authentication Flow Documentation

## Overview

This document explains the complete authentication flow for the Astronomy Library, covering client-side authentication, server-side session management, and API route protection using Firebase Admin SDK with HTTP-only cookies.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │  Server Side    │    │   API Routes    │
│                 │    │                 │    │                 │
│ - Firebase Auth │───▶│ - Session Mgmt  │───▶│ - withAuth()    │
│ - Sign In UI    │    │ - HTTP Cookies  │    │ - Route Guard   │
│ - Token Mgmt    │    │ - Middleware    │    │ - User Context  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Authentication Components

### 1. Firebase Configuration (`/lib/firebase/config.ts`)

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### 2. Server-Side Auth Utilities (`/lib/server/auth/auth-utils.ts`)

```typescript
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';

// Create session cookie from Firebase ID token
export async function createSessionCookie(idToken: string): Promise<string> {
  const firebaseAuth = getAuth();
  await firebaseAuth.verifyIdToken(idToken);
  return await firebaseAuth.createSessionCookie(idToken, {
    expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
  });
}

// Verify session cookie and return user
export async function getCurrentUser(): Promise<User | null> {
  const sessionCookie = await getSessionCookie();
  if (!sessionCookie) return null;
  
  return await verifySessionCookie(sessionCookie);
}

// Require authentication (throws if not authenticated)
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Authentication required');
  return user;
}
```

## Authentication Flow

### 1. Client-Side Authentication Flow

#### Sign In Process

```typescript
// 1. User clicks "Sign In with Google"
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const signInWithGoogle = async () => {
  try {
    // 2. Firebase handles OAuth flow
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    
    // 3. Get ID token from Firebase
    const idToken = await result.user.getIdToken();
    
    // 4. Send token to server to create session
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    
    if (response.ok) {
      // 5. Redirect to dashboard (middleware will handle)
      window.location.href = '/dashboard';
    }
  } catch (error) {
    console.error('Sign in failed:', error);
  }
};
```

#### Sign Out Process

```typescript
const signOut = async () => {
  try {
    // 1. Sign out from Firebase client
    await firebaseSignOut(auth);
    
    // 2. Clear server session
    await fetch('/api/auth/logout', { method: 'POST' });
    
    // 3. Redirect to home
    window.location.href = '/';
  } catch (error) {
    console.error('Sign out failed:', error);
  }
};
```

### 2. Server-Side Session Management

#### Login API Route (`/api/auth/login/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createSessionCookie, setSessionCookie } from '@/lib/server/auth/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    
    // 1. Verify ID token and create session cookie
    const sessionCookie = await createSessionCookie(idToken);
    
    // 2. Set HTTP-only cookie
    await setSessionCookie(sessionCookie);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
```

#### Logout API Route (`/api/auth/logout/route.ts`)

```typescript
export async function POST() {
  try {
    // Clear the session cookie
    await clearSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
```

#### Middleware (`/middleware.ts`)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  const hasSession = !!sessionCookie?.value;

  // Redirect authenticated users from home to dashboard
  if (hasSession && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect dashboard routes
  if (!hasSession && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 3. API Route Protection

#### withAuth Higher-Order Function (`/lib/server/auth/with-auth.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from './auth-utils';

export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest, context: { params?: any } = {}) => {
    try {
      // 1. Verify session and get user
      const user = await requireAuth();
      
      // 2. Call the actual handler with user context
      return await handler(request, context, user);
    } catch (error) {
      // 3. Return 401 if authentication fails
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  };
}
```

#### Protected API Route Example

```typescript
// /api/projects/route.ts
import { withAuth } from '@/lib/server/auth/with-auth';

export const GET = withAuth(async (request, context, user) => {
  // User is guaranteed to be authenticated here
  const projects = await getProjectsForUser(user.id);
  return NextResponse.json({ projects });
});

export const POST = withAuth(async (request, context, user) => {
  const body = await request.json();
  const project = await createProject({
    ...body,
    userId: user.id, // Ensure project belongs to authenticated user
  });
  return NextResponse.json({ project });
});
```

## Security Features

### 1. HTTP-Only Cookies

```typescript
// Session cookies are HTTP-only (immune to XSS)
cookieStore.set('session', sessionCookie, {
  httpOnly: true,           // Cannot be accessed via JavaScript
  secure: true,             // HTTPS only in production
  sameSite: 'lax',         // CSRF protection
  maxAge: 5 * 24 * 60 * 60, // 5 days
  path: '/',               // Available site-wide
});
```

### 2. Server-Side Token Validation

- All authentication happens server-side
- Firebase Admin SDK validates tokens
- No client-side auth state management needed
- Session cookies automatically included in requests

### 3. Route Protection Layers

1. **Middleware**: Protects page routes, redirects unauthenticated users
2. **API Guards**: `withAuth()` protects API endpoints
3. **Component Guards**: Server components can use `requireAuth()`

## Authentication States

### Authenticated User Flow

```
1. User signs in with Google
2. Firebase returns ID token
3. Client sends token to /api/auth/login
4. Server creates session cookie
5. Middleware redirects to /dashboard
6. API routes receive authenticated requests
7. Server components can access user context
```

### Unauthenticated User Flow

```
1. User visits protected route
2. Middleware checks session cookie
3. No valid session found
4. Redirect to home page
5. API requests return 401 Unauthorized
6. User sees sign-in prompt
```

## Error Handling

### Client-Side Error Handling

```typescript
// Handle authentication errors
const handleAuthError = (error: any) => {
  if (error.code === 'auth/popup-closed-by-user') {
    // User closed the popup
    return;
  }
  
  if (error.code === 'auth/network-request-failed') {
    // Network error
    showError('Network error. Please try again.');
    return;
  }
  
  // Generic error
  showError('Authentication failed. Please try again.');
};
```

### Server-Side Error Handling

```typescript
// API route error handling
export const GET = withAuth(async (request, context, user) => {
  try {
    // Your logic here
  } catch (error) {
    console.error('API Error:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
```

## Environment Variables Required

```env
# Firebase Client Config (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Firebase Admin SDK (Private)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Testing Authentication

### Manual Testing

1. **Sign In Flow**:
   - Visit home page
   - Click "Sign In with Google"
   - Complete OAuth flow
   - Should redirect to dashboard

2. **Protected Routes**:
   - Try accessing `/dashboard` without signing in
   - Should redirect to home page

3. **API Protection**:
   - Make API request without authentication
   - Should receive 401 Unauthorized

4. **Sign Out Flow**:
   - Sign out from dashboard
   - Should redirect to home page
   - Try accessing protected routes (should be blocked)

### Automated Testing

```typescript
// Example test for API protection
describe('API Authentication', () => {
  it('should return 401 for unauthenticated requests', async () => {
    const response = await fetch('/api/projects');
    expect(response.status).toBe(401);
  });

  it('should allow authenticated requests', async () => {
    const response = await fetch('/api/projects', {
      headers: {
        Cookie: 'session=valid_session_cookie'
      }
    });
    expect(response.status).toBe(200);
  });
});
```

## Best Practices

1. **Always use HTTPS in production** for secure cookie transmission
2. **Validate tokens server-side** - never trust client-side auth state
3. **Use HTTP-only cookies** to prevent XSS attacks
4. **Implement proper error handling** for auth failures
5. **Log authentication events** for security monitoring
6. **Set appropriate cookie expiration** times
7. **Use middleware for route protection** to avoid code duplication

## Troubleshooting

### Common Issues

1. **"Authentication required" errors**:
   - Check if session cookie is being set correctly
   - Verify Firebase Admin SDK configuration
   - Ensure ID token is valid

2. **Redirect loops**:
   - Check middleware matcher patterns
   - Verify session cookie validation logic

3. **CORS issues**:
   - Ensure proper domain configuration in Firebase
   - Check cookie SameSite settings

4. **Token expiration**:
   - Implement token refresh logic if needed
   - Handle expired session gracefully
