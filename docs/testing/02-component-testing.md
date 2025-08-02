# Basic Component Testing Guide

This guide covers testing React components using React Testing Library and Vitest.

## Philosophy

**Test what users see and do, not implementation details.**

- ✅ Test user interactions (clicking, typing, seeing text)
- ✅ Test component behavior (what happens when...)
- ❌ Don't test internal state or props directly
- ❌ Don't test implementation details

## Basic Component Test Structure

### 1. Simple Rendering Test

```typescript
// src/components/ui/button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### 2. Props Testing

```typescript
describe('Button', () => {
  it('applies variant styles', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('bg-destructive');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

## Real Example: ProjectCard Component

Let's test the `ProjectCard` component from our project:

### 1. Setup Mock Data

```typescript
// src/components/features/project-card.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './project-card';

// Create mock data that matches your schema
const mockProject = {
  id: 'project-1',
  userId: 'user-123',
  name: 'NGC 7000 - North America Nebula',
  description: 'A large emission nebula in the constellation Cygnus',
  visibility: 'public',
  status: 'active',
  catalogueDesignation: 'NGC7000',
  collectionIds: [],
  tags: ['emission', 'nebula'],
  processingImageUrls: [],
  finalImageUrls: [],
  sessions: {
    '2024-07-15': {
      date: '2024-07-15',
      location: 'Dark Sky Site',
      equipmentIds: [],
      tags: [],
      filters: [
        { name: 'Ha', exposureTime: 300, frameCount: 12 },
        { name: 'OIII', exposureTime: 300, frameCount: 12 },
      ],
    },
  },
  createdAt: new Date('2024-07-01'),
  updatedAt: new Date('2024-07-16'),
};
```

### 2. Test Rendering

```typescript
describe('ProjectCard', () => {
  it('renders project name and description', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText(mockProject.name)).toBeInTheDocument();
    expect(screen.getByText(mockProject.description!)).toBeInTheDocument();
  });
});
```

### 3. Test Component Behavior

```typescript
describe('ProjectCard', () => {
  it('shows correct status badge', () => {
    render(<ProjectCard project={mockProject} />);

    const statusBadge = screen.getByTestId('project-status');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent('Active');
  });

  it('displays session statistics', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText('1 session')).toBeInTheDocument();
    // Note: Adjust expected text based on actual component output
  });
});
```

### 4. Test Different States

```typescript
describe('ProjectCard', () => {
  it('handles empty project', () => {
    const emptyProject = {
      ...mockProject,
      sessions: {},
      tags: [],
    };

    render(<ProjectCard project={emptyProject} />);

    expect(screen.getByText('0 sessions')).toBeInTheDocument();
  });

  it('shows different status types', () => {
    const completedProject = { ...mockProject, status: 'completed' };

    render(<ProjectCard project={completedProject} />);

    const statusBadge = screen.getByTestId('project-status');
    expect(statusBadge).toHaveTextContent('Completed');
  });
});
```

## User Interactions

### 1. Click Events

```typescript
import userEvent from '@testing-library/user-event';

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 2. Form Interactions

```typescript
describe('ProjectForm', () => {
  it('submits form with entered data', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<ProjectForm onSubmit={handleSubmit} />);

    // Fill out form
    await user.type(screen.getByLabelText(/project name/i), 'NGC 7000');
    await user.type(screen.getByLabelText(/description/i), 'Test description');

    // Submit
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'NGC 7000',
      description: 'Test description',
    });
  });
});
```

## Queries and Matchers

### 1. Finding Elements

```typescript
// By role (preferred)
screen.getByRole('button', { name: 'Submit' })
screen.getByRole('textbox', { name: /project name/i })

// By text
screen.getByText('NGC 7000')
screen.getByText(/north america/i) // regex for partial match

// By test ID (when other queries don't work)
screen.getByTestId('project-status')

// By label
screen.getByLabelText(/project name/i)
```

### 2. Assertions

```typescript
// Element exists
expect(element).toBeInTheDocument()

// Text content
expect(element).toHaveTextContent('Active')

// CSS classes
expect(element).toHaveClass('bg-primary')

// Attributes
expect(element).toHaveAttribute('disabled')

// Form values
expect(input).toHaveValue('NGC 7000')

// Visibility
expect(element).toBeVisible()
```

## Debugging Tests

### 1. See What's Rendered

```typescript
it('debugs the component', () => {
  render(<ProjectCard project={mockProject} />);
  
  screen.debug(); // Prints HTML to console
  
  // Continue with test...
});
```

### 2. Find Available Queries

```typescript
import { logRoles } from '@testing-library/dom';

it('shows available roles', () => {
  const { container } = render(<ProjectCard project={mockProject} />);
  logRoles(container); // Shows all queryable roles
});
```

### 3. Handle Multiple Elements

```typescript
it('handles multiple elements with same test ID', () => {
  render(<ProjectCard project={mockProject} />);
  
  // If getByTestId fails with "multiple elements"
  const elements = screen.getAllByTestId('project-status');
  expect(elements[0]).toHaveTextContent('Active');
});
```

## Best Practices

### 1. Use Descriptive Test Names

```typescript
// ❌ Vague
it('works correctly', () => {});

// ✅ Specific
it('displays project name and description', () => {});
```

### 2. Test One Thing Per Test

```typescript
// ✅ Focused tests
it('renders project name', () => {
  render(<ProjectCard project={mockProject} />);
  expect(screen.getByText(mockProject.name)).toBeInTheDocument();
});

it('renders project description', () => {
  render(<ProjectCard project={mockProject} />);
  expect(screen.getByText(mockProject.description)).toBeInTheDocument();
});
```

### 3. Use Realistic Data

```typescript
// ✅ Use data that matches your actual schema
const mockProject = {
  id: 'project-1',
  name: 'NGC 7000',
  // ... all required fields
};

// ❌ Don't use minimal/fake data
const mockProject = { name: 'test' };
```

### 4. Test Error States

```typescript
it('handles missing description gracefully', () => {
  const projectWithoutDescription = {
    ...mockProject,
    description: undefined,
  };

  // Should not crash
  render(<ProjectCard project={projectWithoutDescription} />);
  expect(screen.getByText(mockProject.name)).toBeInTheDocument();
});
```

## Running Component Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (TDD)
npm run test:watch

# Run specific test file
npm run test project-card.test.tsx

# Open visual test UI
npm run test:ui
```

## Common Patterns

### 1. Testing Conditional Rendering

```typescript
it('shows edit button for project owner', () => {
  const ownedProject = { ...mockProject, userId: 'current-user' };
  
  render(<ProjectCard project={ownedProject} currentUserId="current-user" />);
  
  expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
});

it('hides edit button for other users', () => {
  const otherProject = { ...mockProject, userId: 'other-user' };
  
  render(<ProjectCard project={otherProject} currentUserId="current-user" />);
  
  expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
});
```

### 2. Testing Loading States

```typescript
it('shows loading spinner while loading', () => {
  render(<ProjectList loading={true} projects={[]} />);
  
  expect(screen.getByRole('status')).toBeInTheDocument(); // aria-role for loading
});
```

### 3. Testing Lists

```typescript
it('renders all projects in list', () => {
  const projects = [mockProject, { ...mockProject, id: 'project-2' }];
  
  render(<ProjectList projects={projects} />);
  
  expect(screen.getAllByTestId('project-card')).toHaveLength(2);
});
```

## Next Steps

- **Read**: [Authentication Testing](./03-auth-testing.md)
- **Read**: [API Testing](./04-api-testing.md)
- **Practice**: Write tests for your existing components

## Resources

- [React Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Which Query Should I Use?](https://testing-library.com/docs/queries/about/#priority)
