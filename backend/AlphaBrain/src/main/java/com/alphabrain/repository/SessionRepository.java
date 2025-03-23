package com.alphabrain.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.alphabrain.model.Session;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface SessionRepository extends MongoRepository<Session, String> {
    List<Session> findByUserId(String userId);
    List<Session> findByStatus(String status);
    List<Session> findByStartTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Session> findByEndTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Session> findByTitleContaining(String title);
    List<Session> findByDescriptionContaining(String description);
    List<Session> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Session> findByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Session> findByTopicIdAndUserId(String topicId, String userId);
}
