-- Insert default users with encoded passwords (these are example BCrypt encodings)
INSERT INTO users (username, password, email, created_at) 
VALUES ('admin', '$2a$10$r.qehVAFAKnwYwZe3QuFI.zGr/CuZWGFVhJDcwjzN5a9bcYw7D6M2', 'admin@example.com', CURRENT_TIMESTAMP);

INSERT INTO users (username, password, email, created_at) 
VALUES ('user', '$2a$10$0/e5ldwZGKQn.d1SdLJ37Oyl0rnhJQ6K90S1qBuRJ3yZCwlr3kfBe', 'user@example.com', CURRENT_TIMESTAMP);

-- For debugging, add a test user with known credentials
INSERT INTO users (username, password, email, created_at) 
VALUES ('test', '$2a$10$0/e5ldwZGKQn.d1SdLJ37Oyl0rnhJQ6K90S1qBuRJ3yZCwlr3kfBe', 'test@example.com', CURRENT_TIMESTAMP);

-- Insert roles for default users (H2 compatible)
INSERT INTO user_roles (user_id, role)
SELECT id, 'ROLE_ADMIN' FROM users WHERE username = 'admin';

INSERT INTO user_roles (user_id, role)
SELECT id, 'ROLE_USER' FROM users WHERE username = 'admin';

INSERT INTO user_roles (user_id, role)
SELECT id, 'ROLE_USER' FROM users WHERE username = 'user';

INSERT INTO user_roles (user_id, role)
SELECT id, 'ROLE_USER' FROM users WHERE username = 'test'; 