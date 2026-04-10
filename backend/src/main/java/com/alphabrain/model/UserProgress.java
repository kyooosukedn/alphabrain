package com.alphabrain.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_progress")
public class UserProgress {
    
    @Id
    private String id;
    
    private String userId;
    private String roadmapId;
    
    // Overall progress percentage
    private int progressPercentage;
    
    // List of completed item IDs
    private List<String> completedItemIds = new ArrayList<>();
    
    // Detailed progress for each item
    private List<ItemProgress> itemProgress = new ArrayList<>();
    
    // Time spent in minutes
    private int totalTimeSpent;
    
    // Last activity timestamp
    private LocalDateTime lastActivityAt;
    
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ItemProgress {
        private String itemId;
        private int progressPercentage;
        private String status; // NOT_STARTED, IN_PROGRESS, COMPLETED
        private int timeSpentMinutes;
        private List<String> completedResourceIds = new ArrayList<>();
        private LocalDateTime startedAt;
        private LocalDateTime completedAt;
        private String notes;
    }
} 