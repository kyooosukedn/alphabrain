package com.alphabrain.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.alphabrain.model.KnowledgeNode;

@Repository
public interface KnowledgeNodeRepository extends MongoRepository<KnowledgeNode, String> {
    
    // Find nodes by user ID
    List<KnowledgeNode> findByUserId(String userId);
    
    // Find completed nodes by user ID
    List<KnowledgeNode> findByUserIdAndCompletedTrue(String userId);
    
    // Find nodes by category
    List<KnowledgeNode> findByCategory(String category);
    
    // Find nodes by difficulty level
    List<KnowledgeNode> findByDifficultyLevel(int difficultyLevel);
    
    // Find nodes by node type
    List<KnowledgeNode> findByNodeType(String nodeType);
    
    // Find nodes that are prerequisites for a given node
    List<KnowledgeNode> findByLeadsToContaining(String nodeId);
    
    // Find nodes that a given node leads to
    List<KnowledgeNode> findByPrerequisitesContaining(String nodeId);
    
    // Find nodes by title containing a given string (for search)
    List<KnowledgeNode> findByTitleContainingIgnoreCase(String title);
} 