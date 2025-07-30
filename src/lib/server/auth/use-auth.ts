import { getCurrentUser, requireAuth } from './utils';
import { User } from '@/schemas/user';

/**
 * Server-side hook to get the current authenticated user
 * Returns null if not authenticated
 */
export async function useAuth(): Promise<{ user: User | null; loading: false }> {
    const user = await getCurrentUser();
    return { user, loading: false };
}

/**
 * Server-side hook that requires authentication
 * Throws an error if not authenticated
 */
export async function useRequireAuth(): Promise<{ user: User; loading: false }> {
    const user = await requireAuth();
    return { user, loading: false };
}
