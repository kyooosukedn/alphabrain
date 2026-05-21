# AlphaBrain: Your Complete Learning Journey Companion

This document tracks the development progress of AlphaBrain, your personal lifelong learning companion that tracks everything you've learned and helps guide your future learning path.

## Core Features

- [x] User Authentication & Authorization
- [x] Dashboard with Learning Metrics
- [x] Progress Tracking
- [x] Study Session Scheduling
- [x] Topics Management
- [x] AI Recommendations (MVP)

## Personal Learning Journey Features

### Phase 1: Foundation (Completed)
- [x] Track learning sessions and study time
- [x] Organize topics by categories
- [x] View progress metrics in dashboard
- [x] Basic AI recommendations for what to learn next
- [x] Cleanup repository and consolidate duplicate components

### Phase 2: Enhanced Learning Graph (Next)
- [ ] Interactive knowledge graph visualization
- [ ] Node-based learning path representation
- [ ] Deep-dive capability into any knowledge node
- [ ] Visual progress indicators on each learning node
- [ ] Timeline view of learning journey

### Phase 3: Advanced Personal Learning Assistant
- [ ] AI-powered learning scope definition
  - [ ] Help define learning objectives (short-term vs long-term)
  - [ ] Suggest realistic timeframes for mastery
  - [ ] Decompose complex topics into manageable nodes
- [ ] Context-aware recommendations based on your learning history
- [ ] "Deep dive" mode for exploring specific topics in detail
- [ ] Learning style adaptation
- [ ] Spaced repetition integration for better retention

### Phase 4: Comprehensive Knowledge Management
- [ ] Content aggregation from your learning resources
- [ ] Note integration with learning nodes
- [ ] Automatic knowledge connections between seemingly unrelated topics
- [ ] Personal learning wiki generation
- [ ] External resource integration (books, courses, videos)
- [ ] Learning breadcrumbs for easy navigation of complex topics

### Phase 5: Advanced AI Learning Companion
- [ ] Natural language learning goal setting
- [ ] Proactive learning suggestions based on interests
- [ ] Knowledge gap detection and remediation
- [ ] Personalized difficulty scaling
- [ ] Life event integration (learning based on career/personal changes)

## Technical Implementation Roadmap

### Knowledge Graph Backend
- [ ] Neo4j integration for graph database storage
- [ ] GraphQL API for flexible graph querying
- [ ] Real-time graph updates as you learn
- [ ] Topic relationship inference engine

### Interactive Frontend
- [ ] Force-directed graph visualization
- [ ] Zoom and pan interface for exploring knowledge nodes
- [ ] Node expansion for detailed topic exploration
- [ ] Path visualization between prerequisites and advanced topics
- [ ] Split view: graph + detailed content

### AI Integration
- [ ] Content extraction from learning materials
- [ ] Automated node creation from learning activity
- [ ] Concept relationship mapping
- [ ] Auto-tagging and categorization
- [ ] Learning path generation based on end goals

### User Experience
- [ ] Seamless transitions between overview and deep-dive modes
- [ ] Mobile-optimized graph interactions
- [ ] Voice commands for hands-free learning tracking
- [ ] Daily/weekly learning summaries and recommendations

## Feature Benefits

- **Holistic Learning Map**: See your entire learning journey at a glance
- **Never Lose Progress**: Track everything you've ever studied
- **Intelligent Recommendations**: Let AI suggest what to learn next based on your goals
- **Deep Understanding**: Visualize how different concepts connect with each other
- **Adaptive Learning**: The system evolves with you as your learning needs change
- **Life Integration**: Connect your learning to real-world goals and applications

## Current Development Focus

We're currently focused on implementing Phase 2, transforming the basic UI into an interactive knowledge graph that allows you to visualize your learning journey and explore topics in depth. This graph-based approach will show connections between topics, making it easier to understand how different concepts relate to your overall learning goals.

## Milestones

- [x] Clean up repository and consolidate duplicate components
- [x] Implement proper status tracking for learning sessions with enums
- [ ] Complete user authentication system with JWT 