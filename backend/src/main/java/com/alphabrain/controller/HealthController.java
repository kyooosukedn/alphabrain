package com.alphabrain.controller;

import com.alphabrain.repository.jpa.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class HealthController {

    private final JpaUserRepository userRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        log.info("Health check request received at /api/health");
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "AlphaBrain API is running");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/simple")
    public ResponseEntity<String> simpleHealthCheck() {
        log.info("Simple health check request received at /api/health/simple");
        return ResponseEntity.ok("OK");
    }

    /**
     * More detailed health check endpoint
     */
    @GetMapping("/system-health")
    public ResponseEntity<Map<String, Object>> systemHealthCheck() {
        log.info("System health check request received at /api/health/system-health");
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "AlphaBrain Backend");
        response.put("timestamp", System.currentTimeMillis());
        
        try {
            // Add database connection status
            response.put("databaseConnected", true);
            response.put("userCount", userRepository.count());
        } catch (Exception e) {
            log.error("Error accessing database: {}", e.getMessage());
            response.put("databaseConnected", false);
            response.put("databaseError", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/debug")
    public ResponseEntity<?> debugInfo() {
        log.info("Debug information request received");
        Map<String, Object> debugInfo = new HashMap<>();
        
        try {
            // Add JPA user repository info
            debugInfo.put("jpaUserCount", userRepository.count());
            debugInfo.put("usersExist", userRepository.count() > 0);
            
            // Add system info
            debugInfo.put("javaVersion", System.getProperty("java.version"));
            debugInfo.put("osName", System.getProperty("os.name"));
            debugInfo.put("availableProcessors", Runtime.getRuntime().availableProcessors());
            debugInfo.put("freeMemory", Runtime.getRuntime().freeMemory());
            debugInfo.put("maxMemory", Runtime.getRuntime().maxMemory());
            
            return ResponseEntity.ok(debugInfo);
        } catch (Exception e) {
            log.error("Error getting debug info: {}", e.getMessage(), e);
            Map<String, Object> errorInfo = new HashMap<>();
            errorInfo.put("error", "Failed to retrieve debug info");
            errorInfo.put("message", e.getMessage());
            errorInfo.put("cause", e.getCause() != null ? e.getCause().getMessage() : "Unknown");
            return ResponseEntity.ok(errorInfo);
        }
    }
} 