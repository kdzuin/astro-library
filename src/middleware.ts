import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simple session validity check for Edge Runtime
 * Note: We can't do full Firebase verification in middleware due to Edge Runtime limitations
 * This is a basic check - full verification happens in server components
 */
function isSessionLikelyValid(sessionCookie: string): boolean {
    try {
        // Basic checks for session cookie format
        if (!sessionCookie || sessionCookie.length < 10) {
            return false;
        }
        
        // Check if it looks like a JWT (has dots)
        const parts = sessionCookie.split('.');
        if (parts.length !== 3) {
            return false;
        }
        
        // Try to decode the payload to check expiration
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        
        // Check if token is expired
        if (payload.exp && payload.exp < now) {
            return false;
        }
        
        return true;
    } catch {
        // If we can't parse it, assume it's invalid
        return false;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get session cookie
    const sessionCookie = request.cookies.get('session');
    const hasValidSession = sessionCookie?.value && isSessionLikelyValid(sessionCookie.value);

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/projects', '/equipment', '/catalogues'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Redirect users with invalid/expired sessions away from protected routes
    if (!hasValidSession && isProtectedRoute) {
        const response = NextResponse.redirect(new URL('/', request.url));
        // Clear the invalid session cookie
        response.cookies.delete('session');
        return response;
    }

    // Redirect authenticated users from home page to dashboard
    if (hasValidSession && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
