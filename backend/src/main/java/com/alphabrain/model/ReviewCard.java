package com.alphabrain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Spaced repetition review card linked to a KnowledgeNode.
 * Uses SM-2 algorithm parameters.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "review_cards")
@CompoundIndex(name = "user_node_idx", def = "{'userId': 1, 'nodeId': 1}", unique = true)
public class ReviewCard {

    @Id
    private String id;

    private String userId;
    private String nodeId;

    // SM-2 algorithm fields
    @Builder.Default
    private double easeFactor = 2.5;

    @Builder.Default
    private int interval = 0; // days until next review

    @Builder.Default
    private int repetitions = 0; // consecutive correct recalls

    // Scheduling
    private LocalDate nextReviewDate;
    private LocalDateTime lastReviewedAt;

    // Stats
    @Builder.Default
    private int totalReviews = 0;

    @Builder.Default
    private int successfulReviews = 0; // quality >= 3

    // Snapshot of node info (so we don't have to join)
    private String nodeTitle;
    private String nodeCategory;
    private int nodeDifficulty;

    private LocalDateTime createdAt;
}
