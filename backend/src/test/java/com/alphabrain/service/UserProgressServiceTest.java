package com.alphabrain.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.alphabrain.model.UserProgress;
import com.alphabrain.model.UserProgress.ItemProgress;
import com.alphabrain.repository.UserProgressRepository;
import com.alphabrain.service.impl.UserProgressServiceImpl;

@ExtendWith(MockitoExtension.class)
public class UserProgressServiceTest {
    
    @Mock
    private UserProgressRepository progressRepository;
    
    @InjectMocks
    private UserProgressServiceImpl progressService;
    
    private UserProgress testProgress;
    private ItemProgress testItemProgress;
    
    @BeforeEach
    void setUp() {
        testItemProgress = new ItemProgress();
        testItemProgress.setItemId("test-item");
        testItemProgress.setProgressPercentage(0);
        testItemProgress.setStatus("NOT_STARTED");
        testItemProgress.setTimeSpentMinutes(0);
        
        testProgress = new UserProgress();
        testProgress.setId("test-id");
        testProgress.setUserId("test-user");
        testProgress.setRoadmapId("test-roadmap");
        testProgress.setProgressPercentage(0);
        testProgress.setTotalTimeSpent(0);
        testProgress.setStartedAt(LocalDateTime.now());
        testProgress.getItemProgress().add(testItemProgress);
    }
    
    @Test
    void createProgress_ShouldSetStartTimeAndSave() {
        when(progressRepository.save(any(UserProgress.class))).thenReturn(testProgress);
        
        UserProgress result = progressService.createProgress(testProgress);
        
        assertNotNull(result.getStartedAt());
        verify(progressRepository).save(testProgress);
    }
    
    @Test
    void updateProgress_ShouldSave() {
        when(progressRepository.findById("test-id")).thenReturn(Optional.of(testProgress));
        when(progressRepository.save(any(UserProgress.class))).thenReturn(testProgress);
        
        UserProgress result = progressService.updateProgress("test-id", testProgress);
        
        assertEquals(testProgress, result);
        verify(progressRepository).save(testProgress);
    }
    
    @Test
    void getProgress_ShouldReturnProgress() {
        when(progressRepository.findById("test-id")).thenReturn(Optional.of(testProgress));
        
        UserProgress result = progressService.getProgress("test-id");
        
        assertEquals(testProgress, result);
    }
    
    @Test
    void getProgress_ShouldThrowException_WhenNotFound() {
        when(progressRepository.findById("test-id")).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> progressService.getProgress("test-id"));
    }
    
    @Test
    void getUserRoadmapProgress_ShouldReturnProgress() {
        when(progressRepository.findByUserIdAndRoadmapId("test-user", "test-roadmap"))
                .thenReturn(Optional.of(testProgress));
        
        UserProgress result = progressService.getUserRoadmapProgress("test-user", "test-roadmap");
        
        assertEquals(testProgress, result);
    }
    
    @Test
    void getUserProgress_ShouldReturnAllProgress() {
        List<UserProgress> progressList = Arrays.asList(testProgress);
        when(progressRepository.findByUserId("test-user")).thenReturn(progressList);
        
        List<UserProgress> result = progressService.getUserProgress("test-user");
        
        assertEquals(progressList, result);
    }
    
    @Test
    void updateItemProgress_ShouldUpdateProgressAndSave() {
        when(progressRepository.findById("test-id")).thenReturn(Optional.of(testProgress));
        when(progressRepository.save(any(UserProgress.class))).thenAnswer(i -> i.getArgument(0));
        
        UserProgress result = progressService.updateItemProgress("test-id", "test-item", 50);
        
        assertEquals(50, result.getItemProgress().get(0).getProgressPercentage());
        assertEquals(50, result.getProgressPercentage());
        verify(progressRepository).save(result);
    }
    
    @Test
    void markItemCompleted_ShouldSetProgressTo100() {
        when(progressRepository.findById("test-id")).thenReturn(Optional.of(testProgress));
        when(progressRepository.save(any(UserProgress.class))).thenAnswer(i -> i.getArgument(0));
        
        UserProgress result = progressService.markItemCompleted("test-id", "test-item");
        
        assertEquals(100, result.getItemProgress().get(0).getProgressPercentage());
        assertNotNull(result.getItemProgress().get(0).getCompletedAt());
        verify(progressRepository).save(result);
    }
    
    @Test
    void updateTimeSpent_ShouldAddTimeAndUpdateLastActivity() {
        when(progressRepository.findById("test-id")).thenReturn(Optional.of(testProgress));
        when(progressRepository.save(any(UserProgress.class))).thenAnswer(i -> i.getArgument(0));
        
        UserProgress result = progressService.updateTimeSpent("test-id", 30);
        
        assertEquals(30, result.getTotalTimeSpent());
        assertNotNull(result.getLastActivityAt());
        verify(progressRepository).save(result);
    }
    
    @Test
    void getAverageCompletionTime_ShouldCalculateAverage() {
        UserProgress completed1 = new UserProgress();
        completed1.setTotalTimeSpent(60);
        UserProgress completed2 = new UserProgress();
        completed2.setTotalTimeSpent(120);
        
        List<UserProgress> completedTimes = Arrays.asList(completed1, completed2);
        when(progressRepository.findCompletedTimesByRoadmapId("test-roadmap"))
                .thenReturn(completedTimes);
        
        double result = progressService.getAverageCompletionTime("test-roadmap");
        
        assertEquals(90.0, result);
    }
    
    @Test
    void getAverageCompletionTime_ShouldReturnZero_WhenNoCompletions() {
        when(progressRepository.findCompletedTimesByRoadmapId("test-roadmap"))
                .thenReturn(Arrays.asList());
        
        double result = progressService.getAverageCompletionTime("test-roadmap");
        
        assertEquals(0.0, result);
    }
} 