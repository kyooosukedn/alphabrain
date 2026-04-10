package com.alphabrain.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.alphabrain.model.Roadmap;
import com.alphabrain.repository.RoadmapRepository;
import com.alphabrain.service.RoadmapService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoadmapServiceImpl implements RoadmapService {
    
    private final RoadmapRepository roadmapRepository;
    
    @Override
    public Roadmap createRoadmap(Roadmap roadmap) {
        roadmap.setCreatedAt(LocalDateTime.now());
        roadmap.setUpdatedAt(LocalDateTime.now());
        return roadmapRepository.save(roadmap);
    }
    
    @Override
    public Roadmap updateRoadmap(String id, Roadmap roadmap) {
        Roadmap existing = getRoadmap(id);
        roadmap.setId(existing.getId());
        roadmap.setUpdatedAt(LocalDateTime.now());
        return roadmapRepository.save(roadmap);
    }
    
    @Override
    public void deleteRoadmap(String id) {
        roadmapRepository.deleteById(id);
    }
    
    @Override
    public Roadmap getRoadmap(String id) {
        return roadmapRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Roadmap not found: " + id));
    }
    
    @Override
    public List<Roadmap> getAllPublicRoadmaps() {
        return roadmapRepository.findByIsPublicTrue();
    }
    
    @Override
    public List<Roadmap> getUserRoadmaps(String userId) {
        return roadmapRepository.findByUserId(userId);
    }
    
    @Override
    public List<Roadmap> getTemplateRoadmaps() {
        return roadmapRepository.findByIsTemplateTrue();
    }
    
    @Override
    public List<Roadmap> getRoadmapsByCategory(String category) {
        return roadmapRepository.findByIsPublicTrueAndCategory(category);
    }
    
    @Override
    public List<Roadmap> getRoadmapsByDifficulty(String difficultyLevel) {
        return roadmapRepository.findByDifficultyLevelAndIsPublicTrue(difficultyLevel);
    }
    
    @Override
    public List<Roadmap> searchRoadmaps(String searchTerm) {
        return roadmapRepository.searchPublicRoadmaps(searchTerm);
    }
    
    @Override
    public List<Roadmap> getRoadmapsByTags(List<String> tags) {
        return roadmapRepository.findByTagsInAndIsPublicTrue(tags);
    }
    
    @Override
    public Roadmap cloneTemplate(String templateId, String userId) {
        Roadmap template = getRoadmap(templateId);
        if (!template.isTemplate()) {
            throw new RuntimeException("Roadmap is not a template: " + templateId);
        }
        
        Roadmap clone = new Roadmap();
        clone.setTitle(template.getTitle() + " - Copy");
        clone.setDescription(template.getDescription());
        clone.setCategory(template.getCategory());
        clone.setThumbnailUrl(template.getThumbnailUrl());
        clone.setItems(template.getItems());
        clone.setNodeIds(template.getNodeIds());
        clone.setStructure(template.getStructure());
        clone.setUserId(userId);
        clone.setIsPublic(false);
        clone.setIsTemplate(false);
        clone.setTags(template.getTags());
        clone.setDifficultyLevel(template.getDifficultyLevel());
        clone.setEstimatedTimeToComplete(template.getEstimatedTimeToComplete());
        
        return createRoadmap(clone);
    }
    
    @Override
    public long countUserRoadmaps(String userId) {
        return roadmapRepository.countByUserId(userId);
    }
    
    @Override
    public boolean canUserAccessRoadmap(String userId, String roadmapId) {
        return roadmapRepository.findByIdAndIsPublicOrUserId(roadmapId, userId).isPresent();
    }
} 