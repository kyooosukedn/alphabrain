package com.alphabrain.service;

import com.alphabrain.dto.RegisterRequest;
import com.alphabrain.model.User;
import com.alphabrain.repository.UserRepository;
import com.alphabrain.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public Map<String, Object> register(RegisterRequest request) {
        log.info("Processing registration for user: {}", request.getUsername());

        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Set.of("ROLE_USER"));

        userRepository.save(user);
        log.info("User registered successfully: {}", user.getUsername());

        String token = jwtTokenProvider.generateToken(user.getUsername());

        return Map.of(
            "token", token,
            "username", user.getUsername(),
            "message", "User registered successfully",
            "success", true
        );
    }

    public Map<String, Object> login(String username, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            String token = jwtTokenProvider.generateToken(authentication);
            log.info("User logged in successfully: {}", username);

            return Map.of(
                "token", token,
                "username", username,
                "message", "Login successful",
                "success", true
            );
        } catch (AuthenticationException e) {
            log.warn("Authentication failed for user {}: {}", username, e.getMessage());
            throw e;
        }
    }
}
