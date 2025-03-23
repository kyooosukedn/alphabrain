package com.alphabrain.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.lang.NonNull;

import com.alphabrain.model.Subject;

public interface SubjectRepository extends MongoRepository<Subject, String>{
    List<Subject> findByUserId(String userId);   
    @NonNull List<Subject> findAll();
    
}
