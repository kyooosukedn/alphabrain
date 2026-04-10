package com.alphabrain.model;

/**
 * Enum representing the possible statuses of a learning session.
 * Used to track the lifecycle of a session from planning to completion.
 */
public enum SessionStatus {
    /**
     * Session has been scheduled but not yet started
     */
    PLANNED,
    
    /**
     * Session is currently in progress
     */
    IN_PROGRESS,
    
    /**
     * Session has been completed successfully
     */
    COMPLETED,
    
    /**
     * Session was cancelled before completion
     */
    CANCELLED,
    
    /**
     * Session was missed (not started at scheduled time)
     */
    MISSED
} 