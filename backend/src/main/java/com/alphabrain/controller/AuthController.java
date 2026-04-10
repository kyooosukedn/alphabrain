package com.alphabrain.controller;

import com.alphabrain.dto.AuthRequest;
import com.alphabrain.dto.AuthResponse;
import com.alphabrain.dto.LoginRequest;
import com.alphabrain.dto.LoginResponse;
import com.alphabrain.dto.RegisterRequest;
import com.alphabrain.dto.RegisterResponse;
import com.alphabrain.model.jpa.User;
import com.alphabrain.security.JwtService;
import com.alphabrain.security.JwtTokenProvider;
import com.alphabrain.service.AuthService;
import com.alphabrain.service.TemporaryUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TemporaryUserService temporaryUserService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;

    @GetMapping("/test")
    public String test() {
        return "Auth test endpoint is working!";
    }
    
    /**
     * Debug endpoint - only use in development
     */
    @GetMapping("/debug/users")
    public ResponseEntity<?> getUsers() {
        log.info("Debug endpoint: fetching all users");
        try {
            log.debug("Retrieving all users from temporaryUserService");
            List<User> users = temporaryUserService.getAllUsers();
            log.info("Found {} users in the system", users.size());
            
            // Convert to safe format (without passwords)
            List<Map<String, Object>> safeUsers = new ArrayList<>();
            for (User user : users) {
                Map<String, Object> safeUser = new HashMap<>();
                safeUser.put("id", user.getId());
                safeUser.put("username", user.getUsername());
                safeUser.put("email", user.getEmail());
                safeUser.put("roles", user.getRoles());
                safeUsers.add(safeUser);
            }
                
            Map<String, Object> response = new HashMap<>();
            response.put("userCount", users.size());
            response.put("users", safeUsers);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error retrieving users: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error retrieving users");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("stackTrace", Arrays.toString(e.getStackTrace()));
            errorResponse.put("cause", e.getCause() != null ? e.getCause().getMessage() : "No cause");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            log.info("Login attempt for user: {}", loginRequest.getUsername());
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Generate JWT token
            String token = jwtTokenProvider.generateToken(authentication);
            
            log.info("User logged in successfully: {}", loginRequest.getUsername());
            
            return ResponseEntity.ok(new LoginResponse(token, "Login successful"));
        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for user: {}", loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse(null, "Invalid username or password"));
        } catch (AuthenticationException e) {
            log.error("Authentication failed for user: {}", loginRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse(null, "Authentication failed: " + e.getMessage()));
        } catch (DataAccessException e) {
            log.error("Database error during login for user: {}", loginRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse(null, "Database error during login"));
        } catch (Exception e) {
            log.error("Error during login for user: {}", loginRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse(null, "An unexpected error occurred during login"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        log.info("Registration request received for username: {}", request.getUsername());
        
        try {
            // Create new instance of model-level RegisterRequest
            com.alphabrain.model.request.RegisterRequest modelRequest = new com.alphabrain.model.request.RegisterRequest();
            modelRequest.setUsername(request.getUsername());
            modelRequest.setEmail(request.getEmail());
            modelRequest.setPassword(request.getPassword());
            modelRequest.setFirstName(""); // Default empty value
            modelRequest.setLastName(""); // Default empty value
            
            // Process registration
            com.alphabrain.model.response.AuthResponse modelResponse = authService.register(modelRequest);
            
            // Convert to response map for flexibility
            Map<String, Object> response = new HashMap<>();
            response.put("token", modelResponse.getToken());
            response.put("username", modelResponse.getUsername());
            response.put("message", modelResponse.getMessage());
            response.put("success", modelResponse.isSuccess());
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Validation errors
            log.warn("Invalid registration data: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            // Other errors
            log.error("Registration error: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "An unexpected error occurred during registration");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
