package com.alphabrain.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.alphabrain.model.User;
import com.alphabrain.service.AIRecommendationService;
import lombok.Data;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    
    @Autowired
    private AIRecommendationService aiService;
    
    @Data
    public static class ChatRequest {
        private String message;
        private String context;
    }
    
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @AuthenticationPrincipal User user,
            @RequestBody ChatRequest request) {
        try {
            // Using the available dummy recommendation method
            String response = aiService.getDummyRecommendation();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing message: " + e.getMessage());
        }
    }
}