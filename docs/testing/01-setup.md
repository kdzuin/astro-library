# Testing Setup Guide

This guide walks you through setting up testing in the Astro Library project from scratch.

## Overview

The Astro Library uses a comprehensive testing stack:

- **Vitest** - Fast test runner with great TypeScript support
- **React Testing Library** - Component testing focused on user behavior
- **@testing-library/jest-dom** - Enhanced DOM matchers
- **Storybook** - Visual component development and testing
- **Playwright** - End-to-end testing

## Installation

### 1. Install Dependencies

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @vitejs/plugin-react
```

### 2. Install Optional UI Tools

```bash
npm install --save-dev @vitest/ui @vitest/coverage-v8
```

## Configuration

### 1. Vitest Configuration

Create `vitest.config.ts`:

```typescript
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['src/**/*.stories.{js,ts,jsx,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
});
```

### 2. Test Setup File

Create `src/test/setup.ts`:

```typescript
// Global test setup for React Testing Library + Vitest
import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock Next.js router
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
```

### 3. Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:storybook": "test-storybook"
  }
}
```

## Verification

### 1. Create a Simple Test

Create `src/lib/utils/example.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';

function add(a: number, b: number): number {
  return a + b;
}

describe('Example Test', () => {
  it('adds two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

### 2. Run Tests

```bash
# Run tests once
npm run test

# Run tests in watch mode (for TDD)
npm run test:watch

# Open visual test UI
npm run test:ui
```

### 3. Expected Output

You should see:
```
✓ src/lib/utils/example.test.ts (1 test) 2ms
  ✓ Example Test > adds two numbers correctly

Test Files  1 passed (1)
Tests  1 passed (1)
```

## Common Issues & Solutions

### Issue: "Cannot find module '@/...'"

**Solution**: Make sure the alias is configured in `vitest.config.ts`:

```typescript
resolve: {
  alias: {
    '@': path.resolve(dirname, './src'),
  },
},
```

### Issue: "expect.toBeInTheDocument is not a function"

**Solution**: Ensure jest-dom matchers are imported in setup file:

```typescript
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
```

### Issue: "jsdom not found"

**Solution**: Install jsdom:

```bash
npm install --save-dev jsdom
```

## Next Steps

Once your setup is working:

1. **Read**: [Basic Component Testing](./02-component-testing.md)
2. **Read**: [Authentication Testing](./03-auth-testing.md)
3. **Read**: [API Testing](./04-api-testing.md)

## File Structure

Your testing setup should look like this:

```
src/
├── test/
│   └── setup.ts          # Global test configuration
├── components/
│   └── *.test.tsx         # Component tests
├── lib/
│   └── **/*.test.ts       # Utility/logic tests
└── app/
    └── api/
        └── **/*.test.ts   # API route tests

vitest.config.ts           # Vitest configuration
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest-DOM Matchers](https://github.com/testing-library/jest-dom)
