# AlphaBrain Browser QA Test Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Systematically verify every feature in the AlphaBrain app using Playwright browser automation — from login through every page — reporting screenshots and pass/fail status at each step.

**Architecture:** Tests run against the live local dev stack (backend :8081, frontend :5173). Each task covers one feature area. Tests navigate, interact, screenshot, and assert visible state. No mocking — real API calls to real backend.

**Tech Stack:** `@playwright/mcp` (browser_navigate, browser_snapshot, browser_take_screenshot, browser_click, browser_type, browser_fill_form, browser_wait_for), Spring Boot :8081, Vite :5173, MongoDB localhost:27017

**Prerequisites before running:**
```bash
# Terminal 1 — backend
cd backend && ./mvnw spring-boot:run

# Terminal 2 — frontend
cd frontend && npm run dev

# Confirm both up:
curl http://localhost:8081/api/health
curl -s http://localhost:5173 | grep -o "<title>.*</title>"
```

**Test account:** Register a fresh user `testuser` / `TestPass123` at the start. All tasks reuse this session.

---

## Task 1: Auth — Login Page Loads & Renders Correctly

**What we're checking:** The login page is publicly accessible, shows the form, and rejects unauthenticated access to protected routes.

- [ ] **Step 1: Navigate to app root — expect redirect to /login**
  - Tool: `browser_navigate` → `http://localhost:5173`
  - Tool: `browser_snapshot` — assert URL contains `/login`
  - Tool: `browser_take_screenshot` — label `01-login-redirect`

- [ ] **Step 2: Verify login form elements exist**
  - Tool: `browser_snapshot` — assert visible: "Username", "Password", "Sign in" button
  - Expected: Sparkles logo, "Welcome Back" heading, username input, password input, sign in button, "Sign up" link

- [ ] **Step 3: Try accessing protected route while logged out**
  - Tool: `browser_navigate` → `http://localhost:5173/`
  - Tool: `browser_snapshot` — assert redirected to `/login`
  - Tool: `browser_take_screenshot` — label `01-protected-redirect`

---

## Task 2: Auth — Register New Account

**What we're checking:** New user can register and is redirected to the dashboard.

- [ ] **Step 1: Navigate to signup**
  - Tool: `browser_navigate` → `http://localhost:5173/signup`
  - Tool: `browser_take_screenshot` — label `02-signup-page`

- [ ] **Step 2: Fill and submit registration form**
  - Tool: `browser_fill_form` — fill: username=`testuser`, email=`testuser@test.com`, password=`TestPass123`, confirmPassword=`TestPass123`
  - Tool: `browser_click` — click "Create Account" (or submit) button
  - Tool: `browser_wait_for` — wait for navigation away from `/signup`

- [ ] **Step 3: Confirm redirect to dashboard**
  - Tool: `browser_snapshot` — assert URL is `/` or `/dashboard`
  - Tool: `browser_take_screenshot` — label `02-after-register`

---

## Task 3: Auth — Logout & Login

**What we're checking:** Logout clears session; login with registered credentials works.

- [ ] **Step 1: Find and click logout**
  - Tool: `browser_snapshot` — locate logout button in sidebar/header
  - Tool: `browser_click` — click logout
  - Tool: `browser_wait_for` — wait for redirect to `/login`
  - Tool: `browser_take_screenshot` — label `03-logged-out`

- [ ] **Step 2: Login with credentials**
  - Tool: `browser_fill_form` — fill: username=`testuser`, password=`TestPass123`
  - Tool: `browser_click` — click "Sign in"
  - Tool: `browser_wait_for` — wait for redirect away from `/login`
  - Tool: `browser_take_screenshot` — label `03-logged-in`

- [ ] **Step 3: Verify dashboard loads**
  - Tool: `browser_snapshot` — assert "Dashboard" heading or welcome message visible
  - Pass if: no error state, sidebar visible

---

## Task 4: Dashboard — Hero & Stats Render

**What we're checking:** Dashboard shows the hero section, stats cards, and no broken components.

- [ ] **Step 1: Navigate to dashboard**
  - Tool: `browser_navigate` → `http://localhost:5173/`
  - Tool: `browser_take_screenshot` — label `04-dashboard-full`

- [ ] **Step 2: Verify key sections**
  - Tool: `browser_snapshot` — assert visible: streak indicator or "0 day streak", progress stats cards, "Start Learning" or CTA button
  - Pass if: no error boundary message, no blank sections

- [ ] **Step 3: Check sidebar navigation links**
  - Tool: `browser_snapshot` — assert sidebar has: Dashboard, Learning Journey, Topics, Notes, Knowledge Graph, Review, Schedule, Progress, Quests, Achievements, AI Recommendations, Roadmaps
  - Tool: `browser_take_screenshot` — label `04-sidebar`

---

## Task 5: Schedule — Create a Study Session

**What we're checking:** User can open the schedule, create a session with date/time, and see it in the list.

- [ ] **Step 1: Navigate to Schedule**
  - Tool: `browser_navigate` → `http://localhost:5173/schedule`
  - Tool: `browser_take_screenshot` — label `05-schedule-empty`

- [ ] **Step 2: Open the new session modal**
  - Tool: `browser_snapshot` — find "Add Session" or "Schedule New" button
  - Tool: `browser_click` — click it
  - Tool: `browser_wait_for` — wait for modal to appear
  - Tool: `browser_take_screenshot` — label `05-session-modal`

- [ ] **Step 3: Fill the session form**
  - Tool: `browser_fill_form` — fill: title=`Test Study Session`, date=`2026-04-15`, startTime=`10:00`, endTime=`11:00`
  - Tool: `browser_snapshot` — confirm form looks correct
  - Tool: `browser_click` — click "Create Session"
  - Tool: `browser_wait_for` — wait for modal to close

- [ ] **Step 4: Confirm session appears**
  - Tool: `browser_snapshot` — assert "Test Study Session" visible on page
  - Tool: `browser_take_screenshot` — label `05-session-created`

---

## Task 6: Topics — Create and View a Topic

**What we're checking:** User can create a topic and it appears in the topics list.

- [ ] **Step 1: Navigate to Topics**
  - Tool: `browser_navigate` → `http://localhost:5173/topics`
  - Tool: `browser_take_screenshot` — label `06-topics-empty`

- [ ] **Step 2: Create a topic**
  - Tool: `browser_snapshot` — find "Add Topic" or "New Topic" or "+" button
  - Tool: `browser_click` — click it
  - Tool: `browser_wait_for` — wait for form/modal
  - Tool: `browser_fill_form` — fill: name=`JavaScript Fundamentals`, description=`Core JS concepts`
  - Tool: `browser_click` — click submit/save
  - Tool: `browser_wait_for` — wait for form to close

- [ ] **Step 3: Verify topic is listed**
  - Tool: `browser_snapshot` — assert "JavaScript Fundamentals" visible
  - Tool: `browser_take_screenshot` — label `06-topic-created`

---

## Task 7: Notes — Create a Note

**What we're checking:** User can write and save a note.

- [ ] **Step 1: Navigate to Notes**
  - Tool: `browser_navigate` → `http://localhost:5173/notes`
  - Tool: `browser_take_screenshot` — label `07-notes-empty`

- [ ] **Step 2: Create a note**
  - Tool: `browser_snapshot` — find "New Note" or "Add Note" button
  - Tool: `browser_click` — click it
  - Tool: `browser_fill_form` — fill title=`My First Note`, content=`This is a test note for AlphaBrain.`
  - Tool: `browser_click` — click save
  - Tool: `browser_wait_for` — wait for save confirmation

- [ ] **Step 3: Verify note is saved**
  - Tool: `browser_snapshot` — assert "My First Note" visible
  - Tool: `browser_take_screenshot` — label `07-note-saved`

---

## Task 8: Knowledge Graph — Add a Node

**What we're checking:** User can add a knowledge node and see it in the graph.

- [ ] **Step 1: Navigate to Knowledge Graph**
  - Tool: `browser_navigate` → `http://localhost:5173/knowledge-graph`
  - Tool: `browser_take_screenshot` — label `08-knowledge-graph-empty`

- [ ] **Step 2: Add a node**
  - Tool: `browser_snapshot` — find "Add Node" or "+" button
  - Tool: `browser_click` — click it
  - Tool: `browser_wait_for` — wait for form
  - Tool: `browser_fill_form` — fill: title=`React`, description=`JavaScript UI library`, nodeType=`SKILL`, difficultyLevel=`3`, estimatedTimeToLearn=`20`
  - Tool: `browser_click` — click save
  - Tool: `browser_wait_for` — wait for node to appear in graph

- [ ] **Step 3: Verify node appears**
  - Tool: `browser_snapshot` — assert "React" visible in node list or graph canvas
  - Tool: `browser_take_screenshot` — label `08-node-added`

- [ ] **Step 4: Add a second node to test connections**
  - Repeat Step 2 with: title=`JavaScript`, nodeType=`SKILL`, difficultyLevel=`2`, estimatedTimeToLearn=`30`
  - Tool: `browser_take_screenshot` — label `08-two-nodes`

---

## Task 9: Knowledge Graph — AI Connection Suggestions

**What we're checking:** Selecting a node and clicking "Suggest Connections" returns AI suggestions.

- [ ] **Step 1: Find the AI suggestions panel**
  - Tool: `browser_snapshot` — look for "AI Connection Suggestions" section or node dropdown
  - Note: This panel appears on the Knowledge Graph page

- [ ] **Step 2: Select a node and request suggestions**
  - Tool: `browser_snapshot` — find node selector dropdown
  - Tool: `browser_select_option` — select "React" node
  - Tool: `browser_click` — click "Suggest Connections" button
  - Tool: `browser_wait_for` — wait for response (may take 3-5s for Gemini API)
  - Tool: `browser_take_screenshot` — label `09-ai-suggestions`

- [ ] **Step 3: Accept a suggestion**
  - Tool: `browser_snapshot` — assert suggestion cards visible with Accept/Dismiss buttons
  - Tool: `browser_click` — click "Accept" on first suggestion
  - Tool: `browser_take_screenshot` — label `09-suggestion-accepted`

---

## Task 10: Learning Roadmaps — Browse and Create

**What we're checking:** Roadmap list loads, tabs work (Popular/Recent/Most Cloned), and user can create a roadmap.

- [ ] **Step 1: Navigate to Roadmaps**
  - Tool: `browser_navigate` → `http://localhost:5173/roadmaps`
  - Tool: `browser_take_screenshot` — label `10-roadmaps-list`

- [ ] **Step 2: Test discovery tabs**
  - Tool: `browser_click` — click "Popular" tab
  - Tool: `browser_take_screenshot` — label `10-popular-tab`
  - Tool: `browser_click` — click "Recent" tab
  - Tool: `browser_take_screenshot` — label `10-recent-tab`
  - Tool: `browser_click` — click "Most Cloned" tab
  - Tool: `browser_take_screenshot` — label `10-most-cloned-tab`

- [ ] **Step 3: Create a roadmap**
  - Tool: `browser_snapshot` — find "Create Roadmap" or "New Roadmap" button
  - Tool: `browser_click` — click it
  - Tool: `browser_fill_form` — fill: title=`Web Dev Journey`, description=`Full stack development path`, category=`Programming`, difficultyLevel=`Intermediate`
  - Tool: `browser_click` — click save
  - Tool: `browser_wait_for` — wait for redirect to roadmap detail

- [ ] **Step 4: Verify roadmap detail page**
  - Tool: `browser_snapshot` — assert "Web Dev Journey" heading visible, star rating component visible
  - Tool: `browser_take_screenshot` — label `10-roadmap-detail`

---

## Task 11: Roadmap — Rate and Clone

**What we're checking:** Rating a roadmap updates the displayed rating; clone button works.

- [ ] **Step 1: Rate a roadmap (need a second user's roadmap, or use own)**
  - Tool: `browser_snapshot` — find star rating widget on roadmap detail page
  - Tool: `browser_click` — click 4th star
  - Tool: `browser_wait_for` — wait for rating saved toast
  - Tool: `browser_take_screenshot` — label `11-roadmap-rated`

- [ ] **Step 2: Clone the roadmap**
  - Tool: `browser_snapshot` — find "Clone" button
  - Tool: `browser_click` — click Clone
  - Tool: `browser_wait_for` — wait for success toast or redirect to cloned roadmap
  - Tool: `browser_take_screenshot` — label `11-roadmap-cloned`

---

## Task 12: Learning Journey — View and Navigate Roadmap

**What we're checking:** Learning Journey page shows roadmap nodes, user can click through steps.

- [ ] **Step 1: Navigate to Learning Journey**
  - Tool: `browser_navigate` → `http://localhost:5173/learning-journey`
  - Tool: `browser_take_screenshot` — label `12-learning-journey`

- [ ] **Step 2: Verify roadmap or empty state**
  - Tool: `browser_snapshot` — assert either a roadmap with nodes, or a "Start your journey" empty state CTA
  - Tool: `browser_take_screenshot` — label `12-journey-state`

---

## Task 13: Spaced Repetition Reviews

**What we're checking:** Review page loads, shows cards due for review (or empty state), and completing a review updates progress.

- [ ] **Step 1: Navigate to Review**
  - Tool: `browser_navigate` → `http://localhost:5173/reviews`
  - Tool: `browser_take_screenshot` — label `13-reviews-page`

- [ ] **Step 2: Inspect review state**
  - Tool: `browser_snapshot` — assert either: review cards with difficulty ratings (1-5), or "No reviews due" empty state
  - Pass if: no error boundary, page renders

- [ ] **Step 3: Complete a review (if cards exist)**
  - Tool: `browser_click` — click "Flip" or "Show Answer" button if visible
  - Tool: `browser_take_screenshot` — label `13-review-card-flipped`
  - Tool: `browser_click` — click difficulty rating (e.g. "Good" / rating 3)
  - Tool: `browser_wait_for` — wait for next card or completion state
  - Tool: `browser_take_screenshot` — label `13-review-completed`

---

## Task 14: AI Recommendations

**What we're checking:** AI Recommendations page loads and shows personalized suggestions.

- [ ] **Step 1: Navigate to AI Recommendations**
  - Tool: `browser_navigate` → `http://localhost:5173/ai-recommendations`
  - Tool: `browser_take_screenshot` — label `14-ai-recommendations`

- [ ] **Step 2: Inspect recommendations**
  - Tool: `browser_snapshot` — assert recommendation cards visible, or loading state, or "Configure your interests" prompt
  - Pass if: no error boundary crash

- [ ] **Step 3: Interact with a recommendation (if shown)**
  - Tool: `browser_click` — click first recommendation card or "Learn More" button
  - Tool: `browser_take_screenshot` — label `14-recommendation-clicked`

---

## Task 15: Progress Page

**What we're checking:** Progress page renders charts and statistics without crashing.

- [ ] **Step 1: Navigate to Progress**
  - Tool: `browser_navigate` → `http://localhost:5173/progress`
  - Tool: `browser_take_screenshot` — label `15-progress-page`

- [ ] **Step 2: Verify sections load**
  - Tool: `browser_snapshot` — assert visible: streak count, progress charts or stats, "No data yet" state (acceptable if no sessions completed)
  - Pass if: no error boundary, charts rendered or empty states shown

---

## Task 16: Quests Page

**What we're checking:** Quests page loads and shows active/completed quests.

- [ ] **Step 1: Navigate to Quests**
  - Tool: `browser_navigate` → `http://localhost:5173/quests`
  - Tool: `browser_take_screenshot` — label `16-quests-page`

- [ ] **Step 2: Verify quests displayed**
  - Tool: `browser_snapshot` — assert quest cards or empty state visible
  - Pass if: page renders without error

---

## Task 17: Achievements Page

**What we're checking:** Achievements page shows earned and locked achievements.

- [ ] **Step 1: Navigate to Achievements**
  - Tool: `browser_navigate` → `http://localhost:5173/achievements`
  - Tool: `browser_take_screenshot` — label `17-achievements-page`

- [ ] **Step 2: Verify achievement grid**
  - Tool: `browser_snapshot` — assert achievement cards visible (locked or earned), or empty state
  - Pass if: page renders without error

---

## Task 18: User Profile Page

**What we're checking:** Public profile page renders for the test user.

- [ ] **Step 1: Navigate to own profile**
  - Tool: `browser_navigate` → `http://localhost:5173/profile/testuser`
  - Tool: `browser_take_screenshot` — label `18-user-profile`

- [ ] **Step 2: Verify profile elements**
  - Tool: `browser_snapshot` — assert: username "testuser" visible, public roadmaps section, bio/avatar area
  - Pass if: page renders (even if empty — new user has no content yet)

---

## Task 19: Error Handling — 404 and Error Boundary

**What we're checking:** Unknown routes redirect to dashboard; ErrorBoundary catches rendering failures gracefully.

- [ ] **Step 1: Navigate to unknown route**
  - Tool: `browser_navigate` → `http://localhost:5173/this-route-does-not-exist`
  - Tool: `browser_snapshot` — assert redirect to `/` (dashboard), NOT a blank page or browser 404
  - Tool: `browser_take_screenshot` — label `19-unknown-route`

- [ ] **Step 2: Navigate to route with invalid ID**
  - Tool: `browser_navigate` → `http://localhost:5173/roadmap/invalid-id-that-does-not-exist`
  - Tool: `browser_snapshot` — assert: error message shown gracefully, NOT a white screen crash
  - Tool: `browser_take_screenshot` — label `19-invalid-id`

---

## Task 20: Responsive Layout — Mobile View

**What we're checking:** App is usable on mobile viewport (375px wide).

- [ ] **Step 1: Resize to mobile**
  - Tool: `browser_resize` → width=`375`, height=`812`
  - Tool: `browser_navigate` → `http://localhost:5173/`
  - Tool: `browser_take_screenshot` — label `20-mobile-dashboard`

- [ ] **Step 2: Verify sidebar behavior on mobile**
  - Tool: `browser_snapshot` — assert hamburger menu or collapsed sidebar visible
  - Tool: `browser_take_screenshot` — label `20-mobile-sidebar`

- [ ] **Step 3: Verify login page on mobile**
  - Tool: `browser_navigate` → `http://localhost:5173/login`
  - Tool: `browser_take_screenshot` — label `20-mobile-login`
  - Pass if: form is readable and not overflowing

- [ ] **Step 4: Restore to desktop**
  - Tool: `browser_resize` → width=`1280`, height=`800`

---

## Test Run Summary Template

After completing all tasks, produce a report in this format:

```
## AlphaBrain QA Results — [date]

| # | Feature                        | Status | Notes |
|---|-------------------------------|--------|-------|
| 1 | Login page render              | ✅/❌  |       |
| 2 | Register new account           | ✅/❌  |       |
| 3 | Logout & login                 | ✅/❌  |       |
| 4 | Dashboard hero & stats         | ✅/❌  |       |
| 5 | Schedule — create session      | ✅/❌  |       |
| 6 | Topics — create topic          | ✅/❌  |       |
| 7 | Notes — create note            | ✅/❌  |       |
| 8 | Knowledge Graph — add node     | ✅/❌  |       |
| 9 | Knowledge Graph — AI suggest   | ✅/❌  |       |
|10 | Roadmaps — browse & create     | ✅/❌  |       |
|11 | Roadmap — rate & clone         | ✅/❌  |       |
|12 | Learning Journey               | ✅/❌  |       |
|13 | Spaced Repetition Reviews      | ✅/❌  |       |
|14 | AI Recommendations             | ✅/❌  |       |
|15 | Progress Page                  | ✅/❌  |       |
|16 | Quests Page                    | ✅/❌  |       |
|17 | Achievements Page              | ✅/❌  |       |
|18 | User Profile                   | ✅/❌  |       |
|19 | Error Handling / 404s          | ✅/❌  |       |
|20 | Responsive / Mobile            | ✅/❌  |       |

Bugs found: [list]
Screenshots saved: [count]
```
