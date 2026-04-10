# Project State

## Current Position

**Active Phase:** Post-MVP — all 5 phases complete + polish pass
**Status:** Frontend and backend fully committed
**Date:** 2026-04-10

## What's Done

### Backend (Complete)
- Spring Boot app runs on port 8081
- MongoDB integration with all models (User, Session, Subject, KnowledgeNode, Roadmap, UserProgress, UserStreak)
- JWT auth (register, login)
- Full CRUD REST APIs for sessions, subjects, knowledge nodes, roadmaps, user progress
- Streak tracking with weekly study minutes
- Spring Security config, CORS configured for localhost:5173
- Global exception handling
- AI recommendation endpoint stub (Gemini)
- Restructured from backend/AlphaBrain/ to backend/ root
- Docker compose for MongoDB
- .env excluded from git (contains Gemini API key)

### Frontend (Complete)
- Fully migrated from MUI to Tailwind/shadcn
- Dark mode activated (class="dark" on HTML element)
- Route-level code splitting with React.lazy() — initial load 347KB (was 2.8MB)
- Vendor chunk splitting (react, redux, recharts, framer-motion, react-force-graph)
- ErrorBoundary wrapping all lazy routes
- All pages use real API data — no hardcoded fake metrics
- Sidebar collapses properly with shared SidebarContext
- Logout dispatches Redux action (clears both store and localStorage)
- Console logs stripped from production builds via esbuild
- Dead code removed (Navigation.tsx, ApiTester.tsx, StudyAnalyticsDashboard.tsx, ReduxStateDebugger.tsx, routes/index.tsx)
- CSS @import order fixed

### Pages & Components
- Dashboard: real session/streak metrics, study progress by category
- Knowledge Graph: real API with react-force-graph, add node, dark theme
- Progress Page: real metrics, working bar chart, pomodoro timer
- AI Recommendations: honest preview mode with demo data
- Schedule: FullCalendar integration
- Roadmaps: list + detail with checklist
- Topics: CRUD management
- Auth: login/signup with JWT

## Build Stats
- Frontend build: clean (0 errors, 0 warnings except caniuse-lite age)
- Initial JS bundle: ~132KB (main) + cached vendor chunks
- Total chunks: ~35 files (lazy-loaded on demand)
