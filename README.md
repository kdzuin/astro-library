# Astro Library

A comprehensive library management system for astronomers to organize and showcase their astrophotography work.

## Features

- Project management for astrophotography work
- Source tracking (lights, calibrations, etc.)
- Processing descriptions and results
- Dashboard/catalogue with search by image type and palette
- Sharing capabilities for galleries, projects, and individual images

## Tech Stack

- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui
- CVA (Class Variance Authority)
- Firebase (Authentication, Firestore, Storage)
- TanStack Query
- Zustand

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/src
  /app - Next.js app router pages
  /components
    /ui - shadcn/ui components
    /layout - Layout components
    /features - Feature-specific components
  /hooks - Custom React hooks
  /lib - Utility libraries
    /firebase - Firebase configuration
  /store - Zustand stores
  /types - TypeScript type definitions
  /utils - Utility functions
```

## License

Private

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
