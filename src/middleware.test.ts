import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';

// Helper to create a valid JWT-like session cookie
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

    it('redirects to home with invalid session cookie', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard', {
        headers: {
          cookie: 'session=invalid-short-cookie'
        }
      });

      const response = await middleware(request);

      expect(response?.status).toBe(307);
      expect(response?.headers.get('location')).toBe('http://localhost:3000/');
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
