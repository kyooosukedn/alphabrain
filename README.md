# AlphaBrain

A modern web application for task and calendar management with powerful features.

## Tech Stack

### Frontend
- React 18.x with TypeScript
- Vite as build tool
- FullCalendar for calendar functionality
- Radix UI components
- Tailwind CSS for styling

### Backend
- Spring Boot 3.2.x
- Java 17
- Spring Security with JWT
- Spring Data MongoDB
- Maven for dependency management

## Prerequisites
- Java 17 or higher
- Node.js 18.x or higher
- MongoDB 6.x
- Maven 3.x

## Getting Started

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies and build:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```
The frontend will start on `http://localhost:5173`

## MVP Features
- [x] User Authentication (Register/Login)
- [ ] Task Management
  - [ ] Create, Read, Update, Delete tasks
  - [ ] Task categories and priorities
- [ ] Calendar Integration
  - [ ] View tasks in calendar
  - [ ] Schedule new tasks
  - [ ] Drag and drop tasks

## Contributing
1. Ensure you have the correct versions of all prerequisites installed
2. Follow the code style and organization of the existing codebase
3. Write clear commit messages
4. Add appropriate tests for new features
5. Update documentation as needed

## License
MIT License - See LICENSE file for details
