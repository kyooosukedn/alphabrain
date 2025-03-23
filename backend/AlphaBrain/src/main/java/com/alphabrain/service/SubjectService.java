package com.alphabrain.service;

import com.alphabrain.model.Subject;
import com.alphabrain.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {
    private final SubjectRepository subjectRepository;
    
    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }
    
    public List<Subject> getAllSubjectsByUserId(String userId) {
        return subjectRepository.findByUserId(userId);
    }
    
    public Subject getSubjectById(String id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
    }
    
    public void deleteSubject(String id) {
        subjectRepository.deleteById(id);
    }
}