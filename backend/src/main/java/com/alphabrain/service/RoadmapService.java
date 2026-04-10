package com.alphabrain.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alphabrain.model.KnowledgeNode;
import com.alphabrain.model.Roadmap;
import com.alphabrain.repository.KnowledgeNodeRepository;
import com.alphabrain.repository.RoadmapRepository;

import lombok.RequiredArgsConstructor;

public interface RoadmapService {
    
    // CRUD operations
    Roadmap createRoadmap(Roadmap roadmap);
    Roadmap updateRoadmap(String id, Roadmap roadmap);
    void deleteRoadmap(String id);
    Roadmap getRoadmap(String id);
    
    // List operations
    List<Roadmap> getAllPublicRoadmaps();
    List<Roadmap> getUserRoadmaps(String userId);
    List<Roadmap> getTemplateRoadmaps();
    List<Roadmap> getRoadmapsByCategory(String category);
    List<Roadmap> getRoadmapsByDifficulty(String difficultyLevel);
    List<Roadmap> searchRoadmaps(String searchTerm);
    List<Roadmap> getRoadmapsByTags(List<String> tags);
    
    // Template operations
    Roadmap cloneTemplate(String templateId, String userId);
    
    // Statistics
    long countUserRoadmaps(String userId);
    
    // Validation
    boolean canUserAccessRoadmap(String userId, String roadmapId);
}

@Service
@RequiredArgsConstructor
public class RoadmapServiceImpl implements RoadmapService {
    
    private final RoadmapRepository roadmapRepository;
    private final KnowledgeNodeRepository knowledgeNodeRepository;
    private final StreakService streakService;
    
    /**
     * Create a new roadmap
     */
    public Roadmap createRoadmap(Roadmap roadmap) {
        roadmap.setCreatedAt(LocalDateTime.now());
        roadmap.setUpdatedAt(LocalDateTime.now());
        
        // Initialize completion percentage
        roadmap.setCompletionPercentage(calculateCompletionPercentage(roadmap));
        
        return roadmapRepository.save(roadmap);
    }
    
    /**
     * Get all roadmaps
     */
    public List<Roadmap> getAllRoadmaps() {
        return roadmapRepository.findAll();
    }
    
    /**
     * Get roadmaps by user ID
     */
    public List<Roadmap> getRoadmapsByUserId(String userId) {
        return roadmapRepository.findByUserId(userId);
    }
    
    /**
     * Get public roadmaps
     */
    public List<Roadmap> getPublicRoadmaps() {
        return roadmapRepository.findByIsPublicTrue();
    }
    
    /**
     * Get a roadmap by ID
     */
    public Optional<Roadmap> getRoadmapById(String id) {
        return roadmapRepository.findById(id);
    }
    
    /**
     * Update a roadmap
     */
    public Roadmap updateRoadmap(String id, Roadmap updatedRoadmap) {
        Optional<Roadmap> existingRoadmapOpt = roadmapRepository.findById(id);
        
        if (existingRoadmapOpt.isPresent()) {
            Roadmap existingRoadmap = existingRoadmapOpt.get();
            boolean wasCompletedBefore = existingRoadmap.getCompletionPercentage() == 100;
            
            if (updatedRoadmap.getTitle() != null) {
                existingRoadmap.setTitle(updatedRoadmap.getTitle());
            }
            if (updatedRoadmap.getDescription() != null) {
                existingRoadmap.setDescription(updatedRoadmap.getDescription());
            }
            if (updatedRoadmap.getCategory() != null) {
                existingRoadmap.setCategory(updatedRoadmap.getCategory());
            }
            if (updatedRoadmap.getThumbnailUrl() != null) {
                existingRoadmap.setThumbnailUrl(updatedRoadmap.getThumbnailUrl());
            }
            if (updatedRoadmap.getNodeIds() != null && !updatedRoadmap.getNodeIds().isEmpty()) {
                existingRoadmap.setNodeIds(updatedRoadmap.getNodeIds());
            }
            if (updatedRoadmap.getStructure() != null) {
                existingRoadmap.setStructure(updatedRoadmap.getStructure());
            }
            if (updatedRoadmap.getTags() != null && !updatedRoadmap.getTags().isEmpty()) {
                existingRoadmap.setTags(updatedRoadmap.getTags());
            }
            if (updatedRoadmap.getDifficultyLevel() != null) {
                existingRoadmap.setDifficultyLevel(updatedRoadmap.getDifficultyLevel());
            }
            if (updatedRoadmap.getEstimatedTimeToComplete() > 0) {
                existingRoadmap.setEstimatedTimeToComplete(updatedRoadmap.getEstimatedTimeToComplete());
            }
            
            existingRoadmap.setPublic(updatedRoadmap.isPublic());
            
            // Recalculate completion percentage
            existingRoadmap.setCompletionPercentage(calculateCompletionPercentage(existingRoadmap));
            
            // Check if roadmap is newly completed
            boolean isCompletedNow = existingRoadmap.getCompletionPercentage() == 100;
            if (isCompletedNow && !wasCompletedBefore && existingRoadmap.getUserId() != null) {
                streakService.recordRoadmapCompletion(existingRoadmap.getUserId());
            }
            
            existingRoadmap.setUpdatedAt(LocalDateTime.now());
            
            return roadmapRepository.save(existingRoadmap);
        } else {
            throw new IllegalArgumentException("Roadmap with ID " + id + " not found");
        }
    }
    
    /**
     * Delete a roadmap
     */
    public void deleteRoadmap(String id) {
        roadmapRepository.deleteById(id);
    }
    
    /**
     * Add a node to a roadmap
     */
    public Roadmap addNodeToRoadmap(String roadmapId, String nodeId) {
        Optional<Roadmap> roadmapOpt = roadmapRepository.findById(roadmapId);
        Optional<KnowledgeNode> nodeOpt = knowledgeNodeRepository.findById(nodeId);
        
        if (roadmapOpt.isPresent() && nodeOpt.isPresent()) {
            Roadmap roadmap = roadmapOpt.get();
            
            if (!roadmap.getNodeIds().contains(nodeId)) {
                roadmap.getNodeIds().add(nodeId);
                roadmap.setUpdatedAt(LocalDateTime.now());
                
                // Recalculate completion percentage
                roadmap.setCompletionPercentage(calculateCompletionPercentage(roadmap));
                
                return roadmapRepository.save(roadmap);
            }
            return roadmap;
        } else {
            throw new IllegalArgumentException("Roadmap or node not found");
        }
    }
    
    /**
     * Remove a node from a roadmap
     */
    public Roadmap removeNodeFromRoadmap(String roadmapId, String nodeId) {
        Optional<Roadmap> roadmapOpt = roadmapRepository.findById(roadmapId);
        
        if (roadmapOpt.isPresent()) {
            Roadmap roadmap = roadmapOpt.get();
            
            if (roadmap.getNodeIds().contains(nodeId)) {
                roadmap.getNodeIds().remove(nodeId);
                roadmap.setUpdatedAt(LocalDateTime.now());
                
                // Remove any connections involving this node
                if (roadmap.getStructure() != null) {
                    roadmap.getStructure().getNodePositions().removeIf(np -> np.getNodeId().equals(nodeId));
                    roadmap.getStructure().getConnections().removeIf(
                        c -> c.getSourceNodeId().equals(nodeId) || c.getTargetNodeId().equals(nodeId));
                }
                
                // Recalculate completion percentage
                roadmap.setCompletionPercentage(calculateCompletionPercentage(roadmap));
                
                return roadmapRepository.save(roadmap);
            }
            return roadmap;
        } else {
            throw new IllegalArgumentException("Roadmap not found");
        }
    }
    
    /**
     * Update roadmap structure
     */
    public Roadmap updateRoadmapStructure(String roadmapId, Roadmap.RoadmapStructure structure) {
        Optional<Roadmap> roadmapOpt = roadmapRepository.findById(roadmapId);
        
        if (roadmapOpt.isPresent()) {
            Roadmap roadmap = roadmapOpt.get();
            roadmap.setStructure(structure);
            roadmap.setUpdatedAt(LocalDateTime.now());
            
            return roadmapRepository.save(roadmap);
        } else {
            throw new IllegalArgumentException("Roadmap not found");
        }
    }
    
    /**
     * Search roadmaps by title
     */
    public List<Roadmap> searchRoadmapsByTitle(String title) {
        return roadmapRepository.findByTitleContainingIgnoreCase(title);
    }
    
    /**
     * Find roadmaps by tag
     */
    public List<Roadmap> findRoadmapsByTag(String tag) {
        return roadmapRepository.findByTagsContaining(tag);
    }
    
    /**
     * Calculate the completion percentage of a roadmap
     */
    private int calculateCompletionPercentage(Roadmap roadmap) {
        List<String> nodeIds = roadmap.getNodeIds();
        if (nodeIds == null || nodeIds.isEmpty()) {
            return 0;
        }
        
        // Find all nodes in the roadmap
        Iterable<KnowledgeNode> nodes = knowledgeNodeRepository.findAllById(nodeIds);
        
        int totalNodes = 0;
        int completedNodes = 0;
        
        for (KnowledgeNode node : nodes) {
            totalNodes++;
            if (node.isCompleted()) {
                completedNodes++;
            }
        }
        
        if (totalNodes == 0) {
            return 0;
        }
        
        return (int) Math.round(((double) completedNodes / totalNodes) * 100);
    }
} 