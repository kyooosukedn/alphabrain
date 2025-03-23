package com.alphabrain.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "sessions")
@Data
public class Session {

    @Id
    private String id;

    private String title;
    private String description;
    private String priority;
    private String category;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String status; // PLANNED, IN_PROGRESS, COMPLETED, CANCELLED

    private String userId; // In a real system, you might store a User relationship instead
    
    private String topicId; // Reference to the Subject/Topic
    
    private Integer completionPercentage; // 0-100 to track partial completion
    private Integer actualDurationMinutes; // Actual time spent (may differ from scheduled)
    private String notes; // Notes taken during or after the session
    private LocalDateTime completedAt; 

    // Constructors
    public Session() {}
    public Session(String title, String description, LocalDateTime startTime, LocalDateTime endTime, String status, String userId, String priority, String category) {
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.userId = userId;
        this.priority = priority;
        this.category = category;
    }

}
