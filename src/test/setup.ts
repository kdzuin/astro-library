// Global test setup for React Testing Library + Vitest
// This file is automatically loaded before each test file

import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock Next.js router

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/',
}));

// Mock next/link
vi.mock('next/link', () => {
    return {
        __esModule: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        default: ({ children, href, ...props }: any) => {
            // Return a simple mock component for testing
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const MockLink = (linkProps: any) => {
                return linkProps.children;
            };
            return MockLink({ children, href, ...props });
        },
    };
});

// Global test utilities can be added here
// For example, custom render functions, common mocks, etc.
