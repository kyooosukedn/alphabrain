package com.alphabrain.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alphabrain.config.GeminiConfig;
import com.alphabrain.dto.ai.ConnectionSuggestion;
import com.alphabrain.model.KnowledgeNode;
import com.alphabrain.repository.KnowledgeNodeRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GraphSuggestionService {

    private static final Logger log = LoggerFactory.getLogger(GraphSuggestionService.class);

    private final KnowledgeNodeRepository knowledgeNodeRepository;
    private final GeminiConfig geminiConfig;
    private final RestTemplate geminiRestTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Suggest connections for a specific node against all other user nodes.
     */
    public List<ConnectionSuggestion> suggestConnections(String nodeId, String userId) {
        Optional<KnowledgeNode> targetOpt = knowledgeNodeRepository.findById(nodeId);
        if (targetOpt.isEmpty()) {
            throw new IllegalArgumentException("Node not found: " + nodeId);
        }

        KnowledgeNode targetNode = targetOpt.get();
        List<KnowledgeNode> allNodes = knowledgeNodeRepository.findByUserId(userId);

        // Need at least 1 other node to suggest connections
        List<KnowledgeNode> otherNodes = allNodes.stream()
                .filter(n -> !n.getId().equals(nodeId))
                .toList();

        if (otherNodes.isEmpty()) {
            return List.of();
        }

        if (!geminiConfig.isConfigured()) {
            log.warn("Gemini API key not configured — returning empty suggestions");
            return List.of();
        }

        String prompt = buildPrompt(targetNode, otherNodes);
        String aiResponse = callGemini(prompt);
        return parseResponse(aiResponse, targetNode, otherNodes);
    }

    private String buildPrompt(KnowledgeNode target, List<KnowledgeNode> others) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an educational knowledge graph assistant. ");
        sb.append("Analyze the TARGET node and suggest which EXISTING nodes should be connected to it.\n\n");

        sb.append("TARGET NODE:\n");
        sb.append("  Title: ").append(target.getTitle()).append("\n");
        if (target.getDescription() != null) {
            sb.append("  Description: ").append(target.getDescription()).append("\n");
        }
        if (target.getCategory() != null) {
            sb.append("  Category: ").append(target.getCategory()).append("\n");
        }
        sb.append("  Difficulty: ").append(target.getDifficultyLevel()).append("/5\n\n");

        sb.append("EXISTING NODES:\n");
        for (int i = 0; i < others.size(); i++) {
            KnowledgeNode n = others.get(i);
            sb.append(i + 1).append(". \"").append(n.getTitle()).append("\"");
            if (n.getCategory() != null) {
                sb.append(" [").append(n.getCategory()).append("]");
            }
            if (n.getDescription() != null && n.getDescription().length() <= 80) {
                sb.append(" — ").append(n.getDescription());
            }
            sb.append(" (difficulty: ").append(n.getDifficultyLevel()).append("/5)");
            sb.append("\n");
        }

        sb.append("\nFor each suggested connection, specify:\n");
        sb.append("- \"existingNodeIndex\": the 1-based index from the EXISTING NODES list\n");
        sb.append("- \"relationshipType\": either \"prerequisite\" (existing node should be learned BEFORE target) ");
        sb.append("or \"leadsTo\" (target node leads TO the existing node)\n");
        sb.append("- \"reasoning\": a brief explanation (1 sentence)\n\n");

        sb.append("Only suggest connections that are educationally meaningful. ");
        sb.append("Do NOT suggest connections that already exist. ");
        sb.append("Return a JSON array. If no connections make sense, return [].\n\n");

        // List existing connections so AI doesn't duplicate them
        List<String> existingPrereqs = target.getPrerequisites();
        List<String> existingLeadsTo = target.getLeadsTo();
        if ((existingPrereqs != null && !existingPrereqs.isEmpty()) ||
            (existingLeadsTo != null && !existingLeadsTo.isEmpty())) {
            sb.append("ALREADY CONNECTED (do not suggest these again):\n");
            for (KnowledgeNode n : others) {
                if (existingPrereqs != null && existingPrereqs.contains(n.getId())) {
                    sb.append("  - \"").append(n.getTitle()).append("\" is already a prerequisite\n");
                }
                if (existingLeadsTo != null && existingLeadsTo.contains(n.getId())) {
                    sb.append("  - Target already leads to \"").append(n.getTitle()).append("\"\n");
                }
            }
            sb.append("\n");
        }

        sb.append("Respond ONLY with the JSON array, no markdown fences.");
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private String callGemini(String prompt) {
        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(textPart));
        Map<String, Object> generationConfig = Map.of(
                "responseMimeType", "application/json",
                "temperature", 0.3
        );

        Map<String, Object> body = Map.of(
                "contents", List.of(content),
                "generationConfig", generationConfig
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = geminiRestTemplate.postForEntity(
                    geminiConfig.getEndpoint(), request, Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) return "[]";

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates == null || candidates.isEmpty()) return "[]";

            Map<String, Object> firstCandidate = candidates.get(0);
            Map<String, Object> contentMap = (Map<String, Object>) firstCandidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");

            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            log.error("Gemini API call failed for graph suggestions", e);
            return "[]";
        }
    }

    private List<ConnectionSuggestion> parseResponse(String json, KnowledgeNode target, List<KnowledgeNode> others) {
        List<ConnectionSuggestion> suggestions = new ArrayList<>();

        try {
            List<Map<String, Object>> rawSuggestions = objectMapper.readValue(
                    json.trim(), new TypeReference<>() {});

            for (Map<String, Object> raw : rawSuggestions) {
                int index = ((Number) raw.get("existingNodeIndex")).intValue() - 1; // convert 1-based to 0-based
                String relType = (String) raw.get("relationshipType");
                String reasoning = (String) raw.get("reasoning");

                if (index < 0 || index >= others.size()) continue;
                if (relType == null) continue;

                KnowledgeNode existingNode = others.get(index);

                ConnectionSuggestion suggestion = ConnectionSuggestion.builder()
                        .sourceNodeId(relType.equals("prerequisite") ? existingNode.getId() : target.getId())
                        .sourceNodeTitle(relType.equals("prerequisite") ? existingNode.getTitle() : target.getTitle())
                        .targetNodeId(relType.equals("prerequisite") ? target.getId() : existingNode.getId())
                        .targetNodeTitle(relType.equals("prerequisite") ? target.getTitle() : existingNode.getTitle())
                        .relationshipType(relType)
                        .reasoning(reasoning)
                        .build();

                suggestions.add(suggestion);
            }
        } catch (Exception e) {
            log.error("Failed to parse Gemini graph suggestion response: {}", json, e);
        }

        return suggestions;
    }
}
