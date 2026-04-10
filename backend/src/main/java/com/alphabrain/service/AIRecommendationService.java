package com.alphabrain.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * This is a dummy service since AI features are disabled.
 * Focusing on graph-based learning features instead.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AIRecommendationService {
    
    /**
     * Return a dummy recommendation message 
     */
    public String getDummyRecommendation() {
        return "AI recommendations are currently disabled as we focus on the graph-based learning features.";
    }
} 