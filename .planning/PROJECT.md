# AlphaBrain

## What It Is

A personal lifelong learning companion app. Users track learning sessions, build a knowledge graph of concepts they've learned, follow structured roadmaps, and receive AI-powered recommendations on what to study next.

## Stack

**Backend**
- Spring Boot (Java)
- MongoDB (primary data store)
- Spring Security + JWT auth
- Port: 8081
- Base API path: `http://localhost:8081/api`

**Frontend**
- React + TypeScript
- Redux Toolkit (state management)
- Tailwind CSS + shadcn/ui (via Radix UI primitives)
- React Router v6 (routing)
- Vite (build tool)
- Port: 5173

**External**
- Google Gemini API (AI recommendations)

## Key Entities

- **User** — auth, profile
- **Session** — a logged learning session (topic, duration, notes, date)
- **Subject/Topic** — a learning subject with subtopics
- **KnowledgeNode** — a concept in the user's knowledge graph (with connections)
- **Roadmap** — a structured learning path with milestones

## Backend API Endpoints (Implemented)

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/sessions
POST   /api/sessions
GET    /api/sessions/{id}
PUT    /api/sessions/{id}
DELETE /api/sessions/{id}

GET    /api/subjects
POST   /api/subjects
GET    /api/subjects/{id}
PUT    /api/subjects/{id}
DELETE /api/subjects/{id}

GET    /api/knowledge-nodes
POST   /api/knowledge-nodes
PUT    /api/knowledge-nodes/{id}
DELETE /api/knowledge-nodes/{id}
```

## Frontend Structure

```
frontend/src/
  components/
    auth/         Login.tsx, Signup.tsx
    dashboard/
    layout/
    topics/
    schedule/
    analytics/
    shared/
    ui/           shadcn components
  pages/
    AIRecommendationsPage.tsx
    KnowledgeGraphPage.tsx
    LearningRoadmap.tsx
    RoadmapDetail.tsx, RoadmapList.tsx
  store/
    slices/       authSlice, sessionsSlice, topicsSlice, progressSlice, aiRecommendationsSlice
  routes/
  services/
  types/
```

## Decisions

- No @mui/material — use shadcn/ui + Tailwind only
- Redux Toolkit for all async state (createAsyncThunk pattern)
- JWT stored in localStorage, sent as Bearer token
- Protected routes via `<ProtectedRoute>` component (exists at `components/ProtectedRoute.tsx`)
- Backend runs independently; frontend calls it via fetch/axios
