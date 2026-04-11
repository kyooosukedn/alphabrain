package com.alphabrain.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.alphabrain.model.KnowledgeNode;
import com.alphabrain.model.ReviewCard;
import com.alphabrain.repository.KnowledgeNodeRepository;
import com.alphabrain.repository.ReviewCardRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewCardRepository reviewCardRepository;
    private final KnowledgeNodeRepository knowledgeNodeRepository;

    /**
     * Get or create a review card for a knowledge node.
     */
    public ReviewCard getOrCreateCard(String userId, String nodeId) {
        return reviewCardRepository.findByUserIdAndNodeId(userId, nodeId)
                .orElseGet(() -> {
                    KnowledgeNode node = knowledgeNodeRepository.findById(nodeId)
                            .orElseThrow(() -> new RuntimeException("Node not found: " + nodeId));

                    ReviewCard card = ReviewCard.builder()
                            .userId(userId)
                            .nodeId(nodeId)
                            .nodeTitle(node.getTitle())
                            .nodeCategory(node.getCategory())
                            .nodeDifficulty(node.getDifficultyLevel())
                            .nextReviewDate(LocalDate.now())
                            .createdAt(LocalDateTime.now())
                            .build();
                    return reviewCardRepository.save(card);
                });
    }

    /**
     * Enable spaced repetition for all of a user's knowledge nodes.
     * Creates review cards for any nodes that don't have one yet.
     */
    public int enableForAllNodes(String userId) {
        List<KnowledgeNode> nodes = knowledgeNodeRepository.findByUserId(userId);
        int created = 0;
        for (KnowledgeNode node : nodes) {
            if (reviewCardRepository.findByUserIdAndNodeId(userId, node.getId()).isEmpty()) {
                ReviewCard card = ReviewCard.builder()
                        .userId(userId)
                        .nodeId(node.getId())
                        .nodeTitle(node.getTitle())
                        .nodeCategory(node.getCategory())
                        .nodeDifficulty(node.getDifficultyLevel())
                        .nextReviewDate(LocalDate.now())
                        .createdAt(LocalDateTime.now())
                        .build();
                reviewCardRepository.save(card);
                created++;
            }
        }
        log.info("Created {} review cards for user {}", created, userId);
        return created;
    }

    /**
     * Get all cards due for review today or earlier.
     */
    public List<ReviewCard> getDueCards(String userId) {
        return reviewCardRepository.findByUserIdAndNextReviewDateLessThanEqual(
                userId, LocalDate.now());
    }

    /**
     * Count cards due for review.
     */
    public long countDueCards(String userId) {
        return reviewCardRepository.countByUserIdAndNextReviewDateLessThanEqual(
                userId, LocalDate.now());
    }

    /**
     * Get all review cards for a user.
     */
    public List<ReviewCard> getAllCards(String userId) {
        return reviewCardRepository.findByUserId(userId);
    }

    /**
     * Get review stats for a user.
     */
    public Map<String, Object> getStats(String userId) {
        List<ReviewCard> cards = reviewCardRepository.findByUserId(userId);
        long dueCount = countDueCards(userId);
        int totalReviews = cards.stream().mapToInt(ReviewCard::getTotalReviews).sum();
        int successfulReviews = cards.stream().mapToInt(ReviewCard::getSuccessfulReviews).sum();
        double retentionRate = totalReviews > 0
                ? Math.round((double) successfulReviews / totalReviews * 1000) / 10.0
                : 0;

        return Map.of(
                "totalCards", cards.size(),
                "dueToday", dueCount,
                "totalReviews", totalReviews,
                "successfulReviews", successfulReviews,
                "retentionRate", retentionRate
        );
    }

    /**
     * Process a review using the SM-2 algorithm.
     *
     * @param cardId  the review card ID
     * @param quality user's self-assessment: 0-5
     *                0 = total blackout, 1 = wrong but recognized,
     *                2 = wrong but easy to recall, 3 = correct with difficulty,
     *                4 = correct, 5 = perfect
     */
    public ReviewCard submitReview(String cardId, int quality) {
        if (quality < 0 || quality > 5) {
            throw new IllegalArgumentException("Quality must be 0-5, got: " + quality);
        }

        ReviewCard card = reviewCardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Review card not found: " + cardId));

        // SM-2 algorithm
        card.setTotalReviews(card.getTotalReviews() + 1);

        if (quality >= 3) {
            // Successful recall
            card.setSuccessfulReviews(card.getSuccessfulReviews() + 1);

            if (card.getRepetitions() == 0) {
                card.setInterval(1);
            } else if (card.getRepetitions() == 1) {
                card.setInterval(6);
            } else {
                card.setInterval((int) Math.round(card.getInterval() * card.getEaseFactor()));
            }
            card.setRepetitions(card.getRepetitions() + 1);
        } else {
            // Failed — reset
            card.setRepetitions(0);
            card.setInterval(1);
        }

        // Update ease factor: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
        double newEF = card.getEaseFactor()
                + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        card.setEaseFactor(Math.max(1.3, newEF));

        // Schedule next review
        card.setNextReviewDate(LocalDate.now().plusDays(card.getInterval()));
        card.setLastReviewedAt(LocalDateTime.now());

        log.debug("Review card {} quality={} -> interval={} days, EF={}, next={}",
                cardId, quality, card.getInterval(), card.getEaseFactor(), card.getNextReviewDate());

        return reviewCardRepository.save(card);
    }
}
