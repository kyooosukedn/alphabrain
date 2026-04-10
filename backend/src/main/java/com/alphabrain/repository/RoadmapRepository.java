package com.alphabrain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.alphabrain.model.Roadmap;

@Repository
public interface RoadmapRepository extends MongoRepository<Roadmap, String> {
    
    // Find all public roadmaps
    List<Roadmap> findByIsPublicTrue();
    
    // Find all roadmaps by user
    List<Roadmap> findByUserId(String userId);
    
    // Find public roadmaps by category
    List<Roadmap> findByIsPublicTrueAndCategory(String category);
    
    // Find template roadmaps
    List<Roadmap> findByIsTemplateTrue();
    
    // Find by difficulty level
    List<Roadmap> findByDifficultyLevelAndIsPublicTrue(String difficultyLevel);
    
    // Search roadmaps by title or description (case-insensitive)
    @Query("{ 'isPublic': true, $or: [ " +
           "{ 'title': { $regex: ?0, $options: 'i' }}, " +
           "{ 'description': { $regex: ?0, $options: 'i' }} ]}")
    List<Roadmap> searchPublicRoadmaps(String searchTerm);
    
    // Find roadmap by id and check if public or owned by user
    @Query("{ '_id': ?0, $or: [ { 'isPublic': true }, { 'userId': ?1 } ]}")
    Optional<Roadmap> findByIdAndIsPublicOrUserId(String id, String userId);
    
    // Find roadmaps by tags
    List<Roadmap> findByTagsInAndIsPublicTrue(List<String> tags);
    
    // Count roadmaps by user
    long countByUserId(String userId);
} 