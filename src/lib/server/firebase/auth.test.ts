import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyAuthToken, verifySessionCookie } from './auth';

// Mock Firebase Admin
vi.mock('firebase-admin/auth', () => ({
    getAuth: vi.fn(),
}));

vi.mock('./admin', () => ({
    getAdminApp: vi.fn(),
}));

describe('Firebase Auth Utils', () => {
    const mockAuth = {
        verifyIdToken: vi.fn(),
        verifySessionCookie: vi.fn(),
    };

    beforeEach(async () => {
        vi.clearAllMocks();

        // Mock getAuth to return our mock auth instance
        const { getAuth } = await import('firebase-admin/auth');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(getAuth).mockReturnValue(mockAuth as any);

        const { getAdminApp } = await import('./admin');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(getAdminApp).mockResolvedValue({} as any);
    });

    describe('verifyAuthToken', () => {
        it('returns user ID for valid token', async () => {
            const mockToken = 'valid-token';
            const mockDecodedToken = { uid: 'user-123' };

            mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken);

            const result = await verifyAuthToken(mockToken);

            expect(result).toBe('user-123');
            expect(mockAuth.verifyIdToken).toHaveBeenCalledWith(mockToken);
        });

        it('returns null for invalid token', async () => {
            const mockToken = 'invalid-token';

            mockAuth.verifyIdToken.mockRejectedValue(new Error('Invalid token'));

            const result = await verifyAuthToken(mockToken);

            expect(result).toBeNull();
        });

        it('handles empty token', async () => {
            const result = await verifyAuthToken('');

            expect(result).toBeNull();
        });
    });

    describe('verifySessionCookie', () => {
        it('returns decoded token for valid session cookie', async () => {
            const mockCookie = 'valid-session-cookie';
            const mockDecodedToken = {
                uid: 'user-123',
                email: 'user@example.com',
            };

            mockAuth.verifySessionCookie.mockResolvedValue(mockDecodedToken);

            const result = await verifySessionCookie(mockCookie);

            expect(result).toEqual(mockDecodedToken);
            expect(mockAuth.verifySessionCookie).toHaveBeenCalledWith(mockCookie, true);
        });

        it('returns null for invalid session cookie', async () => {
            const mockCookie = 'invalid-cookie';

            mockAuth.verifySessionCookie.mockRejectedValue(new Error('Invalid cookie'));

            const result = await verifySessionCookie(mockCookie);

            expect(result).toBeNull();
        });
    });
});
