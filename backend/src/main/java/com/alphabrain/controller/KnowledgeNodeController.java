package com.alphabrain.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RestController;

import com.alphabrain.model.KnowledgeNode;
import com.alphabrain.service.KnowledgeNodeService;

@RestController
@RequestMapping("/api/nodes")
public class KnowledgeNodeController {
    
    @Autowired
    private KnowledgeNodeService knowledgeNodeService;
    
    /**
     * Create a new knowledge node
     */
    @PostMapping
    public ResponseEntity<KnowledgeNode> createNode(
            @RequestBody KnowledgeNode node,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Set the user ID from the authenticated user
        node.setUserId(userDetails.getUsername());
        
        KnowledgeNode createdNode = knowledgeNodeService.createNode(node);
        return new ResponseEntity<>(createdNode, HttpStatus.CREATED);
    }
    
    /**
     * Get all knowledge nodes for the authenticated user
     */
    @GetMapping
    public ResponseEntity<List<KnowledgeNode>> getNodesForUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        List<KnowledgeNode> nodes = knowledgeNodeService.getNodesByUserId(userDetails.getUsername());
        return ResponseEntity.ok(nodes);
    }
    
    /**
     * Get a knowledge node by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<KnowledgeNode> getNodeById(@PathVariable String id) {
        Optional<KnowledgeNode> nodeOpt = knowledgeNodeService.getNodeById(id);
        
        return nodeOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Update a knowledge node
     */
    @PutMapping("/{id}")
    public ResponseEntity<KnowledgeNode> updateNode(
            @PathVariable String id, 
            @RequestBody KnowledgeNode node,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Check if the node exists and belongs to the user
        Optional<KnowledgeNode> existingNodeOpt = knowledgeNodeService.getNodeById(id);
        if (existingNodeOpt.isPresent()) {
            KnowledgeNode existingNode = existingNodeOpt.get();
            
            // Verify ownership (except for system nodes)
            if (existingNode.getUserId() != null && 
                !existingNode.getUserId().equals(userDetails.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            KnowledgeNode updatedNode = knowledgeNodeService.updateNode(id, node);
            return ResponseEntity.ok(updatedNode);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Update a node's progress
     */
    @PutMapping("/{id}/progress")
    public ResponseEntity<KnowledgeNode> updateNodeProgress(
            @PathVariable String id,
            @RequestBody Map<String, Object> progressUpdate,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Check if the node exists and belongs to the user
        Optional<KnowledgeNode> existingNodeOpt = knowledgeNodeService.getNodeById(id);
        if (existingNodeOpt.isPresent()) {
            KnowledgeNode existingNode = existingNodeOpt.get();
            
            // Verify ownership
            if (!existingNode.getUserId().equals(userDetails.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            // Extract progress values from the request
            int progress = (int) progressUpdate.getOrDefault("progress", existingNode.getProgress());
            int masteryLevel = (int) progressUpdate.getOrDefault("masteryLevel", existingNode.getMasteryLevel());
            boolean completed = (boolean) progressUpdate.getOrDefault("completed", existingNode.isCompleted());
            
            KnowledgeNode updatedNode = knowledgeNodeService.updateNodeProgress(id, progress, masteryLevel, completed);
            return ResponseEntity.ok(updatedNode);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Delete a knowledge node
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNode(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Check if the node exists and belongs to the user
        Optional<KnowledgeNode> existingNodeOpt = knowledgeNodeService.getNodeById(id);
        if (existingNodeOpt.isPresent()) {
            KnowledgeNode existingNode = existingNodeOpt.get();
            
            // Verify ownership
            if (!existingNode.getUserId().equals(userDetails.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            knowledgeNodeService.deleteNode(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get prerequisites for a node
     */
    @GetMapping("/{id}/prerequisites")
    public ResponseEntity<List<KnowledgeNode>> getPrerequisites(@PathVariable String id) {
        Optional<KnowledgeNode> nodeOpt = knowledgeNodeService.getNodeById(id);
        
        if (nodeOpt.isPresent()) {
            List<KnowledgeNode> prerequisites = knowledgeNodeService.getPrerequisiteNodes(id);
            return ResponseEntity.ok(prerequisites);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get next nodes after this one
     */
    @GetMapping("/{id}/next")
    public ResponseEntity<List<KnowledgeNode>> getNextNodes(@PathVariable String id) {
        Optional<KnowledgeNode> nodeOpt = knowledgeNodeService.getNodeById(id);
        
        if (nodeOpt.isPresent()) {
            List<KnowledgeNode> nextNodes = knowledgeNodeService.getNextNodes(id);
            return ResponseEntity.ok(nextNodes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Search for nodes by title
     */
    @GetMapping("/search/{title}")
    public ResponseEntity<List<KnowledgeNode>> searchNodesByTitle(
            @PathVariable String title,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        List<KnowledgeNode> searchResults = knowledgeNodeService.searchNodesByTitle(title);
        
        // Filter out nodes that don't belong to the user
        searchResults.removeIf(node -> 
            node.getUserId() != null && 
            !node.getUserId().equals(userDetails.getUsername()));
        
        return ResponseEntity.ok(searchResults);
    }
} 