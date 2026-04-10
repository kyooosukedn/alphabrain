package com.alphabrain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.alphabrain.model.Session;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface SessionRepository extends MongoRepository<Session, String> {
    Optional<Session> findById(String id);
    List<Session> findByUserId(String userId);
    List<Session> findByStatus(String status);
    List<Session> findByStartTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Session> findByEndTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Session> findByPriority(String priority);
    List<Session> findByCategory(String category);
    List<Session> findByDescriptionContaining(String description);
    List<Session> findByTopicIdAndUserId(String topicId, String userId);
}
