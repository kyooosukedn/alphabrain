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
 * Represents a node in the knowledge graph, which can be a topic, concept, skill, etc.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "knowledge_nodes")
public class KnowledgeNode {
    
    @Id
    private String id;
    
    private String title;
    private String description;
    private String category;
    
    // Node type: CONCEPT, SKILL, PROJECT, RESOURCE, etc.
    private String nodeType;
    
    // Difficulty level from 1-5
    private int difficultyLevel;
    
    // Estimated time to learn in minutes
    private int estimatedTimeToLearn;
    
    // IDs of prerequisite nodes
    private List<String> prerequisites = new ArrayList<>();
    
    // IDs of nodes that this node leads to
    private List<String> leadsTo = new ArrayList<>();
    
    // Resources attached to this node (URLs, files, etc.)
    private List<Resource> resources = new ArrayList<>();
    
    // User who created this node (null for system nodes)
    private String userId;
    
    // User's progress on this node (0-100)
    private int progress;
    
    // User's mastery level on this node (0-100)
    private int masteryLevel;
    
    // Whether this node is completed
    private boolean completed;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
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

