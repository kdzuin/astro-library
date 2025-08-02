import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth, useRequireAuth } from './use-auth';
import { User } from '@/schemas/user';

// Mock the auth utils
vi.mock('./utils', () => ({
    getCurrentUser: vi.fn(),
    requireAuth: vi.fn(),
}));

describe('Auth Hooks (Fixed)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useAuth', () => {
        it('returns user when authenticated', async () => {
            // ✅ Correct mock user matching User schema
            const mockUser: User = {
                id: 'user-123',
                email: 'user@example.com',
                displayName: 'Test User',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            };

            const { getCurrentUser } = await import('./utils');
            vi.mocked(getCurrentUser).mockResolvedValue(mockUser);

            const result = await useAuth();

            expect(result).toEqual({
                user: mockUser,
                loading: false,
            });
            expect(getCurrentUser).toHaveBeenCalled();
        });

        it('returns null when not authenticated', async () => {
            const { getCurrentUser } = await import('./utils');
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
            const mockUser: User = {
                id: 'user-123',
                email: 'user@example.com',
                displayName: 'Test User',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            };

            const { requireAuth } = await import('./utils');
            vi.mocked(requireAuth).mockResolvedValue(mockUser);

            const result = await useRequireAuth();

            expect(result).toEqual({
                user: mockUser,
                loading: false,
            });
            expect(requireAuth).toHaveBeenCalled();
        });

        it('throws error when not authenticated', async () => {
            const { requireAuth } = await import('./utils');
            vi.mocked(requireAuth).mockRejectedValue(new Error('Unauthorized'));

            await expect(useRequireAuth()).rejects.toThrow('Unauthorized');
        });
    });
});
