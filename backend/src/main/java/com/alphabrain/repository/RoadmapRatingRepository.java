package com.alphabrain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.alphabrain.model.RoadmapRating;

@Repository
public interface RoadmapRatingRepository extends MongoRepository<RoadmapRating, String> {

    List<RoadmapRating> findByRoadmapId(String roadmapId);

    Optional<RoadmapRating> findByRoadmapIdAndUserId(String roadmapId, String userId);

    long countByRoadmapId(String roadmapId);

    void deleteByRoadmapIdAndUserId(String roadmapId, String userId);
}
