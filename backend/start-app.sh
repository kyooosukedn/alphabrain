#!/bin/bash

# Start MongoDB container
echo "Starting MongoDB container..."
docker-compose up -d

# Wait for MongoDB to start
echo "Waiting for MongoDB to start..."
sleep 5

# Build and run the Spring Boot application
echo "Building and running the application..."
./mvnw spring-boot:run 