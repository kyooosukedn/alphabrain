package com.alphabrain.controller;

import com.alphabrain.model.Subject;
import com.alphabrain.security.JwtTokenProvider;
import com.alphabrain.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {
    private final SubjectService subjectService;
    private final JwtTokenProvider tokenProvider;
    
    @PostMapping
    public ResponseEntity<Subject> createSubject(@RequestBody Subject subject, @RequestHeader("Authorization") String token) {
        String username = tokenProvider.getUsernameFromToken(token.replace("Bearer ", ""));
        subject.setUserId(username);
        return ResponseEntity.ok(subjectService.createSubject(subject));
    }
    
    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects(@RequestHeader("Authorization") String token) {
        String username = tokenProvider.getUsernameFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(subjectService.getAllSubjectsByUserId(username));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable String id) {
        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable String id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok().build();
    }
}