package com.alphabrain.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.OptionalDouble;

import org.springframework.stereotype.Service;

import com.alphabrain.model.UserProgress;
import com.alphabrain.repository.UserProgressRepository;
import com.alphabrain.service.UserProgressService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProgressServiceImpl implements UserProgressService {
    
    private final UserProgressRepository progressRepository;
    
    @Override
    public UserProgress createProgress(UserProgress progress) {
        progress.setStartedAt(LocalDateTime.now());
        return progressRepository.save(progress);
    }
    
    @Override
    public UserProgress updateProgress(String id, UserProgress progress) {
        UserProgress existing = getProgress(id);
        progress.setId(existing.getId());
        return progressRepository.save(progress);
    }
    
    @Override
    public void deleteProgress(String id) {
        progressRepository.deleteById(id);
    }
    
    @Override
    public UserProgress getProgress(String id) {
        return progressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Progress not found: " + id));
    }
    
    @Override
    public UserProgress getUserRoadmapProgress(String userId, String roadmapId) {
        return progressRepository.findByUserIdAndRoadmapId(userId, roadmapId)
                .orElseThrow(() -> new RuntimeException("Progress not found for user and roadmap"));
    }
    
    @Override
    public List<UserProgress> getUserProgress(String userId) {
        return progressRepository.findByUserId(userId);
    }
    
    @Override
    public List<UserProgress> getUserCompletedRoadmaps(String userId) {
        return progressRepository.findByUserIdAndCompletedAtIsNotNull(userId);
    }
    
    @Override
    public List<UserProgress> getUserInProgressRoadmaps(String userId) {
        return progressRepository.findInProgressByUserId(userId);
    }
    
    @Override
    public List<UserProgress> getUserNotStartedRoadmaps(String userId) {
        return progressRepository.findNotStartedByUserId(userId);
    }
    
    @Override
    public long countUserCompletedRoadmaps(String userId) {
        return progressRepository.countByUserIdAndCompletedAtIsNotNull(userId);
    }
    
    @Override
    public long countUserInProgressRoadmaps(String userId) {
        return progressRepository.countInProgressByUserId(userId);
    }
    
    @Override
    public double getAverageCompletionTime(String roadmapId) {
        List<UserProgress> completedTimes = progressRepository.findCompletedTimesByRoadmapId(roadmapId);
        OptionalDouble average = completedTimes.stream()
                .mapToInt(UserProgress::getTotalTimeSpent)
                .average();
        return average.orElse(0.0);
    }
    
    @Override
    public UserProgress updateItemProgress(String progressId, String itemId, int percentage) {
        UserProgress progress = getProgress(progressId);
        progress.getItemProgress().stream()
                .filter(item -> item.getItemId().equals(itemId))
                .findFirst()
                .ifPresent(item -> {
                    item.setProgressPercentage(percentage);
                    if (percentage == 100) {
                        item.setCompletedAt(LocalDateTime.now());
                    }
                });
        updateOverallProgress(progress);
        return progressRepository.save(progress);
    }
    
    @Override
    public UserProgress markItemCompleted(String progressId, String itemId) {
        return updateItemProgress(progressId, itemId, 100);
    }
    
    @Override
    public UserProgress updateTimeSpent(String progressId, int additionalMinutes) {
        UserProgress progress = getProgress(progressId);
        progress.setTotalTimeSpent(progress.getTotalTimeSpent() + additionalMinutes);
        progress.setLastActivityAt(LocalDateTime.now());
        return progressRepository.save(progress);
    }
    
    private void updateOverallProgress(UserProgress progress) {
        if (progress.getItemProgress().isEmpty()) {
            progress.setProgressPercentage(0);
            return;
        }
        
        double totalPercentage = progress.getItemProgress().stream()
                .mapToInt(UserProgress.ItemProgress::getProgressPercentage)
                .average()
                .orElse(0.0);
        
        progress.setProgressPercentage((int) Math.round(totalPercentage));
        
        if (progress.getProgressPercentage() == 100) {
            progress.setCompletedAt(LocalDateTime.now());
        }
    }
} 