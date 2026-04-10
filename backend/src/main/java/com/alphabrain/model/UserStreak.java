package com.alphabrain.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a user's learning streak information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_streaks")
public class UserStreak {
    
    @Id
    private String id;
    
    private String userId;
    
    // Current streak days
    private int currentStreak;
    
    // Longest streak days ever achieved
    private int longestStreak;
    
    // Total days with learning activity
    private int totalLearningDays;
    
    // Last date a learning activity was logged
    private LocalDate lastLearningDate;
    
    // Total study time in minutes
    private int totalStudyTimeMinutes;
    
    // List of dates when learning occurred
    private List<LocalDate> learningDates = new ArrayList<>();
    
    // Weekly study minutes (7 entries, one for each day of the week)
    private List<Integer> weeklyStudyMinutes = new ArrayList<>(List.of(0, 0, 0, 0, 0, 0, 0));
    
    // Monthly study minutes (up to 31 entries)
    private List<Integer> monthlyStudyMinutes = new ArrayList<>();
    
    // Total nodes completed
    private int totalNodesCompleted;
    
    // Total roadmaps completed
    private int totalRoadmapsCompleted;
    
    // Streak freeze count (days the streak won't break even without activity)
    private int streakFreezeCount;
} 