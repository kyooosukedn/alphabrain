package com.alphabrain.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.alphabrain.model.UserProgress;
import com.alphabrain.service.UserProgressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class UserProgressController {
    
    private final UserProgressService progressService;
    
    @GetMapping("/roadmap/{roadmapId}")
    public ResponseEntity<UserProgress> getRoadmapProgress(
            @PathVariable String roadmapId,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(progressService.getUserRoadmapProgress(userId, roadmapId));
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<UserProgress>> getUserProgress(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(progressService.getUserProgress(userId));
    }
    
    @GetMapping("/user/completed")
    public ResponseEntity<List<UserProgress>> getUserCompletedRoadmaps(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(progressService.getUserCompletedRoadmaps(userId));
    }
    
    @GetMapping("/user/in-progress")
    public ResponseEntity<List<UserProgress>> getUserInProgressRoadmaps(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(progressService.getUserInProgressRoadmaps(userId));
    }
    
    @GetMapping("/user/not-started")
    public ResponseEntity<List<UserProgress>> getUserNotStartedRoadmaps(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(progressService.getUserNotStartedRoadmaps(userId));
    }
    
    @GetMapping("/user/completed/count")
    public ResponseEntity<Long> countUserCompletedRoadmaps(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(progressService.countUserCompletedRoadmaps(userId));
    }
    
    @GetMapping("/user/in-progress/count")
    public ResponseEntity<Long> countUserInProgressRoadmaps(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(progressService.countUserInProgressRoadmaps(userId));
    }
    
    @GetMapping("/roadmap/{roadmapId}/average-time")
    public ResponseEntity<Double> getAverageCompletionTime(@PathVariable String roadmapId) {
        return ResponseEntity.ok(progressService.getAverageCompletionTime(roadmapId));
    }
    
    @PostMapping("/roadmap/{roadmapId}")
    public ResponseEntity<UserProgress> createProgress(
            @PathVariable String roadmapId,
            @AuthenticationPrincipal String userId) {
        UserProgress progress = new UserProgress();
        progress.setUserId(userId);
        progress.setRoadmapId(roadmapId);
        return ResponseEntity.ok(progressService.createProgress(progress));
    }
    
    @PutMapping("/{progressId}/item/{itemId}")
    public ResponseEntity<UserProgress> updateItemProgress(
            @PathVariable String progressId,
            @PathVariable String itemId,
            @RequestParam int percentage,
            @AuthenticationPrincipal String userId) {
        UserProgress progress = progressService.getProgress(progressId);
        if (!progress.getUserId().equals(userId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(progressService.updateItemProgress(progressId, itemId, percentage));
    }
    
    @PutMapping("/{progressId}/item/{itemId}/complete")
    public ResponseEntity<UserProgress> markItemCompleted(
            @PathVariable String progressId,
            @PathVariable String itemId,
            @AuthenticationPrincipal String userId) {
        UserProgress progress = progressService.getProgress(progressId);
        if (!progress.getUserId().equals(userId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(progressService.markItemCompleted(progressId, itemId));
    }
    
    @PutMapping("/{progressId}/time")
    public ResponseEntity<UserProgress> updateTimeSpent(
            @PathVariable String progressId,
            @RequestParam int minutes,
            @AuthenticationPrincipal String userId) {
        UserProgress progress = progressService.getProgress(progressId);
        if (!progress.getUserId().equals(userId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(progressService.updateTimeSpent(progressId, minutes));
    }
} 