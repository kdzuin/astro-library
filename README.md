# Astro Library

A comprehensive library management system for astronomers to organize and showcase their astrophotography work.

## Features

-   Project management for astrophotography work
-   Source tracking (lights, calibrations, etc.)
-   Processing descriptions and results
-   Sharing capabilities for galleries, projects, and individual images

## Tech Stack

-   Next.js
-   TypeScript
-   TailwindCSS
-   shadcn/ui
-   CVA (Class Variance Authority)
-   Firebase (Authentication, Firestore, Storage)

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

### Architecture

-   [API Design Philosophy](./docs/architecture/api-design-philosophy.md) - Authentication patterns, data storage strategies, and API response design
-   [API vs Transport Layer](./docs/architecture/api-vs-transport.md) - Understanding the separation between API and transport layers
-   [Authentication Flow](./docs/architecture/authentication-flow.md) - Complete authentication system documentation

### Testing

-   [Testing Overview](./docs/testing/README.md) - Complete testing documentation index
-   [Setup Guide](./docs/testing/01-setup.md) - Testing environment setup from scratch
-   [Component Testing](./docs/testing/02-component-testing.md) - Testing React components with React Testing Library

### Development

-   [Get Ready Explained](./docs/get-ready-explained.md) - Development setup and workflow guide
