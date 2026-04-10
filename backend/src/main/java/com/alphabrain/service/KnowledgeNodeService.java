package com.alphabrain.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alphabrain.model.KnowledgeNode;
import com.alphabrain.repository.KnowledgeNodeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KnowledgeNodeService {
    
    private final KnowledgeNodeRepository knowledgeNodeRepository;
    private final StreakService streakService;
    
    /**
     * Create a new knowledge node
     */
    public KnowledgeNode createNode(KnowledgeNode node) {
        node.setCreatedAt(LocalDateTime.now());
        node.setUpdatedAt(LocalDateTime.now());
        
        // Initialize progress metrics
        if (node.getProgress() < 0) {
            node.setProgress(0);
        }
        if (node.getMasteryLevel() < 0) {
            node.setMasteryLevel(0);
        }
        
        return knowledgeNodeRepository.save(node);
    }
    
    /**
     * Get all knowledge nodes
     */
    public List<KnowledgeNode> getAllNodes() {
        return knowledgeNodeRepository.findAll();
    }
    
    /**
     * Get knowledge nodes by user ID
     */
    public List<KnowledgeNode> getNodesByUserId(String userId) {
        return knowledgeNodeRepository.findByUserId(userId);
    }
    
    /**
     * Get a knowledge node by ID
     */
    public Optional<KnowledgeNode> getNodeById(String id) {
        return knowledgeNodeRepository.findById(id);
    }
    
    /**
     * Update a knowledge node
     */
    public KnowledgeNode updateNode(String id, KnowledgeNode updatedNode) {
        Optional<KnowledgeNode> existingNodeOpt = knowledgeNodeRepository.findById(id);
        
        if (existingNodeOpt.isPresent()) {
            KnowledgeNode existingNode = existingNodeOpt.get();
            
            if (updatedNode.getTitle() != null) {
                existingNode.setTitle(updatedNode.getTitle());
            }
            if (updatedNode.getDescription() != null) {
                existingNode.setDescription(updatedNode.getDescription());
            }
            if (updatedNode.getCategory() != null) {
                existingNode.setCategory(updatedNode.getCategory());
            }
            if (updatedNode.getNodeType() != null) {
                existingNode.setNodeType(updatedNode.getNodeType());
            }
            if (updatedNode.getDifficultyLevel() > 0) {
                existingNode.setDifficultyLevel(updatedNode.getDifficultyLevel());
            }
            if (updatedNode.getEstimatedTimeToLearn() > 0) {
                existingNode.setEstimatedTimeToLearn(updatedNode.getEstimatedTimeToLearn());
            }
            if (updatedNode.getPrerequisites() != null && !updatedNode.getPrerequisites().isEmpty()) {
                existingNode.setPrerequisites(updatedNode.getPrerequisites());
            }
            if (updatedNode.getLeadsTo() != null && !updatedNode.getLeadsTo().isEmpty()) {
                existingNode.setLeadsTo(updatedNode.getLeadsTo());
            }
            if (updatedNode.getResources() != null && !updatedNode.getResources().isEmpty()) {
                existingNode.setResources(updatedNode.getResources());
            }
            
            // Update progress metrics
            if (updatedNode.getProgress() >= 0) {
                existingNode.setProgress(updatedNode.getProgress());
            }
            if (updatedNode.getMasteryLevel() >= 0) {
                existingNode.setMasteryLevel(updatedNode.getMasteryLevel());
            }
            existingNode.setCompleted(updatedNode.isCompleted());
            
            existingNode.setUpdatedAt(LocalDateTime.now());
            
            return knowledgeNodeRepository.save(existingNode);
        } else {
            throw new IllegalArgumentException("Knowledge node with ID " + id + " not found");
        }
    }
    
    /**
     * Update node progress
     */
    public KnowledgeNode updateNodeProgress(String id, int progress, int masteryLevel, boolean completed) {
        Optional<KnowledgeNode> nodeOpt = knowledgeNodeRepository.findById(id);
        
        if (nodeOpt.isPresent()) {
            KnowledgeNode node = nodeOpt.get();
            boolean wasCompletedBefore = node.isCompleted();
            
            node.setProgress(progress);
            node.setMasteryLevel(masteryLevel);
            node.setCompleted(completed);
            node.setUpdatedAt(LocalDateTime.now());
            
            // Record node completion in streak system if newly completed
            if (completed && !wasCompletedBefore && node.getUserId() != null) {
                streakService.recordNodeCompletion(node.getUserId());
            }
            
            return knowledgeNodeRepository.save(node);
        } else {
            throw new IllegalArgumentException("Knowledge node with ID " + id + " not found");
        }
    }
    
    /**
     * Delete a knowledge node
     */
    public void deleteNode(String id) {
        knowledgeNodeRepository.deleteById(id);
    }
    
    /**
     * Find nodes that are prerequisites for a given node
     */
    public List<KnowledgeNode> getPrerequisiteNodes(String nodeId) {
        return knowledgeNodeRepository.findByLeadsToContaining(nodeId);
    }
    
    /**
     * Find nodes that a given node leads to
     */
    public List<KnowledgeNode> getNextNodes(String nodeId) {
        return knowledgeNodeRepository.findByPrerequisitesContaining(nodeId);
    }
    
    /**
     * Find nodes by title (for search)
     */
    public List<KnowledgeNode> searchNodesByTitle(String title) {
        return knowledgeNodeRepository.findByTitleContainingIgnoreCase(title);
    }
} 