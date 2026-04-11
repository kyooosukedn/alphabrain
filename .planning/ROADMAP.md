# AlphaBrain Roadmap

## MVP Phases (Complete)

### Phase 1: Fix Critical App Foundation ✅
Fix compilation, wire auth, add Redux Provider.

### Phase 2: Connect All Pages & Navigation ✅
Sidebar nav, protected routes, route-level code splitting.

### Phase 3: Knowledge Graph Enhancement ✅
Real API data, add/edit/delete nodes, dark theme graph.

### Phase 4: Dashboard & Analytics ✅
Real session/streak metrics, study charts, pomodoro timer.

### Phase 5: AI Recommendations ✅
Gemini API integration, personalized learning paths, cached hybrid approach.

---

## Post-MVP Features

### Phase 6: Spaced Repetition & Smart Review ✅

**Goal:** Add a spaced repetition system so users get reminded to review knowledge nodes at optimal intervals. Uses SM-2 algorithm to schedule reviews based on how well users recall concepts. Integrates with the existing knowledge graph — nodes that are "due for review" surface automatically.

**What it delivers:**
- Review scheduling per knowledge node (SM-2 algorithm: easeFactor, interval, repetitions)
- "Due for Review" dashboard widget showing nodes that need attention today
- Review session flow — user rates recall (Again / Hard / Good / Easy), system updates schedule
- Review stats — total reviews, retention rate, upcoming reviews count
- Backend: ReviewCard model + service + controller
- Frontend: ReviewSession component, DueReviews widget on Dashboard

**Status:** Not started

---

### Phase 7: Knowledge Graph Auto-Relationships ✅

**Goal:** Use Gemini to suggest connections between knowledge nodes. When a user adds a new node, AI analyzes existing nodes and suggests prerequisites and "leads-to" relationships. Also adds a "Suggest Connections" button on the knowledge graph page.

**What it delivers:**
- Backend: GraphSuggestionService — Gemini-powered analysis using index-based node referencing
- GET /api/nodes/{id}/suggest-connections — returns AI-suggested prerequisite/leadsTo relationships
- POST /api/nodes/{id}/accept-connection — applies a suggestion (updates both source and target nodes)
- "Suggest Connections" panel on Knowledge Graph page with node selector
- User can accept (green check) or dismiss (X) each suggestion
- Accepted connections update the graph in real-time
- Reuses existing GeminiConfig + RestTemplate (no new dependencies)

**Status:** Complete

---

### Phase 8: Social & Discovery (Planned)

**Goal:** Public roadmap discovery, user profiles, roadmap ratings/reviews. Users can browse and clone community roadmaps.

**Status:** Not started

---

### Phase 9: Deployment & Production (Planned)

**Goal:** Dockerize frontend + backend, deploy to cloud (Railway/Fly.io), production env vars, CI/CD pipeline.

**Status:** Not started
