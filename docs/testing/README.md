# Testing Documentation

Welcome to the Astro Library testing documentation! This folder contains comprehensive guides for testing every aspect of your application.

## 📚 Documentation Structure

<table>
<tr>
<th>Guide</th>
<th>Description</th>
<th>When to Use</th>
</tr>
<tr>
<td><a href="./01-setup.md">01. Setup Guide</a></td>
<td>Complete testing environment setup from scratch</td>
<td>First time setup, new team members</td>
</tr>
<tr>
<td><a href="./02-component-testing.md">02. Component Testing</a></td>
<td>Testing React components with React Testing Library</td>
<td>Testing UI components, user interactions</td>
</tr>
<tr>
<td><a href="./03-auth-testing.md">03. Authentication Testing</a></td>
<td>Testing authentication flows and protected components</td>
<td>Login/logout, protected routes, user sessions</td>
</tr>
<tr>
<td><a href="./04-api-testing.md">04. API Testing</a></td>
<td>Testing Next.js API routes and server-side logic</td>
<td>API endpoints, request/response validation</td>
</tr>
</table>

## 🚀 Quick Start

### 1. **New to Testing?**

Start with [Setup Guide](./01-setup.md) to configure your testing environment.

### 2. **Testing Components?**

Jump to [Component Testing](./02-component-testing.md) for React component testing patterns.

### 3. **Working with Auth?**

Check [Authentication Testing](./03-auth-testing.md) for login/logout and protected route testing.

### 4. **Building APIs?**

Read [API Testing](./04-api-testing.md) for testing Next.js API routes.

## 🛠️ Testing Stack Overview

The Astro Library uses a modern, comprehensive testing stack:

-   **🧪 Vitest** - Fast test runner with great TypeScript support
-   **⚛️ React Testing Library** - Component testing focused on user behavior
-   **🎭 Playwright** - End-to-end testing for complete user flows
-   **📚 Storybook** - Visual component development and testing
-   **🔥 Firebase Mocking** - Mock authentication and database calls

## 📋 Testing Checklist

Use this checklist to ensure comprehensive test coverage:

### ✅ Unit Tests

-   [ ] Utility functions (validation, formatting, calculations)
-   [ ] Business logic functions
-   [ ] Auth helper functions
-   [ ] Data transformation functions

### ✅ Component Tests

-   [ ] Component rendering with props
-   [ ] User interactions (clicks, form submissions)
-   [ ] Conditional rendering (loading, error states)
-   [ ] Accessibility features

### ✅ Integration Tests

-   [ ] API routes with authentication
-   [ ] Database operations
-   [ ] External service integrations
-   [ ] Server-side hooks and middleware

### ✅ End-to-End Tests

-   [ ] Complete user workflows
-   [ ] Authentication flows
-   [ ] Cross-page navigation
-   [ ] Form submissions and data persistence

## 🎯 Testing Philosophy

**Test what users see and do, not implementation details.**

### ✅ Good Testing Practices

-   Test user interactions and behaviors
-   Use realistic test data
-   Test both success and error scenarios
-   Mock external dependencies
-   Keep tests focused and isolated

### ❌ Avoid These Patterns

-   Testing internal component state
-   Testing implementation details
-   Overly complex test setup
-   Brittle selectors and queries
-   Tests that depend on other tests

## 🔧 Common Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode (TDD)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test auth-utils.test.ts

# Run Storybook tests
npm run test:storybook
```

## 🏗️ Project Structure

```
src/
├── test/
│   └── setup.ts              # Global test configuration
├── components/
│   ├── ui/
│   │   └── button.test.tsx    # Component tests
│   └── features/
│       └── project-card.test.tsx
├── lib/
│   ├── auth/
│   │   └── auth-utils.test.ts # Unit tests
│   └── server/
│       └── firebase/
│           └── auth.test.ts   # Server-side tests
└── app/
    └── api/
        └── projects/
            └── route.test.ts  # API route tests

docs/testing/                  # This documentation
├── README.md                  # This file
├── 01-setup.md               # Setup guide
├── 02-component-testing.md   # Component testing
├── 03-auth-testing.md        # Auth testing
└── 04-api-testing.md         # API testing

vitest.config.ts              # Vitest configuration
```

## 🎨 Test-Driven Development (TDD)

Follow the Red-Green-Refactor cycle:

### 🔴 Red - Write Failing Test

```typescript
it('validates email format', () => {
    expect(validateEmail('invalid-email')).toBe(false);
});
```

### 🟢 Green - Make Test Pass

```typescript
function validateEmail(email: string): boolean {
    return email.includes('@');
}
```

### 🔵 Refactor - Improve Code

```typescript
function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
```

## 🐛 Debugging Tests

### Common Issues & Solutions

<table>
<tr>
<th>Issue</th>
<th>Solution</th>
</tr>
<tr>
<td><code>expect.toBeInTheDocument is not a function</code></td>
<td>Import jest-dom matchers in setup file</td>
</tr>
<tr>
<td><code>Cannot find module '@/...'</code></td>
<td>Configure path aliases in vitest.config.ts</td>
</tr>
<tr>
<td><code>Multiple elements found</code></td>
<td>Use more specific queries or getAllBy* methods</td>
</tr>
<tr>
<td><code>Element not found</code></td>
<td>Use screen.debug() to see rendered HTML</td>
</tr>
</table>

### Debugging Commands

```typescript
// See what's rendered
screen.debug();

// Find available roles
import { logRoles } from '@testing-library/dom';
logRoles(container);

// Wait for async operations
await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

## 📊 Coverage Goals

Aim for these coverage targets:

-   **Statements**: 80%+
-   **Branches**: 75%+
-   **Functions**: 80%+
-   **Lines**: 80%+

```bash
# Generate coverage report
npm run test:coverage
```

## 🔗 External Resources

-   [Vitest Documentation](https://vitest.dev/)
-   [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
-   [Jest-DOM Matchers](https://github.com/testing-library/jest-dom)
-   [Playwright Documentation](https://playwright.dev/)
-   [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🤝 Contributing

When adding new tests:

1. Follow the established patterns in existing tests
2. Add documentation for complex testing scenarios
3. Update this README if you add new testing utilities
4. Ensure tests are fast, reliable, and focused

## 💡 Tips for Success

1. **Start Small** - Begin with simple unit tests
2. **Test Early** - Write tests as you develop features
3. **Be Consistent** - Follow the patterns in these guides
4. **Mock Wisely** - Mock external dependencies, not your own code
5. **Test Users' Perspective** - Focus on what users see and do

---

**Happy Testing! 🧪✨**

_For questions or improvements to this documentation, please create an issue or submit a pull request._
