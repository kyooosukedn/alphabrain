package com.alphabrain.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "subjects")
public class Subject {
    @Id
    private String id;
    
    private String name;
    private String description;
    private String category;
    
    private String userId; // Owner of the subject
    
    @CreatedDate
    private Instant createdAt;
    
    @LastModifiedDate
    private Instant updatedAt;
    
    // Constructors
    public Subject() {}
    
    public Subject(String name, String description, String category, String userId) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.userId = userId;
    }
}