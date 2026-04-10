package com.alphabrain.service;

import com.alphabrain.model.jpa.User;
import com.alphabrain.model.request.AuthRequest;
import com.alphabrain.model.request.RegisterRequest;
import com.alphabrain.model.response.AuthResponse;
import com.alphabrain.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final TemporaryUserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        log.info("Processing registration for user: {}", request.getUsername());
        
        try {
            // Validate request
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                throw new IllegalArgumentException("Username is required");
            }
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                throw new IllegalArgumentException("Email is required");
            }
            
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Password is required");
            }
            
            if (request.getPassword().length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters long");
            }
            
            // Check if username exists
            if (userService.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("Username is already taken");
            }
            
            // Check if email exists
            if (userService.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email is already in use");
            }
            
            // Create new user
            Set<String> roles = new HashSet<>();
            roles.add("ROLE_USER");
            
            User user = userService.createUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                roles
            );
            
            log.info("User registered successfully: {}", user.getUsername());
            
            // Generate token for auto-login after registration
            String token = jwtTokenProvider.generateToken(user.getUsername());
            
            return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .message("User registered successfully")
                .success(true)
                .build();
            
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation during registration: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Username or email already exists");
        } catch (DataAccessException e) {
            log.error("Database error during registration: {}", e.getMessage(), e);
            throw new RuntimeException("Database error during registration");
        } catch (IllegalArgumentException e) {
            log.error("Invalid input during registration: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error during registration: {}", e.getMessage(), e);
            throw new RuntimeException("An unexpected error occurred during registration");
        }
    }

    public AuthResponse authenticate(AuthRequest request) {
        log.info("Authentication attempt for user: {}", request.getUsername());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );
            
            // If authentication is successful, we reach this point
            String token = jwtTokenProvider.generateToken(request.getUsername());
            log.info("Authentication successful for user: {}", request.getUsername());
            
            return AuthResponse.builder()
                .token(token)
                .username(request.getUsername())
                .message("Authentication successful")
                .success(true)
                .build();
                
        } catch (AuthenticationException e) {
            log.warn("Authentication failed for user {}: {}", request.getUsername(), e.getMessage());
            throw new UsernameNotFoundException("Invalid username or password");
        } catch (Exception e) {
            log.error("Error during authentication: {}", e.getMessage(), e);
            throw new RuntimeException("An unexpected error occurred during authentication");
        }
    }
} 