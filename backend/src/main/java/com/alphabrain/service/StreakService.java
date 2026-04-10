package com.alphabrain.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.alphabrain.model.UserStreak;
import com.alphabrain.repository.UserStreakRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final UserStreakRepository userStreakRepository;

    /**
     * Get a user's streak information.
     */
    public UserStreak getUserStreak(String userId) {
        return userStreakRepository.findByUserId(userId)
                .orElseGet(() -> createNewUserStreak(userId));
    }

    /**
     * Create a new user streak object.
     */
    private UserStreak createNewUserStreak(String userId) {
        UserStreak streak = UserStreak.builder()
                .userId(userId)
                .currentStreak(0)
                .longestStreak(0)
                .totalLearningDays(0)
                .totalStudyTimeMinutes(0)
                .totalNodesCompleted(0)
                .totalRoadmapsCompleted(0)
                .streakFreezeCount(0)
                .build();
        
        return userStreakRepository.save(streak);
    }

    /**
     * Record a learning activity for the user and update their streak.
     */
    public UserStreak recordLearningActivity(String userId, int studyTimeMinutes, LocalDate activityDate) {
        UserStreak streak = getUserStreak(userId);
        LocalDate today = activityDate != null ? activityDate : LocalDate.now();
        
        // Check if the user already has activity recorded for today
        boolean alreadyRecordedToday = streak.getLearningDates().contains(today);
        
        if (!alreadyRecordedToday) {
            streak.getLearningDates().add(today);
            streak.setTotalLearningDays(streak.getTotalLearningDays() + 1);
            
            // Update current streak
            if (streak.getLastLearningDate() != null) {
                long daysBetween = ChronoUnit.DAYS.between(streak.getLastLearningDate(), today);
                
                if (daysBetween == 1) {
                    // Consecutive day
                    streak.setCurrentStreak(streak.getCurrentStreak() + 1);
                } else if (daysBetween > 1) {
                    // Streak broken, but check if streak freeze is available
                    if (daysBetween - 1 <= streak.getStreakFreezeCount()) {
                        // Use streak freeze
                        streak.setStreakFreezeCount(streak.getStreakFreezeCount() - (int)(daysBetween - 1));
                        streak.setCurrentStreak(streak.getCurrentStreak() + 1);
                    } else {
                        // Reset streak
                        streak.setCurrentStreak(1);
                    }
                } else if (daysBetween == 0) {
                    // Same day, streak remains the same
                }
            } else {
                // First learning activity
                streak.setCurrentStreak(1);
            }
            
            // Update longest streak if needed
            if (streak.getCurrentStreak() > streak.getLongestStreak()) {
                streak.setLongestStreak(streak.getCurrentStreak());
            }
            
            streak.setLastLearningDate(today);
        }
        
        // Always add study time
        streak.setTotalStudyTimeMinutes(streak.getTotalStudyTimeMinutes() + studyTimeMinutes);
        
        // Update weekly and monthly stats
        updateWeeklyStats(streak, today, studyTimeMinutes);
        updateMonthlyStats(streak, today, studyTimeMinutes);
        
        return userStreakRepository.save(streak);
    }
    
    /**
     * Record completion of a knowledge node.
     */
    public UserStreak recordNodeCompletion(String userId) {
        UserStreak streak = getUserStreak(userId);
        streak.setTotalNodesCompleted(streak.getTotalNodesCompleted() + 1);
        return userStreakRepository.save(streak);
    }
    
    /**
     * Record completion of a roadmap.
     */
    public UserStreak recordRoadmapCompletion(String userId) {
        UserStreak streak = getUserStreak(userId);
        streak.setTotalRoadmapsCompleted(streak.getTotalRoadmapsCompleted() + 1);
        return userStreakRepository.save(streak);
    }
    
    /**
     * Get top users by current streak.
     */
    public List<UserStreak> getTopStreaks(int limit) {
        return userStreakRepository.findByCurrentStreakGreaterThanOrderByCurrentStreakDesc(0)
                .stream()
                .limit(limit)
                .toList();
    }
    
    /**
     * Get top users by study time.
     */
    public List<UserStreak> getTopStudyTime(int limit) {
        return userStreakRepository.findByTotalStudyTimeMinutesGreaterThanOrderByTotalStudyTimeMinutesDesc(0)
                .stream()
                .limit(limit)
                .toList();
    }
    
    /**
     * Add streak freeze days to a user's account.
     */
    public UserStreak addStreakFreezeDays(String userId, int days) {
        UserStreak streak = getUserStreak(userId);
        streak.setStreakFreezeCount(streak.getStreakFreezeCount() + days);
        return userStreakRepository.save(streak);
    }
    
    private void updateWeeklyStats(UserStreak streak, LocalDate date, int minutes) {
        int dayOfWeek = date.getDayOfWeek().getValue() - 1;  // 0-based index
        
        if (streak.getWeeklyStudyMinutes().size() <= dayOfWeek) {
            // Initialize list if needed
            while (streak.getWeeklyStudyMinutes().size() <= dayOfWeek) {
                streak.getWeeklyStudyMinutes().add(0);
            }
        }
        
        int currentValue = streak.getWeeklyStudyMinutes().get(dayOfWeek);
        streak.getWeeklyStudyMinutes().set(dayOfWeek, currentValue + minutes);
    }
    
    private void updateMonthlyStats(UserStreak streak, LocalDate date, int minutes) {
        int dayOfMonth = date.getDayOfMonth() - 1;  // 0-based index
        
        if (streak.getMonthlyStudyMinutes().size() <= dayOfMonth) {
            // Initialize list if needed
            while (streak.getMonthlyStudyMinutes().size() <= dayOfMonth) {
                streak.getMonthlyStudyMinutes().add(0);
            }
        }
        
        int currentValue = streak.getMonthlyStudyMinutes().get(dayOfMonth);
        streak.getMonthlyStudyMinutes().set(dayOfMonth, currentValue + minutes);
    }
} 