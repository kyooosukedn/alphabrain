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

/**
 * Represents a learning roadmap composed of knowledge nodes and items.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "roadmaps")
public class Roadmap {
    
    @Id
    private String id;
    
    private String title;
    private String description;
    private String category;
    
    // Thumbnail image URL
    private String thumbnailUrl;
    
    // List of items in this roadmap
    private List<RoadmapItem> items = new ArrayList<>();
    
    // IDs of nodes included in this roadmap
    private List<String> nodeIds = new ArrayList<>();
    
    // Optional structure info for UI layout
    private RoadmapStructure structure;
    
    // User who created this roadmap (null for system roadmaps)
    private String userId;
    
    // Overall completion percentage
    private int completionPercentage;
    
    // Is this a public roadmap that can be seen by other users?
    private boolean isPublic;
    
    // Is this a template roadmap that can be cloned?
    private boolean isTemplate;
    
    // Tags for searching
    private List<String> tags = new ArrayList<>();
    
    // Difficulty level (BEGINNER, INTERMEDIATE, ADVANCED)
    private String difficultyLevel;
    
    // Estimated total time to complete in minutes
    private int estimatedTimeToComplete;

    // Social / discovery fields
    private double averageRating;
    private int ratingCount;
    private int cloneCount;
    private String authorUsername;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoadmapItem {
        private String id;
        private String title;
        private String description;
        private String type; // TASK, MILESTONE, RESOURCE, etc.
        private int order;
        private boolean required;
        private boolean completed;
        private int progressPercentage;
        private List<String> prerequisites = new ArrayList<>();
        private List<Resource> resources = new ArrayList<>();
        private LocalDateTime completedAt;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoadmapStructure {
        // For storing layout information (coordinates of nodes, etc.)
        private List<NodePosition> nodePositions = new ArrayList<>();
        
        // For storing connection information
        private List<NodeConnection> connections = new ArrayList<>();
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NodePosition {
        private String nodeId;
        private int x;
        private int y;
        private String group; // Optional grouping
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NodeConnection {
        private String sourceNodeId;
        private String targetNodeId;
        private String label; // Optional connection label
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Resource {
        private String title;
        private String url;
        private String type; // VIDEO, ARTICLE, BOOK, etc.
        private int estimatedTimeToComplete; // in minutes
    }
} 