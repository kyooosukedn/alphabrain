package com.alphabrain.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionSuggestion {
    private String sourceNodeId;
    private String sourceNodeTitle;
    private String targetNodeId;
    private String targetNodeTitle;
    private String relationshipType; // "prerequisite" or "leadsTo"
    private String reasoning;
}
