package com.alphabrain.service;

import java.util.List;
import java.util.Optional;

import com.alphabrain.model.Roadmap;

public interface RoadmapService {

    // CRUD operations
    Roadmap createRoadmap(Roadmap roadmap);
    Roadmap updateRoadmap(String id, Roadmap roadmap);
    void deleteRoadmap(String id);
    Roadmap getRoadmap(String id);

    // Query by user
    List<Roadmap> getRoadmapsByUserId(String userId);
    Optional<Roadmap> getRoadmapById(String id);

    // List operations
    List<Roadmap> getAllPublicRoadmaps();
    List<Roadmap> getUserRoadmaps(String userId);
    List<Roadmap> getTemplateRoadmaps();
    List<Roadmap> getRoadmapsByCategory(String category);
    List<Roadmap> getRoadmapsByDifficulty(String difficultyLevel);
    List<Roadmap> searchRoadmaps(String searchTerm);
    List<Roadmap> getRoadmapsByTags(List<String> tags);

    // Search
    List<Roadmap> searchRoadmapsByTitle(String title);
    List<Roadmap> findRoadmapsByTag(String tag);

    // Node management
    Roadmap addNodeToRoadmap(String roadmapId, String nodeId);
    Roadmap removeNodeFromRoadmap(String roadmapId, String nodeId);
    Roadmap updateRoadmapStructure(String roadmapId, Roadmap.RoadmapStructure structure);

    // Template / clone operations
    Roadmap cloneTemplate(String templateId, String userId);
    Roadmap cloneRoadmap(String roadmapId, String userId);

    // Statistics
    long countUserRoadmaps(String userId);

    // Validation
    boolean canUserAccessRoadmap(String userId, String roadmapId);
}
