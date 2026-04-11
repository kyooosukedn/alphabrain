package com.alphabrain.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alphabrain.model.KnowledgeNode;
import com.alphabrain.model.Roadmap;
import com.alphabrain.model.RoadmapRating;
import com.alphabrain.service.KnowledgeNodeService;
import com.alphabrain.service.RoadmapRatingService;
import com.alphabrain.service.RoadmapService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/roadmaps")
@RequiredArgsConstructor
public class RoadmapController {
    
    private final RoadmapService roadmapService;

    @Autowired
    private KnowledgeNodeService knowledgeNodeService;

    @Autowired
    private RoadmapRatingService ratingService;
    
    /**
     * Create a new roadmap
     */
    @PostMapping
    public ResponseEntity<Roadmap> createRoadmap(
            @RequestBody Roadmap roadmap,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Set the user ID and author from the authenticated user
        roadmap.setUserId(userDetails.getUsername());
        roadmap.setAuthorUsername(userDetails.getUsername());

        Roadmap createdRoadmap = roadmapService.createRoadmap(roadmap);
        return new ResponseEntity<>(createdRoadmap, HttpStatus.CREATED);
    }
    
    /**
     * Get all roadmaps for the authenticated user
     */
    @GetMapping
    public ResponseEntity<List<Roadmap>> getRoadmapsForUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        List<Roadmap> roadmaps = roadmapService.getRoadmapsByUserId(userDetails.getUsername());
        return ResponseEntity.ok(roadmaps);
    }
    
    /**
     * Get public roadmaps
     */
    @GetMapping("/public")
    public ResponseEntity<List<Roadmap>> getPublicRoadmaps() {
        return ResponseEntity.ok(roadmapService.getAllPublicRoadmaps());
    }
    
    /**
     * Get a roadmap by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Roadmap> getRoadmapById(@PathVariable String id) {
        Optional<Roadmap> roadmapOpt = roadmapService.getRoadmapById(id);
        
        return roadmapOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Update a roadmap
     */
    @PutMapping("/{id}")
    public ResponseEntity<Roadmap> updateRoadmap(
            @PathVariable String id, 
            @RequestBody Roadmap roadmap,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Check if the roadmap exists and belongs to the user
        Optional<Roadmap> existingRoadmapOpt = roadmapService.getRoadmapById(id);
        if (existingRoadmapOpt.isPresent()) {
            Roadmap existingRoadmap = existingRoadmapOpt.get();
            
            // Verify ownership
            if (!existingRoadmap.getUserId().equals(userDetails.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            Roadmap updatedRoadmap = roadmapService.updateRoadmap(id, roadmap);
            return ResponseEntity.ok(updatedRoadmap);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Delete a roadmap
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoadmap(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Check if the roadmap exists and belongs to the user
        Optional<Roadmap> existingRoadmapOpt = roadmapService.getRoadmapById(id);
        if (existingRoadmapOpt.isPresent()) {
            Roadmap existingRoadmap = existingRoadmapOpt.get();
            
            // Verify ownership
            if (!existingRoadmap.getUserId().equals(userDetails.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            roadmapService.deleteRoadmap(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Add a node to a roadmap
     */
    @PostMapping("/{roadmapId}/nodes/{nodeId}")
    public ResponseEntity<Roadmap> addNodeToRoadmap(
            @PathVariable String roadmapId,
            @PathVariable String nodeId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Check if the roadmap exists and belongs to the user
        Optional<Roadmap> existingRoadmapOpt = roadmapService.getRoadmapById(roadmapId);
        if (existingRoadmapOpt.isPresent()) {
            Roadmap existingRoadmap = existingRoadmapOpt.get();
            
            // Verify ownership
            if (!existingRoadmap.getUserId().equals(userDetails.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            try {
                Roadmap updatedRoadmap = roadmapService.addNodeToRoadmap(roadmapId, nodeId);
                return ResponseEntity.ok(updatedRoadmap);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Remove a node from a roadmap
     */
    @DeleteMapping("/{roadmapId}/nodes/{nodeId}")
    public ResponseEntity<Roadmap> removeNodeFromRoadmap(
            @PathVariable String roadmapId,
            @PathVariable String nodeId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Check if the roadmap exists and belongs to the user
        Optional<Roadmap> existingRoadmapOpt = roadmapService.getRoadmapById(roadmapId);
        if (existingRoadmapOpt.isPresent()) {
            Roadmap existingRoadmap = existingRoadmapOpt.get();
            
            // Verify ownership
            if (!existingRoadmap.getUserId().equals(userDetails.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            try {
                Roadmap updatedRoadmap = roadmapService.removeNodeFromRoadmap(roadmapId, nodeId);
                return ResponseEntity.ok(updatedRoadmap);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get all nodes in a roadmap
     */
    @GetMapping("/{roadmapId}/nodes")
    public ResponseEntity<List<KnowledgeNode>> getNodesInRoadmap(@PathVariable String roadmapId) {
        Optional<Roadmap> roadmapOpt = roadmapService.getRoadmapById(roadmapId);
        
        if (roadmapOpt.isPresent()) {
            Roadmap roadmap = roadmapOpt.get();
            List<String> nodeIds = roadmap.getNodeIds();
            
            List<KnowledgeNode> nodes = nodeIds.stream()
                .map(nodeId -> knowledgeNodeService.getNodeById(nodeId))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(nodes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Update roadmap structure
     */
    @PutMapping("/{roadmapId}/structure")
    public ResponseEntity<Roadmap> updateRoadmapStructure(
            @PathVariable String roadmapId,
            @RequestBody Roadmap.RoadmapStructure structure,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Check if the roadmap exists and belongs to the user
        Optional<Roadmap> existingRoadmapOpt = roadmapService.getRoadmapById(roadmapId);
        if (existingRoadmapOpt.isPresent()) {
            Roadmap existingRoadmap = existingRoadmapOpt.get();
            
            // Verify ownership
            if (!existingRoadmap.getUserId().equals(userDetails.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            try {
                Roadmap updatedRoadmap = roadmapService.updateRoadmapStructure(roadmapId, structure);
                return ResponseEntity.ok(updatedRoadmap);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Search roadmaps by title
     */
    @GetMapping("/search/{title}")
    public ResponseEntity<List<Roadmap>> searchRoadmapsByTitle(
            @PathVariable String title,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        List<Roadmap> searchResults = roadmapService.searchRoadmapsByTitle(title);
        
        // Filter to only include user's roadmaps and public roadmaps
        searchResults = searchResults.stream()
            .filter(roadmap -> roadmap.isPublic() || roadmap.getUserId().equals(userDetails.getUsername()))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(searchResults);
    }
    
    /**
     * Find roadmaps by tag
     */
    @GetMapping("/tags/{tag}")
    public ResponseEntity<List<Roadmap>> findRoadmapsByTag(
            @PathVariable String tag,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        List<Roadmap> roadmaps = roadmapService.findRoadmapsByTag(tag);
        
        // Filter to only include user's roadmaps and public roadmaps
        roadmaps = roadmaps.stream()
            .filter(roadmap -> roadmap.isPublic() || roadmap.getUserId().equals(userDetails.getUsername()))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(roadmaps);
    }
    
    @GetMapping("/templates")
    public ResponseEntity<List<Roadmap>> getTemplateRoadmaps() {
        return ResponseEntity.ok(roadmapService.getTemplateRoadmaps());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Roadmap>> getRoadmapsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(roadmapService.getRoadmapsByCategory(category));
    }

    @GetMapping("/difficulty/{level}")
    public ResponseEntity<List<Roadmap>> getRoadmapsByDifficulty(@PathVariable String level) {
        return ResponseEntity.ok(roadmapService.getRoadmapsByDifficulty(level));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Roadmap>> searchRoadmaps(@RequestParam String query) {
        return ResponseEntity.ok(roadmapService.searchRoadmaps(query));
    }

    @GetMapping("/tags")
    public ResponseEntity<List<Roadmap>> getRoadmapsByTags(@RequestParam List<String> tags) {
        return ResponseEntity.ok(roadmapService.getRoadmapsByTags(tags));
    }

    @PostMapping("/templates/{templateId}/clone")
    public ResponseEntity<Roadmap> cloneTemplate(
            @PathVariable String templateId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(roadmapService.cloneTemplate(templateId, userDetails.getUsername()));
    }

    @GetMapping("/user/count")
    public ResponseEntity<Long> countUserRoadmaps(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(roadmapService.countUserRoadmaps(userDetails.getUsername()));
    }

    // ─── Rating & Review Endpoints ───

    @PostMapping("/{id}/rate")
    public ResponseEntity<?> rateRoadmap(
            @PathVariable String id,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            int rating = ((Number) body.get("rating")).intValue();
            String review = (String) body.getOrDefault("review", null);
            RoadmapRating result = ratingService.rateRoadmap(
                    id, userDetails.getUsername(), userDetails.getUsername(), rating, review);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/ratings")
    public ResponseEntity<List<RoadmapRating>> getRoadmapRatings(@PathVariable String id) {
        return ResponseEntity.ok(ratingService.getRatingsForRoadmap(id));
    }

    @GetMapping("/{id}/ratings/summary")
    public ResponseEntity<Map<String, Object>> getRatingSummary(@PathVariable String id) {
        return ResponseEntity.ok(ratingService.getRoadmapRatingSummary(id));
    }

    @GetMapping("/{id}/ratings/mine")
    public ResponseEntity<?> getMyRating(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ratingService.getUserRating(id, userDetails.getUsername())
                .map(r -> ResponseEntity.ok((Object) r))
                .orElse(ResponseEntity.noContent().build());
    }

    @DeleteMapping("/{id}/ratings/mine")
    public ResponseEntity<Void> deleteMyRating(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        ratingService.deleteRating(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    // ─── Discovery Endpoints ───

    @GetMapping("/discover/popular")
    public ResponseEntity<List<Roadmap>> getPopularRoadmaps() {
        List<Roadmap> roadmaps = roadmapService.getAllPublicRoadmaps();
        roadmaps.sort((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()));
        return ResponseEntity.ok(roadmaps.stream().limit(20).toList());
    }

    @GetMapping("/discover/recent")
    public ResponseEntity<List<Roadmap>> getRecentRoadmaps() {
        List<Roadmap> roadmaps = roadmapService.getAllPublicRoadmaps();
        roadmaps.sort((a, b) -> {
            if (b.getCreatedAt() == null || a.getCreatedAt() == null) return 0;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        });
        return ResponseEntity.ok(roadmaps.stream().limit(20).toList());
    }

    @GetMapping("/discover/most-cloned")
    public ResponseEntity<List<Roadmap>> getMostClonedRoadmaps() {
        List<Roadmap> roadmaps = roadmapService.getAllPublicRoadmaps();
        roadmaps.sort((a, b) -> Integer.compare(b.getCloneCount(), a.getCloneCount()));
        return ResponseEntity.ok(roadmaps.stream().limit(20).toList());
    }

    // ─── Clone with tracking ───

    @PostMapping("/{id}/clone")
    public ResponseEntity<?> clonePublicRoadmap(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Optional<Roadmap> roadmapOpt = roadmapService.getRoadmapById(id);
            if (roadmapOpt.isEmpty()) return ResponseEntity.notFound().build();

            Roadmap original = roadmapOpt.get();
            if (!original.isPublic() && !original.isTemplate()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Roadmap is not public"));
            }

            // Increment clone count on original
            original.setCloneCount(original.getCloneCount() + 1);
            roadmapService.updateRoadmap(original.getId(), original);

            // Clone it
            Roadmap clone = roadmapService.cloneRoadmap(id, userDetails.getUsername());
            return ResponseEntity.ok(clone);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 