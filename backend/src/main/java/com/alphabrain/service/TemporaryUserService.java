package com.alphabrain.service;

import com.alphabrain.model.jpa.User;
import com.alphabrain.repository.jpa.JpaUserRepository;
import org.springframework.context.annotation.Primary;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Primary
@Slf4j
public class TemporaryUserService {

    private final JpaUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TemporaryUserService(JpaUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        
        // Create a default admin user if no users exist
        try {
            if (userRepository.count() == 0) {
                createDefaultUser();
            } else {
                // Log existing users for debugging
                List<User> users = userRepository.findAll();
                log.info("Found {} existing users", users.size());
                users.forEach(user -> log.info("User exists: {}", user.getUsername()));
            }
        } catch (Exception e) {
            log.warn("Failed to check user count or create default users: {}", e.getMessage());
            log.debug("Database may not be initialized yet", e);
        }
    }
    
    @Transactional
    private void createDefaultUser() {
        try {
            User admin = new User("admin", passwordEncoder.encode("admin123"), "admin@example.com");
            admin.getRoles().add("ROLE_ADMIN");
            admin.getRoles().add("ROLE_USER");
            userRepository.save(admin);
            
            User user = new User("user", passwordEncoder.encode("user123"), "user@example.com");
            user.getRoles().add("ROLE_USER");
            userRepository.save(user);
            
            User test = new User("test", passwordEncoder.encode("test123"), "test@example.com");
            test.getRoles().add("ROLE_USER");
            userRepository.save(test);
            
            log.info("Default users created successfully");
        } catch (DataIntegrityViolationException e) {
            log.warn("Could not create default users due to data integrity issue - they may already exist: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Failed to create default users: {}", e.getMessage(), e);
        }
    }
    
    public Optional<User> findByUsername(String username) {
        try {
            log.debug("Looking up user by username: {}", username);
            Optional<User> user = userRepository.findByUsername(username);
            if (user.isPresent()) {
                log.debug("Found user by username: {}", username);
            } else {
                log.debug("User not found by username: {}", username);
            }
            return user;
        } catch (DataAccessException e) {
            log.error("Database error finding user by username: {}", username, e);
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error finding user by username: {}", username, e);
            return Optional.empty();
        }
    }
    
    public Optional<User> findByEmail(String email) {
        try {
            log.debug("Looking up user by email: {}", email);
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                log.debug("Found user by email: {}", email);
            } else {
                log.debug("User not found by email: {}", email);
            }
            return user;
        } catch (DataAccessException e) {
            log.error("Database error finding user by email: {}", email, e);
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error finding user by email: {}", email, e);
            return Optional.empty();
        }
    }
    
    @Transactional
    public User createUser(String username, String email, String password, Set<String> roles) {
        try {
            log.debug("Creating new user: {}, email: {}", username, email);
            User user = new User(username, passwordEncoder.encode(password), email);
            user.setRoles(roles);
            User savedUser = userRepository.save(user);
            log.debug("User created successfully: {}", username);
            return savedUser;
        } catch (DataIntegrityViolationException e) {
            log.error("Could not create user due to constraint violation. Username: {}, Email: {}", username, email, e);
            throw new RuntimeException("Username or email already exists", e);
        } catch (DataAccessException e) {
            log.error("Database error creating user: {}", username, e);
            throw new RuntimeException("Database error occurred while creating user", e);
        } catch (Exception e) {
            log.error("Unexpected error creating user: {}", username, e);
            throw new RuntimeException("An unexpected error occurred while creating user", e);
        }
    }
    
    public boolean existsByUsername(String username) {
        try {
            boolean exists = userRepository.existsByUsername(username);
            log.debug("Checking if username exists: {} - Result: {}", username, exists);
            return exists;
        } catch (DataAccessException e) {
            log.error("Database error checking if username exists: {}", username, e);
            return false;
        } catch (Exception e) {
            log.error("Error checking if username exists: {}", username, e);
            return false;
        }
    }
    
    public boolean existsByEmail(String email) {
        try {
            boolean exists = userRepository.existsByEmail(email);
            log.debug("Checking if email exists: {} - Result: {}", email, exists);
            return exists;
        } catch (DataAccessException e) {
            log.error("Database error checking if email exists: {}", email, e);
            return false;
        } catch (Exception e) {
            log.error("Error checking if email exists: {}", email, e);
            return false;
        }
    }
    
    // Helper method to list all users - useful for debugging
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
} 