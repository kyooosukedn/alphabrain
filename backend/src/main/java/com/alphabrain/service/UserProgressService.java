package com.alphabrain.service;

import java.util.List;

import com.alphabrain.model.UserProgress;

public interface UserProgressService {
    
    // CRUD operations
    UserProgress createProgress(UserProgress progress);
    UserProgress updateProgress(String id, UserProgress progress);
    void deleteProgress(String id);
    UserProgress getProgress(String id);
    
    // User specific operations
    UserProgress getUserRoadmapProgress(String userId, String roadmapId);
    List<UserProgress> getUserProgress(String userId);
    List<UserProgress> getUserCompletedRoadmaps(String userId);
    List<UserProgress> getUserInProgressRoadmaps(String userId);
    List<UserProgress> getUserNotStartedRoadmaps(String userId);
    
    // Statistics
    long countUserCompletedRoadmaps(String userId);
    long countUserInProgressRoadmaps(String userId);
    double getAverageCompletionTime(String roadmapId);
    
    // Progress updates
    UserProgress updateItemProgress(String progressId, String itemId, int percentage);
    UserProgress markItemCompleted(String progressId, String itemId);
    UserProgress updateTimeSpent(String progressId, int additionalMinutes);
} 