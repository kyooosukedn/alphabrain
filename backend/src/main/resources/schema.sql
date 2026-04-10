-- Drop tables if they exist to ensure clean state
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;

-- Create users table with column names matching the JPA entity exactly
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create user_roles table for role mapping
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for faster lookups
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email); 