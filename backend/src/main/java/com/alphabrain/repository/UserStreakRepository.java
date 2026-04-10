package com.alphabrain.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.alphabrain.model.UserStreak;

@Repository
public interface UserStreakRepository extends MongoRepository<UserStreak, String> {
    
    Optional<UserStreak> findByUserId(String userId);
    
    List<UserStreak> findByCurrentStreakGreaterThanOrderByCurrentStreakDesc(int minStreak);
    
    List<UserStreak> findByLongestStreakGreaterThanOrderByLongestStreakDesc(int minStreak);
    
    List<UserStreak> findByTotalStudyTimeMinutesGreaterThanOrderByTotalStudyTimeMinutesDesc(int minMinutes);
    
    List<UserStreak> findByLastLearningDateBetween(LocalDate startDate, LocalDate endDate);
    
    long countByLastLearningDate(LocalDate date);
} 