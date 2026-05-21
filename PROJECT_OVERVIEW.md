# AlphaBrain: Your Personal Lifelong Learning Companion

## Vision

AlphaBrain is your personal lifelong learning companion designed to transform how you track, visualize, and expand your knowledge. By representing your entire learning journey as an interconnected knowledge graph, AlphaBrain helps you see the big picture while allowing you to deep-dive into specific topics at any level of detail.

Unlike traditional learning management systems that treat courses as isolated units, AlphaBrain connects everything you learn into a comprehensive knowledge network, showing relationships between concepts and helping you build a more complete understanding of your interests and studies over time.

## Key Differentiators

1. **Unified Knowledge Graph**: All your learning is visualized as an interconnected graph where each node represents a topic, skill, or concept you've studied, with connections showing relationships between them.

2. **Deep-Dive Capability**: Click on any node to explore that topic in depth, seeing detailed resources, your learning progress, and connections to related topics.

3. **Scope Definition Assistant**: AI helps you define the scope of what you want to learn, whether it's a quick skill for immediate use or a deep subject for mastery over years.

4. **Lifetime Knowledge Repository**: Unlike course-based platforms, AlphaBrain is designed to be your lifelong learning companion, tracking everything you learn over your entire life.

5. **Adaptive Recommendations**: The system evolves with you, continuously refining suggestions based on your learning patterns, goals, and existing knowledge.

## Current Features

### Learning Journey Tracking

- **Session Tracking**: Record your study sessions with detailed metrics
- **Progress Visualization**: See how far you've come in mastering topics
- **Learning Calendar**: Schedule and track your learning activities
- **Topic Organization**: Categorize and tag your learning subjects

### AI Recommendations

- **Learning Paths**: Personalized roadmaps for mastering topics
- **Next Steps**: Intelligent suggestions on what to learn next
- **Roadmap Generation**: AI-created learning journeys based on your goals

## Coming Soon: Interactive Knowledge Graph

The next major evolution of AlphaBrain is the interactive knowledge graph that will:

1. **Visualize Your Knowledge**: See your entire learning journey as an interconnected map
2. **Enable Deep Exploration**: Click any node to dive deep into that specific topic
3. **Show Relationships**: Visualize how different concepts connect and build on each other
4. **Track Progress Visually**: See your mastery level for each node at a glance
5. **Guide Your Journey**: Highlight recommended paths through the knowledge landscape

## How AlphaBrain Works

### 1. Define Your Learning Scope

Whether you're learning something short-term (like a new programming language for a project) or long-term (like mastering physics), AlphaBrain helps you define the scope of your learning goals. The AI assistant helps break down complex topics into manageable chunks and suggests realistic timeframes.

### 2. Visualize Your Knowledge Graph

Your learning is represented as an interactive graph where:
- **Nodes** represent topics, skills, concepts, or resources
- **Edges** show relationships (prerequisites, related topics, etc.)
- **Colors** indicate mastery level or completion status
- **Size** can represent importance or time invested

### 3. Deep-Dive Into Any Topic

Click on any node to:
- See detailed information about that topic
- Access related learning resources
- View your progress history with that subject
- Find connections to other topics you've studied
- Get recommendations for next steps in that area

### 4. Track Everything You Learn

As you study, AlphaBrain maintains a comprehensive record of:
- Study sessions and time invested
- Resources you've used
- Notes and insights
- Progress assessments
- Connections to other knowledge areas

### 5. Receive Intelligent Recommendations

The AI analyzes your knowledge graph to suggest:
- Areas that need reinforcement
- New topics that connect to your interests
- Optimal learning sequences
- Resources matched to your learning style

## Technical Architecture

### Backend

- **Framework**: Spring Boot (Java)
- **Primary Database**: MongoDB for document storage
- **Graph Database**: Neo4j (planned) for knowledge graph representation
- **Authentication**: JWT-based security
- **AI Integration**: Google Gemini API for recommendations
- **APIs**: RESTful endpoints (GraphQL planned)

### Frontend

- **Framework**: React with TypeScript
- **State Management**: Redux with Redux Toolkit
- **Graph Visualization**: Force-directed graph library (planned)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Responsive Design**: Works across devices

## Development Roadmap

See [MILESTONES.md](./MILESTONES.md) for our detailed development plan.

## Getting Started

### Running the Backend

```bash
cd backend
# Set environment variables in application.properties
# GEMINI_API_KEY=your_key_here
mvn spring-boot:run
```

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

## The Future of Personal Learning

AlphaBrain is pioneering a new approach to personal learning management that breaks away from course-centric models. Instead of isolated learning experiences, we're building a platform that represents the natural, interconnected way that human knowledge actually works.

By creating a system that can grow with you throughout your life, adapting to changing interests and goals, AlphaBrain aims to be the ultimate companion for lifelong learners who want to see the big picture while mastering the details. 