# AlphaBrain Backend

AlphaBrain is a learning journey companion that helps you track and visualize your learning progress.

## Features

- **User Authentication & Management**
- **Learning Graph Visualization**
- **Study Session Tracking**
- **Knowledge Node Management**
- **Learning Roadmaps**
- **Streak System for Consistent Learning**

## Technologies

- Java 21
- Spring Boot 3.4
- MongoDB
- Spring Security with JWT
- RESTful API

## Getting Started

### Prerequisites

- Java 21
- MongoDB (local instance or remote)
- Maven

### Configuration

Edit the `application.properties` file to configure:

```properties
# MongoDB connection
spring.data.mongodb.uri=mongodb://localhost:27017/alphabrain

# JWT settings
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000
```

### Running the Application

```bash
mvn spring-boot:run
```

The application will be available at `http://localhost:8081`.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and get JWT tokens
- `POST /api/auth/refresh` - Refresh an expired JWT token

### Users

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### Roadmaps

- `GET /api/roadmaps` - List all roadmaps
- `GET /api/roadmaps/{id}` - Get a specific roadmap
- `POST /api/roadmaps` - Create a new roadmap
- `PUT /api/roadmaps/{id}` - Update a roadmap
- `DELETE /api/roadmaps/{id}` - Delete a roadmap

### Knowledge Nodes

- `GET /api/nodes` - List all knowledge nodes
- `GET /api/nodes/{id}` - Get a specific node
- `POST /api/nodes` - Create a new node
- `PUT /api/nodes/{id}` - Update a node
- `DELETE /api/nodes/{id}` - Delete a node

### Study Sessions

- `GET /api/sessions` - List user's study sessions
- `GET /api/sessions/{id}` - Get a specific session
- `POST /api/sessions` - Create a new session
- `PUT /api/sessions/{id}` - Update a session
- `DELETE /api/sessions/{id}` - Delete a session
- `PUT /api/sessions/{id}/complete` - Complete a session

### Learning Streaks

- `GET /api/streaks/my-streak` - Get user's streak information
- `POST /api/streaks/record-activity` - Record learning activity
- `GET /api/streaks/top-streaks` - Get top users by streak
- `GET /api/streaks/top-study-time` - Get top users by study time

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 