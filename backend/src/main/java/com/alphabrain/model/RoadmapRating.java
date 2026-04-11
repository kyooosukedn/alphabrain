package com.alphabrain.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "roadmap_ratings")
@CompoundIndex(name = "user_roadmap_idx", def = "{'userId': 1, 'roadmapId': 1}", unique = true)
public class RoadmapRating {

    @Id
    private String id;

    private String roadmapId;
    private String userId;
    private String username;

    // 1-5 star rating
    private int rating;

    // Optional text review
    private String review;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
