# Project State

## Current Position

**Active Phase:** Phase 5 — AI Recommendations Polish
**Status:** Phases 1-4 complete
**Date:** 2026-04-08

## What's Done

### Backend (Complete)
- Spring Boot app runs on port 8081
- MongoDB integration with all models (User, Session, Subject, KnowledgeNode, Roadmap, UserProgress, UserStreak)
- JWT auth (register, login)
- Full CRUD REST APIs for sessions, subjects, knowledge nodes, roadmaps, user progress
- Spring Security config, CORS configured for localhost:5173
- Global exception handling
- AI recommendation endpoint (Gemini)

### Frontend — Phase 1 Complete
- App.tsx: clean React Router setup with all routes (login, signup, dashboard, learning-journey, topics, knowledge-graph, ai-recommendations, roadmaps, roadmap/:id)
- main.tsx: Redux Provider + QueryClientProvider wrapping App
- All MUI imports removed — fully migrated to Tailwind/shadcn
- RoadmapList.tsx and RoadmapDetail.tsx rewritten with shadcn components
- Dead MUI Navigation.tsx deleted
- RoadmapService.ts import path fixed
- UserProgressService.ts implemented (was empty)
- SessionForm.tsx dayjs bug fixed (replaced with native Date)
- Build succeeds (vite build passes)

### Frontend — Existing Working Components
- Sidebar navigation (Tailwind, uses config/navigation.ts)
- AppLayout wrapping all protected routes
- ProtectedRoute with JWT token validation
- Auth components (Login, Signup) — fully functional
- shadcn/ui component library installed
- Redux store with 5 slices: auth, sessions, topics, progress, aiRecommendations

## Pending Work (by phase)

- **Phase 2:** Audit which pages actually render vs. are stubs, connect real API data
- **Phase 3:** Knowledge graph — real API calls, node CRUD, visual polish
- **Phase 4:** Dashboard with real session/progress data, streak tracking
- **Phase 5:** AI recommendations with Gemini API integration

## Notes

- CSS warning: `@import` in index.css should come before `@tailwind` directives
- Build produces a 2.2MB JS bundle — needs code splitting eventually
- The `routes/index.tsx` file defines an alternate routing setup (not used by App.tsx) — can be deleted
