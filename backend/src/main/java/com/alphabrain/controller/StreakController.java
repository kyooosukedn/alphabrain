package com.alphabrain.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alphabrain.dto.streak.RecordActivityRequest;
import com.alphabrain.dto.streak.UserStreakResponse;
import com.alphabrain.model.UserStreak;
import com.alphabrain.service.StreakService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/streaks")
@RequiredArgsConstructor
public class StreakController {

    private final StreakService streakService;
    
    @GetMapping("/my-streak")
    public ResponseEntity<UserStreakResponse> getMyStreak(Authentication authentication) {
        String username = authentication.getName();
        UserStreak streak = streakService.getUserStreak(username);
        return ResponseEntity.ok(UserStreakResponse.fromUserStreak(streak));
    }
    
    @PostMapping("/record-activity")
    public ResponseEntity<UserStreakResponse> recordActivity(
            @Valid @RequestBody RecordActivityRequest request,
            Authentication authentication) {

        String username = authentication.getName();
        UserStreak updatedStreak = streakService.recordLearningActivity(
                username,
                request.getStudyTimeMinutes(),
                request.getActivityDate());

        return ResponseEntity.ok(UserStreakResponse.fromUserStreak(updatedStreak));
    }
    
    @PostMapping("/record-node-completion")
    public ResponseEntity<UserStreakResponse> recordNodeCompletion(Authentication authentication) {
        String username = authentication.getName();
        UserStreak updatedStreak = streakService.recordNodeCompletion(username);
        return ResponseEntity.ok(UserStreakResponse.fromUserStreak(updatedStreak));
    }

    @PostMapping("/record-roadmap-completion")
    public ResponseEntity<UserStreakResponse> recordRoadmapCompletion(Authentication authentication) {
        String username = authentication.getName();
        UserStreak updatedStreak = streakService.recordRoadmapCompletion(username);
        return ResponseEntity.ok(UserStreakResponse.fromUserStreak(updatedStreak));
    }
    
    @GetMapping("/top-streaks")
    public ResponseEntity<List<UserStreakResponse>> getTopStreaks(
            @RequestParam(defaultValue = "10") int limit) {
        List<UserStreak> topStreaks = streakService.getTopStreaks(limit);
        List<UserStreakResponse> responses = topStreaks.stream()
                .map(UserStreakResponse::fromUserStreak)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/top-study-time")
    public ResponseEntity<List<UserStreakResponse>> getTopStudyTime(
            @RequestParam(defaultValue = "10") int limit) {
        List<UserStreak> topStudyTimes = streakService.getTopStudyTime(limit);
        List<UserStreakResponse> responses = topStudyTimes.stream()
                .map(UserStreakResponse::fromUserStreak)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
    
    @PostMapping("/add-streak-freeze/{days}")
    public ResponseEntity<UserStreakResponse> addStreakFreeze(
            @PathVariable int days,
            Authentication authentication) {

        if (days <= 0 || days > 7) {
            return ResponseEntity.badRequest().build();
        }

        String username = authentication.getName();
        UserStreak updatedStreak = streakService.addStreakFreezeDays(username, days);
        return ResponseEntity.ok(UserStreakResponse.fromUserStreak(updatedStreak));
    }
} 