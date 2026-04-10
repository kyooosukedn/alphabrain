package com.alphabrain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.alphabrain.model.UserProgress;

public interface UserProgressRepository extends MongoRepository<UserProgress, String> {
    
    // Find progress by user and roadmap
    Optional<UserProgress> findByUserIdAndRoadmapId(String userId, String roadmapId);
    
    // Find all progress for a user
    List<UserProgress> findByUserId(String userId);
    
    // Find all progress for a roadmap
    List<UserProgress> findByRoadmapId(String roadmapId);
    
    // Find completed roadmaps for a user
    List<UserProgress> findByUserIdAndCompletedAtIsNotNull(String userId);
    
    // Find in-progress roadmaps for a user
    @Query("{ 'userId': ?0, 'completedAt': null, 'progressPercentage': { $gt: 0 } }")
    List<UserProgress> findInProgressByUserId(String userId);
    
    // Find not started roadmaps for a user
    @Query("{ 'userId': ?0, 'completedAt': null, 'progressPercentage': 0 }")
    List<UserProgress> findNotStartedByUserId(String userId);
    
    // Count completed roadmaps for a user
    long countByUserIdAndCompletedAtIsNotNull(String userId);
    
    // Count in-progress roadmaps for a user
    @Query(value = "{ 'userId': ?0, 'completedAt': null, 'progressPercentage': { $gt: 0 } }", count = true)
    long countInProgressByUserId(String userId);
    
    // Get average completion time for a roadmap
    @Query(value = "{ 'roadmapId': ?0, 'completedAt': { $ne: null } }", 
           fields = "{ 'totalTimeSpent': 1 }")
    List<UserProgress> findCompletedTimesByRoadmapId(String roadmapId);
} 