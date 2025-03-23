package com.alphabrain.service;

import com.alphabrain.model.Session;
import com.alphabrain.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {
    private final SessionRepository sessionRepository;
    
    public Session createSession(Session session) {
        return sessionRepository.save(session);
    }
    
    public List<Session> getAllSessionsByUserId(String userId) {
        return sessionRepository.findByUserId(userId);
    }
    
    public Session getSessionById(String id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }
    
    public void deleteSession(String id) {
        sessionRepository.deleteById(id);
    }
    
    public Session updateSession(String id, Session sessionDetails) {
        Session session = getSessionById(id);
        
        // Update fields
        session.setTitle(sessionDetails.getTitle());
        session.setDescription(sessionDetails.getDescription());
        session.setPriority(sessionDetails.getPriority());
        session.setCategory(sessionDetails.getCategory());
        session.setStartTime(sessionDetails.getStartTime());
        session.setEndTime(sessionDetails.getEndTime());
        session.setTopicId(sessionDetails.getTopicId());
        
        // Don't update status, completion, or notes here
        // Those have dedicated methods
        
        return sessionRepository.save(session);
    }
    
    public Session updateSessionStatus(String id, String status) {
        Session session = getSessionById(id);
        
        // Validate status
        if (!Arrays.asList("PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED").contains(status)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
        
        session.setStatus(status);
        
        // If completing, set completedAt
        if ("COMPLETED".equals(status)) {
            session.setCompletedAt(LocalDateTime.now());
            
            // If completion percentage not set, set to 100%
            if (session.getCompletionPercentage() == null) {
                session.setCompletionPercentage(100);
            }
            
            // If actual duration not set, calculate from scheduled duration
            if (session.getActualDurationMinutes() == null) {
                long scheduledMinutes = ChronoUnit.MINUTES.between(
                        session.getStartTime(), session.getEndTime());
                session.setActualDurationMinutes((int) scheduledMinutes);
            }
        }
        
        return sessionRepository.save(session);
    }
    
    public Session updateSessionProgress(String id, Integer completionPercentage, 
                                        Integer actualDurationMinutes, String notes) {
        Session session = getSessionById(id);
        
        // Validate completion percentage
        if (completionPercentage != null) {
            if (completionPercentage < 0 || completionPercentage > 100) {
                throw new IllegalArgumentException("Completion percentage must be between 0 and 100");
            }
            session.setCompletionPercentage(completionPercentage);
        }
        
        // Update actual duration if provided
        if (actualDurationMinutes != null) {
            if (actualDurationMinutes < 0) {
                throw new IllegalArgumentException("Actual duration cannot be negative");
            }
            session.setActualDurationMinutes(actualDurationMinutes);
        }
        
        // Update notes if provided
        if (notes != null) {
            session.setNotes(notes);
        }
        
        return sessionRepository.save(session);
    }
    
    public Session completeSession(String id, Integer actualDurationMinutes, String notes) {
        Session session = getSessionById(id);
        
        // Set status to COMPLETED
        session.setStatus("COMPLETED");
        session.setCompletedAt(LocalDateTime.now());
        session.setCompletionPercentage(100);
        
        // Update actual duration if provided
        if (actualDurationMinutes != null) {
            if (actualDurationMinutes < 0) {
                throw new IllegalArgumentException("Actual duration cannot be negative");
            }
            session.setActualDurationMinutes(actualDurationMinutes);
        } else {
            // Calculate from scheduled duration
            long scheduledMinutes = ChronoUnit.MINUTES.between(
                    session.getStartTime(), session.getEndTime());
            session.setActualDurationMinutes((int) scheduledMinutes);
        }
        
        // Update notes if provided
        if (notes != null) {
            session.setNotes(notes);
        }
        
        return sessionRepository.save(session);
    }
    
    public List<Session> getSessionsByTopicId(String topicId, String userId) {
        return sessionRepository.findByTopicIdAndUserId(topicId, userId);
    }
    
    public Map<String, Object> getSessionAnalytics(String userId) {
        List<Session> allSessions = getAllSessionsByUserId(userId);
        
        // Total sessions
        int totalSessions = allSessions.size();
        
        // Completed sessions
        List<Session> completedSessions = allSessions.stream()
                .filter(s -> "COMPLETED".equals(s.getStatus()))
                .collect(Collectors.toList());
        int completedSessionsCount = completedSessions.size();
        
        // Total planned study time (in minutes)
        long totalPlannedMinutes = allSessions.stream()
                .mapToLong(s -> {
                    if (s.getStartTime() != null && s.getEndTime() != null) {
                        return ChronoUnit.MINUTES.between(s.getStartTime(), s.getEndTime());
                    }
                    return 0;
                })
                .sum();
        
        // Total actual study time (in minutes)
        long totalActualMinutes = completedSessions.stream()
                .mapToLong(s -> s.getActualDurationMinutes() != null ? s.getActualDurationMinutes() : 0)
                .sum();
        
        // Sessions by status
        Map<String, Long> sessionsByStatus = allSessions.stream()
                .filter(s -> s.getStatus() != null)
                .collect(Collectors.groupingBy(Session::getStatus, Collectors.counting()));
        
        // Sessions by priority
        Map<String, Long> sessionsByPriority = allSessions.stream()
                .filter(s -> s.getPriority() != null)
                .collect(Collectors.groupingBy(Session::getPriority, Collectors.counting()));
        
        // Sessions by category
        Map<String, Long> sessionsByCategory = allSessions.stream()
                .filter(s -> s.getCategory() != null)
                .collect(Collectors.groupingBy(Session::getCategory, Collectors.counting()));
        
        // Sessions by day of week
        Map<String, Long> sessionsByDayOfWeek = allSessions.stream()
                .filter(s -> s.getStartTime() != null)
                .collect(Collectors.groupingBy(
                        s -> s.getStartTime().getDayOfWeek().toString(),
                        Collectors.counting()));
        
        // Study streak calculation
        int currentStreak = calculateCurrentStreak(completedSessions);
        
        // Productivity score (simple calculation: completed / total * 100)
        double productivityScore = totalSessions > 0 
                ? (double) completedSessionsCount / totalSessions * 100 
                : 0;
        
        // Assemble the result
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalSessions", totalSessions);
        analytics.put("completedSessions", completedSessionsCount);
        analytics.put("totalPlannedMinutes", totalPlannedMinutes);
        analytics.put("totalActualMinutes", totalActualMinutes);
        analytics.put("sessionsByStatus", sessionsByStatus);
        analytics.put("sessionsByPriority", sessionsByPriority);
        analytics.put("sessionsByCategory", sessionsByCategory);
        analytics.put("sessionsByDayOfWeek", sessionsByDayOfWeek);
        analytics.put("currentStreak", currentStreak);
        analytics.put("productivityScore", productivityScore);
        
        return analytics;
    }
    
    public Map<String, Map<String, Object>> getSessionAnalyticsByTopic(String userId) {
        List<Session> allSessions = getAllSessionsByUserId(userId);
        
        // Group sessions by topic
        Map<String, List<Session>> sessionsByTopic = allSessions.stream()
                .filter(s -> s.getTopicId() != null && !s.getTopicId().isEmpty())
                .collect(Collectors.groupingBy(Session::getTopicId));
        
        Map<String, Map<String, Object>> result = new HashMap<>();
        
        // Calculate analytics for each topic
        for (Map.Entry<String, List<Session>> entry : sessionsByTopic.entrySet()) {
            String topicId = entry.getKey();
            List<Session> topicSessions = entry.getValue();
            
            // Total sessions for this topic
            int totalSessions = topicSessions.size();
            
            // Completed sessions for this topic
            List<Session> completedSessions = topicSessions.stream()
                    .filter(s -> "COMPLETED".equals(s.getStatus()))
                    .collect(Collectors.toList());
            int completedSessionsCount = completedSessions.size();
            
            // Total planned study time for this topic (in minutes)
            long totalPlannedMinutes = topicSessions.stream()
                    .filter(s -> s.getStartTime() != null && s.getEndTime() != null)
                    .mapToLong(s -> ChronoUnit.MINUTES.between(s.getStartTime(), s.getEndTime()))
                    .sum();
            
            // Total actual study time for this topic (in minutes)
            long totalActualMinutes = completedSessions.stream()
                    .mapToLong(s -> s.getActualDurationMinutes() != null ? s.getActualDurationMinutes() : 0)
                    .sum();
            
            // Completion rate for this topic
            double completionRate = totalSessions > 0 
                    ? (double) completedSessionsCount / totalSessions * 100 
                    : 0;
            
            // Assemble the result for this topic
            Map<String, Object> topicAnalytics = new HashMap<>();
            topicAnalytics.put("totalSessions", totalSessions);
            topicAnalytics.put("completedSessions", completedSessionsCount);
            topicAnalytics.put("totalPlannedMinutes", totalPlannedMinutes);
            topicAnalytics.put("totalActualMinutes", totalActualMinutes);
            topicAnalytics.put("completionRate", completionRate);
            
            result.put(topicId, topicAnalytics);
        }
        
        return result;
    }
    
    // Helper method to calculate current study streak
    private int calculateCurrentStreak(List<Session> completedSessions) {
        if (completedSessions.isEmpty()) {
            return 0;
        }
        
        // Sort sessions by completion date
        List<Session> sortedSessions = completedSessions.stream()
                .filter(s -> s.getCompletedAt() != null)
                .sorted(Comparator.comparing(Session::getCompletedAt).reversed())
                .collect(Collectors.toList());
        
        if (sortedSessions.isEmpty()) {
            return 0;
        }
        
        // Check if there's a session completed today
        LocalDate today = LocalDate.now();
        boolean hasSessionToday = sortedSessions.stream()
                .anyMatch(s -> s.getCompletedAt().toLocalDate().equals(today));
        
        if (!hasSessionToday) {
            return 0; // Streak broken if no session today
        }
        
        // Count consecutive days with completed sessions
        int streak = 1; // Start with today
        LocalDate currentDate = today.minusDays(1); // Start checking from yesterday
        
        while (true) {
            final LocalDate dateToCheck = currentDate;
            boolean hasSessionOnDate = sortedSessions.stream()
                    .anyMatch(s -> s.getCompletedAt().toLocalDate().equals(dateToCheck));
            
            if (hasSessionOnDate) {
                streak++;
                currentDate = currentDate.minusDays(1);
            } else {
                break; // Streak ends
            }
        }
        
        return streak;
    }
}