package com.alphabrain.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * A very simple health check controller with no dependencies
 */
@RestController
public class SimpleHealthController {

    /**
     * Simple health check endpoint for basic connectivity testing
     */
    @GetMapping("/api/simple-health")
    public ResponseEntity<Map<String, String>> simpleHealth() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        return ResponseEntity.ok(response);
    }
} 