package com.alphabrain.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alphabrain.service.AIRecommendationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Dummy controller for AI recommendations.
 * AI features are disabled to focus on graph-based learning.
 */
@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@Slf4j
public class AIRecommendationController {

    private final AIRecommendationService aiRecommendationService;
    
    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok(aiRecommendationService.getDummyRecommendation());
    }
} 