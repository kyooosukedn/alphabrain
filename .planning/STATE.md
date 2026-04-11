# Project State

## Current Position

**Active Phase:** Phase 6 — Spaced Repetition & Smart Review
**Status:** Starting implementation
**Date:** 2026-04-11

## What's Done

### Backend (Complete)
- Spring Boot app runs on port 8081
- MongoDB integration with all models (User, Session, Subject, KnowledgeNode, Roadmap, UserProgress, UserStreak)
- JWT auth (register, login)
- Full CRUD REST APIs for sessions, subjects, knowledge nodes, roadmaps, user progress
- Streak tracking with weekly study minutes
- Spring Security config, CORS configured for localhost:5173
- Global exception handling
- AI recommendation endpoint with Gemini integration (cached, personalized)
- Restructured to pure MongoDB (all JPA/H2 scaffolding removed)
- Docker compose for MongoDB
- .env excluded from git (contains Gemini API key)

### Frontend (Complete)
- Fully migrated from MUI to Tailwind/shadcn
- Dark mode activated
- Route-level code splitting with React.lazy()
- Vendor chunk splitting
- ErrorBoundary wrapping all lazy routes
- All pages use real API data
- Sidebar collapses properly with shared SidebarContext
- Logout dispatches Redux action
- Console logs stripped from production builds
- AI Recommendations: real Gemini data when API key present, demo fallback otherwise

### Pages & Components
- Dashboard: real session/streak metrics, study progress by category
- Knowledge Graph: real API with react-force-graph, add node, dark theme
- Progress Page: real metrics, working bar chart, pomodoro timer
- AI Recommendations: Gemini-powered personalized paths, roadmap, next steps
- Schedule: FullCalendar integration
- Roadmaps: list + detail with checklist
- Topics: CRUD management
- Auth: login/signup with JWT

## Build Stats
- Backend: clean compile, 21 unit tests passing
- Frontend build: clean (0 errors, 0 warnings except vendor-graph chunk size)
- Initial JS bundle: ~132KB (main) + cached vendor chunks
