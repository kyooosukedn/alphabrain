package com.alphabrain.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alphabrain.dto.ai.AIRecommendationResponse;
import com.alphabrain.service.AIRecommendationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class AIRecommendationController {

    private final AIRecommendationService aiRecommendationService;

    @GetMapping("/status")
    public ResponseEntity<AIRecommendationResponse> getStatus(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            // Unauthenticated — just return availability info
            return ResponseEntity.ok(AIRecommendationResponse.builder()
                    .aiEnabled(aiRecommendationService.isAvailable())
                    .statusMessage(aiRecommendationService.isAvailable()
                            ? "AI recommendations are available. Log in to get personalized suggestions."
                            : "AI recommendations are disabled — no API key configured.")
                    .build());
        }
        return ResponseEntity.ok(aiRecommendationService.getRecommendations(userDetails.getUsername()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AIRecommendationResponse> refresh(
            @AuthenticationPrincipal UserDetails userDetails) {
        aiRecommendationService.invalidateCache(userDetails.getUsername());
        return ResponseEntity.ok(aiRecommendationService.getRecommendations(userDetails.getUsername()));
    }
}
