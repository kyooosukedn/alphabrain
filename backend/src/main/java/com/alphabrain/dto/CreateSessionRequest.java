package com.alphabrain.dto;

import java.time.LocalDateTime;

import com.alphabrain.model.SessionStatus;
import lombok.Data;

@Data
public class CreateSessionRequest {
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private SessionStatus status = SessionStatus.PLANNED; // Default to PLANNED
    private String priority;
    private String category;
    private String userId;
    
}
