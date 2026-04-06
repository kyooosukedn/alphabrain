# Project State

## Current Position

**Active Phase:** Phase 1 — Fix Critical App Foundation
**Status:** Planning complete, not yet executed
**Date:** 2026-04-06

## What's Done

### Backend (Complete)
- Spring Boot app runs on port 8081
- MongoDB integration with all models (User, Session, Subject, KnowledgeNode)
- JWT auth (register, login)
- Full CRUD REST APIs for sessions, subjects, knowledge nodes
- Spring Security config, CORS configured for localhost:5173
- Global exception handling

### Frontend (Partially Built, Broken)
- Project scaffolded with Vite + React + TypeScript
- Tailwind + shadcn/ui installed and configured
- Redux store exists with slices: auth, sessions, topics, progress, aiRecommendations
- Components exist: Login.tsx, Signup.tsx, Dashboard.tsx, KnowledgeGraph.tsx, Schedule.tsx, AIRecommendations.tsx, Navigation.tsx
- Pages exist: KnowledgeGraphPage.tsx, AIRecommendationsPage.tsx, LearningRoadmap.tsx, RoadmapList.tsx, RoadmapDetail.tsx
- ProtectedRoute.tsx component exists

## Critical Bugs (Phase 1 Targets)

1. **App.tsx imports @mui/material** — `ThemeProvider`, `CssBaseline` from MUI, plus a missing `./theme` module. MUI is not in package.json. App will not compile.
2. **No Redux Provider in main.tsx** — Store exists but is never provided to the component tree. All Redux hooks will throw.
3. **Auth components not routed** — Login.tsx and Signup.tsx exist but are not in any Route. Users cannot log in.
4. **KnowledgeGraphPage not in routes** — Page exists but no route defined for it.
5. **main.tsx imports aframe** — `import 'aframe'` and `import 'aframe-extras'` at top of main.tsx (not in package.json, not needed).

## Accumulated Decisions

- Remove all @mui/material usage — replace with Tailwind/shadcn equivalents
- Redux Provider must wrap the entire app in main.tsx
- Auth flow: `/login` and `/signup` routes, redirect to `/dashboard` on success
- Protected routes use existing `<ProtectedRoute>` component
- No aframe/3D — remove those imports

## Pending Work (by phase)

- **Phase 1:** Fix App.tsx, add Redux Provider, wire auth routes
- **Phase 2:** Wire all pages into routes, sidebar nav, protected route wrapping
- **Phase 3:** Knowledge graph — real API calls, node CRUD, visual polish
- **Phase 4:** Dashboard with real session/progress data, streak tracking
- **Phase 5:** AI recommendations with Gemini API integration

## Blockers / Concerns

- Until Phase 1 is complete, the app cannot run at all — all subsequent phases are blocked
- Need to audit what pages actually render vs. are stubs before Phase 2
