package com.alphabrain.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.alphabrain.service.AIRecommendationService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final AIRecommendationService aiService;

    @Data
    public static class ChatRequest {
        private String message;
        private String context;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChatRequest request) {
        try {
            var recommendations = aiService.getRecommendations(userDetails.getUsername());
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error processing message: " + e.getMessage());
        }
    }
}
