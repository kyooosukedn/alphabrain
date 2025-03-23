package com.alphabrain.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CreateSessionRequest {
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String priority;
    private String category;
    private String userId;
    
}
