# Testing Guide - Astro Library

This document provides a comprehensive guide to testing in the Astro Library project, including Test-Driven Development (TDD) practices, tools, and workflows.

## Overview

The Astro Library project uses a multi-layered testing approach:

- **Unit Tests**: Vitest + React Testing Library
- **Component Tests**: Storybook with Vitest integration
- **End-to-End Tests**: Playwright
- **Visual Testing**: Storybook visual regression

## Testing Stack

### Core Tools

| Tool | Purpose | Use Case |
|------|---------|----------|
| **Vitest** | Test runner | Unit tests, integration tests |
| **React Testing Library** | Component testing | User interaction testing |
| **Storybook** | Component development | Visual testing, documentation |
| **Playwright** | E2E testing | Full user workflows |
| **@testing-library/jest-dom** | DOM assertions | Enhanced DOM matchers |

### Dependencies

```json
{
  "devDependencies": {
    "vitest": "^3.2.4",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest",
    "@testing-library/user-event": "latest",
    "jsdom": "latest",
    "@vitejs/plugin-react": "latest"
  }
}
```

## Configuration

### Vitest Configuration

**File**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

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
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup

**File**: `src/test/setup.ts`

Global test configuration including:
- Jest-DOM matchers for enhanced assertions
- Next.js router mocking
- Common test utilities

## Available Scripts

```bash
# Unit Testing
npm run test              # Run all unit tests once
npm run test:watch        # Run tests in watch mode (ideal for TDD)
npm run test:ui           # Open Vitest UI for visual test management
npm run test:coverage     # Run tests with coverage report

# Component Testing
npm run storybook         # Start Storybook development server
npm run test:storybook    # Run Storybook component tests
npm run build-storybook   # Build Storybook for production

# End-to-End Testing
# (Playwright scripts would be added here)
```

## Test-Driven Development (TDD)

### The TDD Cycle

TDD follows a simple three-step cycle:

1. **🔴 RED**: Write a failing test
2. **🟢 GREEN**: Write minimal code to make it pass
3. **🔵 REFACTOR**: Improve code while keeping tests green

### TDD Workflow

#### 1. Start TDD Session

```bash
npm run test:watch
```

This command:
- Runs tests continuously
- Re-runs tests when files change
- Provides immediate feedback
- Perfect for the Red-Green-Refactor cycle

#### 2. Write a Failing Test (RED)

```typescript
// src/components/features/project-card.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './project-card';

describe('ProjectCard', () => {
  it('displays project name', () => {
    const mockProject = {
      id: '1',
      name: 'NGC 7000',
      // ... other required fields
    };
    
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText('NGC 7000')).toBeInTheDocument();
  });
});
```

#### 3. Write Minimal Code (GREEN)

```typescript
// src/components/features/project-card.tsx
export function ProjectCard({ project }) {
  return <div>{project.name}</div>;
}
```

#### 4. Refactor (REFACTOR)

Improve the implementation while keeping tests green:

```typescript
export function ProjectCard({ project }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
    </Card>
  );
}
```

## Testing Strategies

### Unit Testing with Vitest

**Best for:**
- Testing individual functions
- Component logic
- Data transformations
- API utilities
- Business logic

**Simple Example:**

```typescript
// src/lib/utils/exposure-time.test.ts
import { describe, it, expect } from 'vitest';

describe('Exposure Time Utils', () => {
  it('calculates total exposure time from filters', () => {
    const filters = [
      { exposureTime: 300, frameCount: 12 }, // 5min × 12 = 3600s
      { exposureTime: 300, frameCount: 12 }, // 5min × 12 = 3600s
    ];
    
    const total = filters.reduce(
      (sum, filter) => sum + (filter.exposureTime * filter.frameCount), 
      0
    );
    
    expect(total).toBe(7200); // 2 hours in seconds
  });
});
```

### Component Testing with React Testing Library

**Best for:**
- User interactions
- Component behavior
- Integration between components
- Accessibility testing

**Simple Example:**

```typescript
// src/components/features/project-card.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './project-card';

// Simple mock data
const mockProject = {
  id: '1',
  name: 'NGC 7000',
  description: 'North America Nebula',
  status: 'active',
  sessions: {},
  // ... other required fields
};

describe('ProjectCard', () => {
  it('renders project name and description', () => {
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText('NGC 7000')).toBeInTheDocument();
    expect(screen.getByText('North America Nebula')).toBeInTheDocument();
  });
  
  it('shows project status', () => {
    render(<ProjectCard project={mockProject} />);
    
    const statusBadge = screen.getByTestId('project-status');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('Active');
  });
});
```

### Visual Testing with Storybook

**Best for:**
- Component variations
- Design system documentation
- Visual regression testing
- Responsive design testing

**Simple Example:**

```typescript
// src/components/features/project-card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard } from './project-card';

const meta: Meta<typeof ProjectCard> = {
  title: 'Features/ProjectCard',
  component: ProjectCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story
export const Default: Story = {
  args: {
    project: {
      id: '1',
      name: 'NGC 7000',
      description: 'North America Nebula',
      status: 'active',
      sessions: {
        '2024-07-15': {
          date: '2024-07-15',
          filters: [
            { name: 'Ha', exposureTime: 300, frameCount: 12 }
          ]
        }
      },
      // ... other required fields
    },
  },
};

// Empty state story
export const EmptyProject: Story = {
  args: {
    project: {
      ...Default.args.project,
      sessions: {},
      tags: [],
    },
  },
};
```

## Testing Patterns

### 1. Simple Test Structure

```typescript
it('calculates total exposure time', () => {
  // Setup data
  const filters = [
    { exposureTime: 300, frameCount: 12 }, // 5min × 12 frames
    { exposureTime: 300, frameCount: 12 }, // 5min × 12 frames
  ];
  
  // Calculate result
  const total = filters.reduce(
    (sum, f) => sum + (f.exposureTime * f.frameCount), 
    0
  );
  
  // Check result
  expect(total).toBe(7200); // 2 hours in seconds
});
```

### 2. Simple Mock Data

```typescript
// Create mock data inline
const mockProject = {
  id: '1',
  name: 'Test Project',
  description: 'Test Description',
  status: 'active',
  sessions: {},
  tags: [],
  // ... other required fields
};

// Use in tests
render(<ProjectCard project={mockProject} />);
```

### 3. Testing Component Behavior

```typescript
it('shows correct status badge', () => {
  const project = { ...mockProject, status: 'completed' };
  
  render(<ProjectCard project={project} />);
  
  const badge = screen.getByTestId('project-status');
  expect(badge).toHaveTextContent('Completed');
});
```

## Testing Best Practices

### 1. Test What Users See

❌ **Don't test internal details:**
```typescript
// Bad - testing component internals
expect(component.props.isLoading).toBe(true);
```

✅ **Do test user experience:**
```typescript
// Good - testing what user sees
expect(screen.getByText('Loading...')).toBeInTheDocument();
```

### 2. Use Clear Test Names

❌ **Vague:**
```typescript
it('works', () => {});
```

✅ **Specific:**
```typescript
it('shows project name and description', () => {});
```

### 3. Test Different Scenarios

```typescript
describe('ProjectCard', () => {
  it('shows project with sessions', () => {
    const project = { ...mockProject, sessions: { '2024-01-01': {...} } };
    // test with data
  });
  
  it('shows empty project', () => {
    const project = { ...mockProject, sessions: {} };
    // test without data
  });
});
```

### 4. Keep Tests Simple

```typescript
// One thing per test
it('renders project name', () => {
  render(<ProjectCard project={mockProject} />);
  expect(screen.getByText(mockProject.name)).toBeInTheDocument();
});

it('renders project description', () => {
  render(<ProjectCard project={mockProject} />);
  expect(screen.getByText(mockProject.description)).toBeInTheDocument();
});
```

## Debugging Tests

### 1. See What's Rendered

```typescript
it('debugs component output', () => {
  render(<ProjectCard project={mockProject} />);
  
  screen.debug(); // Shows the HTML in console
  
  // Continue with your test...
  expect(screen.getByText('NGC 7000')).toBeInTheDocument();
});
```

### 2. Use Vitest UI (Visual Interface)

```bash
npm run test:ui
```

Opens a web interface where you can:
- See test results visually
- Run individual tests
- View detailed error messages
- Check code coverage

### 3. Check for Multiple Elements

```typescript
it('handles multiple elements error', () => {
  render(<ProjectCard project={mockProject} />);
  
  // If getByTestId fails with "multiple elements"
  const elements = screen.getAllByTestId('project-status');
  console.log('Found', elements.length, 'elements');
  
  // Use the first one
  expect(elements[0]).toHaveTextContent('Active');
});
```

## Common Testing Scenarios

### Testing Different Data States

```typescript
it('shows project with sessions', () => {
  const projectWithSessions = {
    ...mockProject,
    sessions: {
      '2024-07-15': {
        date: '2024-07-15',
        filters: [{ name: 'Ha', exposureTime: 300, frameCount: 12 }]
      }
    }
  };
  
  render(<ProjectCard project={projectWithSessions} />);
  expect(screen.getByText('1 session')).toBeInTheDocument();
});

it('shows empty project', () => {
  const emptyProject = { ...mockProject, sessions: {} };
  
  render(<ProjectCard project={emptyProject} />);
  expect(screen.getByText('0 sessions')).toBeInTheDocument();
});
```

### Testing Component Props

```typescript
it('shows different status badges', () => {
  const completedProject = { ...mockProject, status: 'completed' };
  
  render(<ProjectCard project={completedProject} />);
  
  const badge = screen.getByTestId('project-status');
  expect(badge).toHaveTextContent('Completed');
});
```

### Testing Error Handling

```typescript
it('handles missing data gracefully', () => {
  const projectWithoutDescription = {
    ...mockProject,
    description: undefined
  };
  
  // Should not crash
  render(<ProjectCard project={projectWithoutDescription} />);
  expect(screen.getByText(mockProject.name)).toBeInTheDocument();
});
```

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test
      - run: npm run test:storybook
```

## Performance Testing

### Testing Component Performance

```typescript
import { performance } from 'perf_hooks';

it('renders large project list efficiently', () => {
  const manyProjects = Array.from({ length: 1000 }, (_, i) => 
    createMockProject({ id: `project-${i}` })
  );
  
  const start = performance.now();
  render(<ProjectList projects={manyProjects} />);
  const end = performance.now();
  
  expect(end - start).toBeLessThan(100); // Should render in < 100ms
});
```

## Accessibility Testing

### Basic A11y Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<ProjectCard project={mockProject} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Playwright Documentation](https://playwright.dev/)

### Testing Philosophy
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Quick Reference

### Essential Testing Commands

```bash
# Development
npm run test:watch        # TDD mode
npm run storybook        # Visual development

# CI/CD
npm run test             # Run all tests
npm run test:coverage    # Coverage report
npm run test:storybook   # Component tests
```

### Key Testing Imports

```typescript
// Vitest
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Custom matchers
import '@testing-library/jest-dom';
```

This testing setup provides a solid foundation for building reliable, maintainable software using Test-Driven Development practices.
