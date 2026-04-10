package com.alphabrain.security;

import com.alphabrain.model.jpa.User;
import com.alphabrain.service.TemporaryUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final TemporaryUserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Loading user by username: {}", username);
        
        // Try to find by username first
        User user = userService.findByUsername(username)
                .orElseGet(() -> {
                    // If not found by username, try by email
                    return userService.findByEmail(username)
                            .orElseThrow(() -> 
                                new UsernameNotFoundException("User not found with username or email: " + username));
                });
        
        log.debug("Found user: {}", user.getUsername());
        
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(user.getRoles().stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList()))
                .build();
    }
} 