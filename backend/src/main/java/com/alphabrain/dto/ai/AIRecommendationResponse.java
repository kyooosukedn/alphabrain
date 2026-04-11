package com.alphabrain.dto.ai;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIRecommendationResponse {
    private boolean aiEnabled;
    private String statusMessage;
    private List<LearningPath> learningPaths;
    private SuggestedRoadmap roadmap;
    private List<NextStep> nextSteps;
    private Instant generatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LearningPath {
        private String id;
        private String title;
        private String description;
        private int difficulty;
        private int estimatedHours;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SuggestedRoadmap {
        private String title;
        private String description;
        private String category;
        private String difficulty;
        private int estimatedHours;
        private int completionPercentage;
        private List<Milestone> milestones;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Milestone {
        private String label;
        private boolean done;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NextStep {
        private String id;
        private String title;
        private String description;
        private int difficulty;
        private int estimatedMinutes;
    }
}
