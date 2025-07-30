# API Design Philosophy for Astronomy Library

## Overview

This document outlines the API design philosophy for the Astronomy Library, specifically addressing how to handle many-to-many relationships with Firestore as the backend database.

## Core Philosophy: Denormalized API Responses

### Storage Strategy (Firestore)
- **Store normalized references** (IDs) in Firestore documents
- **Use subcollections** for one-to-many relationships where appropriate
- **Store arrays of IDs** for many-to-many relationships

### API Response Strategy
- **Return denormalized data** with populated relationships
- **API does the heavy lifting** of joining and populating data
- **Clients receive complete objects** in single requests

## Why Denormalized API Responses?

### 1. **Client Simplicity**
```typescript
// ✅ What clients get (denormalized) - Project with session data
{
  "id": "proj_456",
  "name": "NGC 7000 - North America Nebula",
  "catalogueDesignation": "NGC 7000",
  "sessions": {
    "2024-07-15": {
      "date": "2024-07-15",
      "totalExposureTime": 180,
      "filters": [
        { "name": "Ha", "exposureTime": 300, "frameCount": 20, "totalTime": 100 },
        { "name": "OIII", "exposureTime": 300, "frameCount": 16, "totalTime": 80 }
      ],
      "equipment": [
        { "id": "eq_111", "name": "Canon EOS Ra", "category": "camera" },
        { "id": "eq_222", "name": "Celestron EdgeHD 11", "category": "telescope" }
      ]
    },
    "2024-07-20": { /* another session */ }
  }
}

// ❌ What clients would get (normalized) - requires multiple requests
{
  "id": "proj_456",
  "name": "NGC 7000",
  "sessions": {
    "2024-07-15": {
      "equipmentIds": ["eq_111", "eq_222"]
    }
  }
}
```

### 2. **Performance Benefits**
- **Fewer round trips** - One request gets complete data
- **Better caching** - Complete objects can be cached effectively
- **Mobile-friendly** - Reduces network requests for mobile clients

### 3. **Multi-Client Support**
- **Rich data** for web, mobile, and future clients
- **Consistent experience** across all platforms
- **Easier client development** - no complex joining logic needed

## Data Relationships

### One-to-Many Relationships

#### Projects → Session Data
```typescript
// In Firestore
Project: {
  id: "proj_123",
  name: "NGC 7000",
  sessions: {
    "2024-07-15": {
      date: "2024-07-15",
      totalExposureTime: 180,
      equipmentIds: ["eq_camera", "eq_telescope"],
      filters: [/* filter data */],
      notes: "Great night, excellent seeing"
    },
    "2024-07-20": {
      date: "2024-07-20",
      totalExposureTime: 240,
      equipmentIds: ["eq_camera", "eq_telescope", "eq_mount"]
    }
  }
}

// API Response - Project with populated session equipment
GET /api/projects/proj_123
{
  "id": "proj_123",
  "name": "NGC 7000",
  "sessions": {
    "2024-07-15": {
      "date": "2024-07-15",
      "totalExposureTime": 180,
      "equipment": [ /* populated equipment objects */ ]
    }
  }
}

// Query session data across multiple projects
GET /api/projects?sessionDate=2024-07-15
```

### Many-to-Many Relationships

#### Projects ↔ Equipment (via Session Data)
```typescript
// In Firestore - Equipment referenced in session data within projects
Project: {
  id: "proj_456",
  sessions: {
    "2024-07-15": {
      equipmentIds: ["eq_camera", "eq_telescope", "eq_mount"]
    }
  }
}

Equipment: {
  id: "eq_camera",
  // No back-reference needed - query projects with sessions containing this equipment
}

// API Response - Equipment usage populated in session data
GET /api/projects/proj_456
{
  "id": "proj_456",
  "sessions": {
    "2024-07-15": {
      "date": "2024-07-15",
      "equipment": [
        { "id": "eq_camera", "name": "Canon EOS Ra", /* ... */ },
        { "id": "eq_telescope", "name": "Celestron EdgeHD 11", /* ... */ },
        { "id": "eq_mount", "name": "Sky-Watcher EQ6-R", /* ... */ }
      ]
    }
  }
}
```

### One-to-Many Relationships

#### Projects → Collections
```typescript
// In Firestore
Collection: {
  id: "col_123",
  projectIds: ["proj_456", "proj_789"]
}

Project: {
  id: "proj_456",
  collectionIds: ["col_123", "col_999"] // Can belong to multiple collections
}

// API Response
GET /api/collections/col_123
{
  "id": "col_123",
  "projects": [
    { /* full project objects */ }
  ]
}
```

## API Endpoint Patterns

### Standard CRUD with Population

```typescript
// GET /api/projects - List with minimal population
{
  "data": [
    {
      "id": "proj_123",
      "name": "NGC 7000",
      "catalogue": { "name": "NGC", "designation": "NGC 7000" }, // Populated
      "sessionCount": 5, // Aggregated
      "collections": [/* populated collections */]
    }
  ]
}

// GET /api/projects/proj_123 - Full details with all relationships
{
  "data": {
    "id": "proj_123",
    "name": "NGC 7000",
    "catalogue": { /* full catalogue object */ },
    "collections": [/* full collection objects */],
    "recentSessions": [/* last 5 sessions */],
    "equipmentUsed": [/* aggregated equipment */]
  }
}
```

### Query Parameters for Population Control

```typescript
// GET /api/sessions?populate=projects,equipment
// GET /api/sessions?populate=none (IDs only)
// GET /api/sessions?populate=all (full population)
```

## Firestore Implementation Strategy

### Document Structure
```typescript
// Collections
/users/{userId}/projects/{projectId}
/users/{userId}/sessions/{sessionId}
/users/{userId}/equipment/{equipmentId}
/users/{userId}/collections/{collectionId}
/catalogues/{catalogueId} // Global catalogues

// Indexes needed for queries
// - sessions: projectIds array-contains
// - projects: collectionIds array-contains
// - sessions: equipmentIds array-contains
```

### Query Patterns
```typescript
// Find all sessions for a project
db.collection('users').doc(userId)
  .collection('sessions')
  .where('projectIds', 'array-contains', projectId)

// Find all equipment used in sessions
const sessionEquipmentIds = sessions.flatMap(s => s.equipmentIds);
const equipment = await Promise.all(
  sessionEquipmentIds.map(id => getEquipment(id))
);
```

## Benefits of This Approach

1. **Developer Experience** - Clients get rich, complete data
2. **Performance** - Single requests for complex data
3. **Caching** - Complete objects cache well
4. **Flexibility** - API can control what to populate
5. **Future-Proof** - Easy to add new clients
6. **Firestore Optimized** - Leverages document model strengths

## Trade-offs

### Pros
- ✅ Better client experience
- ✅ Fewer network requests
- ✅ Easier client development
- ✅ Better caching

### Cons
- ❌ More complex API logic
- ❌ Larger response sizes
- ❌ More Firestore reads per request

**Conclusion**: For an astronomy library with many-to-many relationships and plans for multiple clients, the benefits of denormalized API responses significantly outweigh the costs.
