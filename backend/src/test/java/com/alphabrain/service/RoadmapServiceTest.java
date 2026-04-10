package com.alphabrain.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.alphabrain.model.Roadmap;
import com.alphabrain.repository.RoadmapRepository;
import com.alphabrain.service.impl.RoadmapServiceImpl;

@ExtendWith(MockitoExtension.class)
public class RoadmapServiceTest {
    
    @Mock
    private RoadmapRepository roadmapRepository;
    
    @InjectMocks
    private RoadmapServiceImpl roadmapService;
    
    private Roadmap testRoadmap;
    
    @BeforeEach
    void setUp() {
        testRoadmap = new Roadmap();
        testRoadmap.setId("test-id");
        testRoadmap.setTitle("Test Roadmap");
        testRoadmap.setDescription("Test Description");
        testRoadmap.setCategory("programming");
        testRoadmap.setUserId("test-user");
        testRoadmap.setIsPublic(true);
        testRoadmap.setCreatedAt(LocalDateTime.now());
        testRoadmap.setUpdatedAt(LocalDateTime.now());
    }
    
    @Test
    void createRoadmap_ShouldSetTimestampsAndSave() {
        when(roadmapRepository.save(any(Roadmap.class))).thenReturn(testRoadmap);
        
        Roadmap result = roadmapService.createRoadmap(testRoadmap);
        
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());
        verify(roadmapRepository).save(testRoadmap);
    }
    
    @Test
    void updateRoadmap_ShouldUpdateTimestampAndSave() {
        when(roadmapRepository.findById("test-id")).thenReturn(Optional.of(testRoadmap));
        when(roadmapRepository.save(any(Roadmap.class))).thenReturn(testRoadmap);
        
        Roadmap result = roadmapService.updateRoadmap("test-id", testRoadmap);
        
        assertNotNull(result.getUpdatedAt());
        verify(roadmapRepository).save(testRoadmap);
    }
    
    @Test
    void getRoadmap_ShouldReturnRoadmap() {
        when(roadmapRepository.findById("test-id")).thenReturn(Optional.of(testRoadmap));
        
        Roadmap result = roadmapService.getRoadmap("test-id");
        
        assertEquals(testRoadmap, result);
    }
    
    @Test
    void getRoadmap_ShouldThrowException_WhenNotFound() {
        when(roadmapRepository.findById("test-id")).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> roadmapService.getRoadmap("test-id"));
    }
    
    @Test
    void getAllPublicRoadmaps_ShouldReturnPublicRoadmaps() {
        List<Roadmap> roadmaps = Arrays.asList(testRoadmap);
        when(roadmapRepository.findByIsPublicTrue()).thenReturn(roadmaps);
        
        List<Roadmap> result = roadmapService.getAllPublicRoadmaps();
        
        assertEquals(roadmaps, result);
    }
    
    @Test
    void getUserRoadmaps_ShouldReturnUserRoadmaps() {
        List<Roadmap> roadmaps = Arrays.asList(testRoadmap);
        when(roadmapRepository.findByUserId("test-user")).thenReturn(roadmaps);
        
        List<Roadmap> result = roadmapService.getUserRoadmaps("test-user");
        
        assertEquals(roadmaps, result);
    }
    
    @Test
    void cloneTemplate_ShouldCreateNewRoadmap() {
        testRoadmap.setIsTemplate(true);
        when(roadmapRepository.findById("template-id")).thenReturn(Optional.of(testRoadmap));
        when(roadmapRepository.save(any(Roadmap.class))).thenAnswer(i -> i.getArgument(0));
        
        Roadmap result = roadmapService.cloneTemplate("template-id", "new-user");
        
        assertNotEquals(testRoadmap.getId(), result.getId());
        assertEquals("Test Roadmap - Copy", result.getTitle());
        assertEquals("new-user", result.getUserId());
        assertFalse(result.isTemplate());
        assertFalse(result.isPublic());
    }
    
    @Test
    void cloneTemplate_ShouldThrowException_WhenNotTemplate() {
        testRoadmap.setIsTemplate(false);
        when(roadmapRepository.findById("template-id")).thenReturn(Optional.of(testRoadmap));
        
        assertThrows(RuntimeException.class,
                () -> roadmapService.cloneTemplate("template-id", "new-user"));
    }
    
    @Test
    void canUserAccessRoadmap_ShouldReturnTrue_WhenPublicOrOwned() {
        when(roadmapRepository.findByIdAndIsPublicOrUserId("test-id", "test-user"))
                .thenReturn(Optional.of(testRoadmap));
        
        assertTrue(roadmapService.canUserAccessRoadmap("test-user", "test-id"));
    }
    
    @Test
    void canUserAccessRoadmap_ShouldReturnFalse_WhenNotPublicOrOwned() {
        when(roadmapRepository.findByIdAndIsPublicOrUserId("test-id", "test-user"))
                .thenReturn(Optional.empty());
        
        assertFalse(roadmapService.canUserAccessRoadmap("test-user", "test-id"));
    }
} 