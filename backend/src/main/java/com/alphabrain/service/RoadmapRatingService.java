package com.alphabrain.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.alphabrain.model.Roadmap;
import com.alphabrain.model.RoadmapRating;
import com.alphabrain.repository.RoadmapRatingRepository;
import com.alphabrain.repository.RoadmapRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoadmapRatingService {

    private final RoadmapRatingRepository ratingRepository;
    private final RoadmapRepository roadmapRepository;

    /**
     * Add or update a rating/review for a roadmap.
     */
    public RoadmapRating rateRoadmap(String roadmapId, String userId, String username, int rating, String review) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Check roadmap exists
        Roadmap roadmap = roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new IllegalArgumentException("Roadmap not found: " + roadmapId));

        // Can't rate your own roadmap
        if (roadmap.getUserId() != null && roadmap.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Cannot rate your own roadmap");
        }

        // Upsert: update existing or create new
        Optional<RoadmapRating> existingOpt = ratingRepository.findByRoadmapIdAndUserId(roadmapId, userId);
        RoadmapRating ratingEntity;

        if (existingOpt.isPresent()) {
            ratingEntity = existingOpt.get();
            ratingEntity.setRating(rating);
            ratingEntity.setReview(review);
            ratingEntity.setUpdatedAt(LocalDateTime.now());
        } else {
            ratingEntity = RoadmapRating.builder()
                    .roadmapId(roadmapId)
                    .userId(userId)
                    .username(username)
                    .rating(rating)
                    .review(review)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
        }

        RoadmapRating saved = ratingRepository.save(ratingEntity);

        // Recalculate denormalized rating on roadmap
        recalculateRoadmapRating(roadmapId);

        return saved;
    }

    public List<RoadmapRating> getRatingsForRoadmap(String roadmapId) {
        return ratingRepository.findByRoadmapId(roadmapId);
    }

    public Optional<RoadmapRating> getUserRating(String roadmapId, String userId) {
        return ratingRepository.findByRoadmapIdAndUserId(roadmapId, userId);
    }

    public Map<String, Object> getRoadmapRatingSummary(String roadmapId) {
        List<RoadmapRating> ratings = ratingRepository.findByRoadmapId(roadmapId);
        double avg = ratings.stream().mapToInt(RoadmapRating::getRating).average().orElse(0.0);
        return Map.of(
                "averageRating", Math.round(avg * 10.0) / 10.0,
                "ratingCount", ratings.size()
        );
    }

    public void deleteRating(String roadmapId, String userId) {
        ratingRepository.deleteByRoadmapIdAndUserId(roadmapId, userId);
        recalculateRoadmapRating(roadmapId);
    }

    private void recalculateRoadmapRating(String roadmapId) {
        List<RoadmapRating> ratings = ratingRepository.findByRoadmapId(roadmapId);
        double avg = ratings.stream().mapToInt(RoadmapRating::getRating).average().orElse(0.0);

        roadmapRepository.findById(roadmapId).ifPresent(roadmap -> {
            roadmap.setAverageRating(Math.round(avg * 10.0) / 10.0);
            roadmap.setRatingCount(ratings.size());
            roadmapRepository.save(roadmap);
        });
    }
}
