package com.alphabrain.service;

import com.alphabrain.dto.AuthRequest;
import com.alphabrain.dto.RegisterRequest;
import com.alphabrain.model.User;
import com.alphabrain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(AuthRequest request) {
        log.info("Creating user with username: {}", request.getUsername());
        if (userRepository.existsByUsername(request.getUsername())) {
            log.error("Username already exists: {}", request.getUsername());
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);
        
        // Default email if none provided
        user.setEmail(request.getUsername() + "@example.com");
        
        // Set default role
        user.setRoles(Set.of("ROLE_USER"));
        
        log.info("Successfully created user: {}", request.getUsername());
        return userRepository.save(user);
    }
    
    public User createUserFromRegistration(RegisterRequest request) {
        AuthRequest authRequest = new AuthRequest();
        authRequest.setUsername(request.getUsername());
        authRequest.setPassword(request.getPassword());
        
        User user = createUser(authRequest);
        // Set the email from registration request
        user.setEmail(request.getEmail());
        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
