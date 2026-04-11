package com.alphabrain.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.alphabrain.model.ReviewCard;

@Repository
public interface ReviewCardRepository extends MongoRepository<ReviewCard, String> {

    List<ReviewCard> findByUserId(String userId);

    Optional<ReviewCard> findByUserIdAndNodeId(String userId, String nodeId);

    List<ReviewCard> findByUserIdAndNextReviewDateLessThanEqual(String userId, LocalDate date);

    long countByUserIdAndNextReviewDateLessThanEqual(String userId, LocalDate date);

    long countByUserId(String userId);
}
