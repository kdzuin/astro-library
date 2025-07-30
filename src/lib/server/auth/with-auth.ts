import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getCurrentUser } from './utils';
import { User } from '@/schemas/user';

export type AuthenticatedHandler = (
    request: NextRequest,
    context: { params?: Record<string, string | string[]> },
    user: User
) => Promise<NextResponse> | NextResponse;

export type OptionalAuthHandler = (
    request: NextRequest,
    context: { params?: Record<string, string | string[]> },
    user: User | null
) => Promise<NextResponse> | NextResponse;

/**
 * Higher-order function that wraps API route handlers with authentication.
 * Requires the user to be authenticated, returns 401 if not.
 */
export function withAuth(handler: AuthenticatedHandler) {
    return async (
        request: NextRequest,
        context: { params?: Record<string, string | string[]> } = {}
    ) => {
        try {
            const user = await requireAuth();
            return await handler(request, context, user);
        } catch (error) {
            console.error('Auth error:', error);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    };
}

/**
 * Higher-order function that wraps API route handlers with optional authentication.
 * Passes the user if authenticated, null if not. Does not return 401.
 */
export function withOptionalAuth(handler: OptionalAuthHandler) {
    return async (
        request: NextRequest,
        context: { params?: Record<string, string | string[]> } = {}
    ) => {
        try {
            const user = await getCurrentUser();
            return await handler(request, context, user);
        } catch (error) {
            console.error('Auth check error:', error);
            return await handler(request, context, null);
        }
    };
}

/**
 * Utility type for extracting the authenticated handler from withAuth
 */
export type WithAuthHandler = ReturnType<typeof withAuth>;

/**
 * Utility type for extracting the optional auth handler from withOptionalAuth
 */
export type WithOptionalAuthHandler = ReturnType<typeof withOptionalAuth>;
