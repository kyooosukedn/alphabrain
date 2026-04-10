package com.alphabrain.dto.streak;

import java.time.LocalDate;
import java.util.List;

import com.alphabrain.model.UserStreak;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStreakResponse {
    
    private String userId;
    private int currentStreak;
    private int longestStreak;
    private int totalLearningDays;
    private LocalDate lastLearningDate;
    private int totalStudyTimeMinutes;
    private List<Integer> weeklyStudyMinutes;
    private int totalNodesCompleted;
    private int totalRoadmapsCompleted;
    private int streakFreezeCount;
    
    private String formattedTotalStudyTime; // e.g., "10h 30m"
    
    /**
     * Create a response DTO from a UserStreak entity.
     */
    public static UserStreakResponse fromUserStreak(UserStreak streak) {
        return UserStreakResponse.builder()
                .userId(streak.getUserId())
                .currentStreak(streak.getCurrentStreak())
                .longestStreak(streak.getLongestStreak())
                .totalLearningDays(streak.getTotalLearningDays())
                .lastLearningDate(streak.getLastLearningDate())
                .totalStudyTimeMinutes(streak.getTotalStudyTimeMinutes())
                .weeklyStudyMinutes(streak.getWeeklyStudyMinutes())
                .totalNodesCompleted(streak.getTotalNodesCompleted())
                .totalRoadmapsCompleted(streak.getTotalRoadmapsCompleted())
                .streakFreezeCount(streak.getStreakFreezeCount())
                .formattedTotalStudyTime(formatStudyTime(streak.getTotalStudyTimeMinutes()))
                .build();
    }
    
    /**
     * Format study time from minutes to a readable string.
     */
    private static String formatStudyTime(int minutes) {
        int hours = minutes / 60;
        int remainingMinutes = minutes % 60;
        
        if (hours > 0) {
            return String.format("%dh %dm", hours, remainingMinutes);
        } else {
            return String.format("%dm", remainingMinutes);
        }
    }
}