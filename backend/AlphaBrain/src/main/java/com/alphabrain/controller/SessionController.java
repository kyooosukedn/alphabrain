package com.alphabrain.controller;

import com.alphabrain.model.Session;
import com.alphabrain.security.JwtTokenProvider;
import com.alphabrain.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {
    private final SessionService sessionService;
    private final JwtTokenProvider tokenProvider;
    
    @PostMapping
    public ResponseEntity<Session> createSession(@RequestBody Session session, @RequestHeader("Authorization") String token) {
        String username = tokenProvider.getUsernameFromToken(token.replace("Bearer ", ""));
        session.setUserId(username);
        return ResponseEntity.ok(sessionService.createSession(session));
    }
    
    @GetMapping
    public ResponseEntity<List<Session>> getAllSessions(@RequestHeader("Authorization") String token) {
        String username = tokenProvider.getUsernameFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(sessionService.getAllSessionsByUserId(username));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable String id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable String id) {
        sessionService.deleteSession(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Session> updateSession(@PathVariable String id, @RequestBody Session session) {
        return ResponseEntity.ok(sessionService.updateSession(id, session));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Session> updateSessionStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> statusUpdate) {
        
        String status = statusUpdate.get("status");
        return ResponseEntity.ok(sessionService.updateSessionStatus(id, status));
    }
    
    @PatchMapping("/{id}/progress")
    public ResponseEntity<Session> updateSessionProgress(
            @PathVariable String id,
            @RequestBody Map<String, Integer> progressUpdate) {
        
        Integer completionPercentage = progressUpdate.get("completionPercentage");
        Integer actualDurationMinutes = progressUpdate.get("actualDurationMinutes");
        String notes = progressUpdate.containsKey("notes") ? (String) progressUpdate.get("notes") : null;
        
        return ResponseEntity.ok(sessionService.updateSessionProgress(
                id, completionPercentage, actualDurationMinutes, notes));
    }
    
    @PatchMapping("/{id}/complete")
    public ResponseEntity<Session> completeSession(
            @PathVariable String id,
            @RequestBody Map<String, Object> completionData) {
        
        Integer actualDurationMinutes = (Integer) completionData.get("actualDurationMinutes");
        String notes = completionData.containsKey("notes") ? (String) completionData.get("notes") : null;
        
        return ResponseEntity.ok(sessionService.completeSession(id, actualDurationMinutes, notes));
    }
    
    @GetMapping("/by-topic/{topicId}")
    public ResponseEntity<List<Session>> getSessionsByTopic(
            @PathVariable String topicId,
            @RequestHeader("Authorization") String token) {
        
        String username = tokenProvider.getUsernameFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(sessionService.getSessionsByTopicId(topicId, username));
    }
    
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getSessionAnalytics(
            @RequestHeader("Authorization") String token) {
        
        String username = tokenProvider.getUsernameFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(sessionService.getSessionAnalytics(username));
    }
    
    @GetMapping("/analytics/by-topic")
    public ResponseEntity<Map<String, Map<String, Object>>> getSessionAnalyticsByTopic(
            @RequestHeader("Authorization") String token) {
        
        String username = tokenProvider.getUsernameFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(sessionService.getSessionAnalyticsByTopic(username));
    }
}