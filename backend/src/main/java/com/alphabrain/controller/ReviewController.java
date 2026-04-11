package com.alphabrain.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alphabrain.model.ReviewCard;
import com.alphabrain.service.ReviewService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/due")
    public ResponseEntity<List<ReviewCard>> getDueCards(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reviewService.getDueCards(userDetails.getUsername()));
    }

    @GetMapping("/due/count")
    public ResponseEntity<Map<String, Long>> getDueCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        long count = reviewService.countDueCards(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReviewCard>> getAllCards(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reviewService.getAllCards(userDetails.getUsername()));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reviewService.getStats(userDetails.getUsername()));
    }

    @PostMapping("/enable-all")
    public ResponseEntity<Map<String, Object>> enableForAllNodes(
            @AuthenticationPrincipal UserDetails userDetails) {
        int created = reviewService.enableForAllNodes(userDetails.getUsername());
        return ResponseEntity.ok(Map.of(
                "created", created,
                "message", created > 0
                        ? created + " knowledge nodes added to review schedule"
                        : "All nodes already have review cards"));
    }

    @PostMapping("/enable/{nodeId}")
    public ResponseEntity<ReviewCard> enableForNode(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String nodeId) {
        return ResponseEntity.ok(reviewService.getOrCreateCard(userDetails.getUsername(), nodeId));
    }

    @PostMapping("/{cardId}/submit")
    public ResponseEntity<ReviewCard> submitReview(
            @PathVariable String cardId,
            @RequestBody ReviewSubmission submission) {
        return ResponseEntity.ok(reviewService.submitReview(cardId, submission.getQuality()));
    }

    @Data
    public static class ReviewSubmission {
        private int quality; // 0-5
    }
}
