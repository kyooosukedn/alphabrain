package com.alphabrain.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alphabrain.config.GeminiConfig;
import com.alphabrain.dto.ai.AIRecommendationResponse;
import com.alphabrain.dto.ai.AIRecommendationResponse.LearningPath;
import com.alphabrain.dto.ai.AIRecommendationResponse.Milestone;
import com.alphabrain.dto.ai.AIRecommendationResponse.NextStep;
import com.alphabrain.dto.ai.AIRecommendationResponse.SuggestedRoadmap;
import com.alphabrain.model.KnowledgeNode;
import com.alphabrain.model.Session;
import com.alphabrain.model.Subject;
import com.alphabrain.model.UserStreak;
import com.alphabrain.repository.KnowledgeNodeRepository;
import com.alphabrain.repository.SessionRepository;
import com.alphabrain.repository.SubjectRepository;
import com.alphabrain.repository.UserStreakRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIRecommendationService {

    private final GeminiConfig geminiConfig;
    private final RestTemplate geminiRestTemplate;
    private final ObjectMapper objectMapper;
    private final SessionRepository sessionRepository;
    private final SubjectRepository subjectRepository;
    private final KnowledgeNodeRepository knowledgeNodeRepository;
    private final UserStreakRepository userStreakRepository;

    @Value("${gemini.cache.ttl-minutes:60}")
    private int cacheTtlMinutes;

    // Simple in-memory cache: userId -> cached response
    private final ConcurrentHashMap<String, CachedRecommendation> cache = new ConcurrentHashMap<>();

    public boolean isAvailable() {
        return geminiConfig.isConfigured();
    }

    public AIRecommendationResponse getRecommendations(String userId) {
        if (!geminiConfig.isConfigured()) {
            return AIRecommendationResponse.builder()
                    .aiEnabled(false)
                    .statusMessage("AI recommendations are disabled — no API key configured.")
                    .build();
        }

        // Check cache
        CachedRecommendation cached = cache.get(userId);
        if (cached != null && !cached.isExpired(cacheTtlMinutes)) {
            log.debug("Returning cached AI recommendations for user: {}", userId);
            return cached.response;
        }

        // Generate fresh recommendations
        try {
            AIRecommendationResponse response = generateRecommendations(userId);
            cache.put(userId, new CachedRecommendation(response));
            return response;
        } catch (Exception e) {
            log.error("Failed to generate AI recommendations for user: {}", userId, e);
            return AIRecommendationResponse.builder()
                    .aiEnabled(false)
                    .statusMessage("AI service temporarily unavailable: " + e.getMessage())
                    .build();
        }
    }

    public void invalidateCache(String userId) {
        cache.remove(userId);
    }

    private AIRecommendationResponse generateRecommendations(String userId) {
        String learnerProfile = buildLearnerProfile(userId);
        String prompt = buildPrompt(learnerProfile);
        String aiResponse = callGemini(prompt);
        return parseResponse(aiResponse);
    }

    // ─── Learner Profile ───

    private String buildLearnerProfile(String userId) {
        StringBuilder profile = new StringBuilder();

        // Subjects
        List<Subject> subjects = subjectRepository.findByUserId(userId);
        if (!subjects.isEmpty()) {
            profile.append("SUBJECTS STUDYING: ");
            profile.append(subjects.stream()
                    .map(s -> s.getName() + " (" + s.getCategory() + ")")
                    .collect(Collectors.joining(", ")));
            profile.append("\n");
        }

        // Recent sessions (last 20)
        List<Session> sessions = sessionRepository.findByUserId(userId);
        if (!sessions.isEmpty()) {
            List<Session> recent = sessions.subList(0, Math.min(20, sessions.size()));
            profile.append("RECENT STUDY SESSIONS:\n");
            for (Session s : recent) {
                profile.append("- ").append(s.getTitle());
                if (s.getCategory() != null) profile.append(" [").append(s.getCategory()).append("]");
                if (s.getStatus() != null) profile.append(" status=").append(s.getStatus());
                if (s.getCompletionPercentage() > 0) profile.append(" ").append(s.getCompletionPercentage()).append("% done");
                profile.append("\n");
            }
        }

        // Knowledge nodes — focus on incomplete / low mastery
        List<KnowledgeNode> nodes = knowledgeNodeRepository.findByUserId(userId);
        if (!nodes.isEmpty()) {
            List<KnowledgeNode> weak = nodes.stream()
                    .filter(n -> n.getMasteryLevel() < 50 && !n.isCompleted())
                    .limit(10)
                    .toList();
            List<KnowledgeNode> strong = nodes.stream()
                    .filter(n -> n.getMasteryLevel() >= 70)
                    .limit(5)
                    .toList();

            if (!weak.isEmpty()) {
                profile.append("WEAK AREAS (low mastery, needs work):\n");
                for (KnowledgeNode n : weak) {
                    profile.append("- ").append(n.getTitle())
                            .append(" [").append(n.getCategory()).append("]")
                            .append(" mastery=").append(n.getMasteryLevel()).append("%")
                            .append(" difficulty=").append(n.getDifficultyLevel())
                            .append("\n");
                }
            }
            if (!strong.isEmpty()) {
                profile.append("STRONG AREAS (high mastery):\n");
                for (KnowledgeNode n : strong) {
                    profile.append("- ").append(n.getTitle())
                            .append(" [").append(n.getCategory()).append("]")
                            .append(" mastery=").append(n.getMasteryLevel()).append("%")
                            .append("\n");
                }
            }
            profile.append("TOTAL NODES: ").append(nodes.size())
                    .append(", COMPLETED: ").append(nodes.stream().filter(KnowledgeNode::isCompleted).count())
                    .append("\n");
        }

        // Streak data
        userStreakRepository.findByUserId(userId).ifPresent(streak -> {
            profile.append("STUDY HABITS:\n");
            profile.append("- Current streak: ").append(streak.getCurrentStreak()).append(" days\n");
            profile.append("- Longest streak: ").append(streak.getLongestStreak()).append(" days\n");
            profile.append("- Total study time: ").append(streak.getTotalStudyTimeMinutes()).append(" minutes\n");
            profile.append("- Total learning days: ").append(streak.getTotalLearningDays()).append("\n");
            // Weekly study pattern
            List<Integer> weekly = streak.getWeeklyStudyMinutes();
            if (weekly != null && !weekly.isEmpty()) {
                int avgWeekly = (int) weekly.stream().mapToInt(Integer::intValue).average().orElse(0);
                profile.append("- Average weekly study: ").append(avgWeekly).append(" minutes\n");
            }
        });

        if (profile.isEmpty()) {
            profile.append("NEW USER — no study data yet. Suggest beginner-friendly paths.\n");
        }

        return profile.toString();
    }

    // ─── Prompt ───

    private String buildPrompt(String learnerProfile) {
        return """
                You are an AI learning assistant for AlphaBrain, a personal lifelong learning app.
                Based on the learner profile below, generate personalized recommendations.

                LEARNER PROFILE:
                %s

                Return a JSON object with this exact structure (no markdown, no code blocks, just raw JSON):
                {
                  "learningPaths": [
                    { "id": "1", "title": "...", "description": "2-3 sentences", "difficulty": 1-3, "estimatedHours": number }
                  ],
                  "roadmap": {
                    "title": "...",
                    "description": "2-3 sentences about the overall learning journey",
                    "category": "...",
                    "difficulty": "Beginner|Intermediate|Advanced",
                    "estimatedHours": number,
                    "completionPercentage": number based on their current progress,
                    "milestones": [
                      { "label": "...", "done": true/false based on what they've already learned }
                    ]
                  },
                  "nextSteps": [
                    { "id": "step1", "title": "...", "description": "1-2 sentences of actionable advice", "difficulty": 1-3, "estimatedMinutes": number }
                  ]
                }

                RULES:
                - Generate exactly 3 learning paths tailored to their subjects and weak areas
                - The roadmap should reflect their actual progress and suggest a realistic path forward
                - Generate exactly 3 next steps — specific, actionable tasks they can do TODAY
                - Difficulty: 1=Beginner, 2=Intermediate, 3=Advanced
                - If they're a new user, suggest beginner-friendly exploration paths
                - Focus on their weak areas for next steps
                - Be encouraging but practical
                """.formatted(learnerProfile);
    }

    // ─── Gemini API Call ───

    private String callGemini(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build Gemini API request body
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                ),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json",
                        "temperature", 0.7,
                        "maxOutputTokens", 2048
                )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        String response = geminiRestTemplate.postForObject(
                geminiConfig.getEndpoint(), request, String.class);

        // Extract text from Gemini response
        try {
            JsonNode root = objectMapper.readTree(response);
            return root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", response, e);
            throw new RuntimeException("Failed to parse Gemini API response", e);
        }
    }

    // ─── Response Parsing ───

    private AIRecommendationResponse parseResponse(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);

            // Parse learning paths
            List<LearningPath> paths = new ArrayList<>();
            for (JsonNode node : root.path("learningPaths")) {
                paths.add(LearningPath.builder()
                        .id(node.path("id").asText())
                        .title(node.path("title").asText())
                        .description(node.path("description").asText())
                        .difficulty(node.path("difficulty").asInt(1))
                        .estimatedHours(node.path("estimatedHours").asInt(10))
                        .build());
            }

            // Parse roadmap
            JsonNode roadmapNode = root.path("roadmap");
            List<Milestone> milestones = new ArrayList<>();
            for (JsonNode m : roadmapNode.path("milestones")) {
                milestones.add(Milestone.builder()
                        .label(m.path("label").asText())
                        .done(m.path("done").asBoolean())
                        .build());
            }
            SuggestedRoadmap roadmap = SuggestedRoadmap.builder()
                    .title(roadmapNode.path("title").asText())
                    .description(roadmapNode.path("description").asText())
                    .category(roadmapNode.path("category").asText())
                    .difficulty(roadmapNode.path("difficulty").asText())
                    .estimatedHours(roadmapNode.path("estimatedHours").asInt(100))
                    .completionPercentage(roadmapNode.path("completionPercentage").asInt(0))
                    .milestones(milestones)
                    .build();

            // Parse next steps
            List<NextStep> steps = new ArrayList<>();
            for (JsonNode node : root.path("nextSteps")) {
                steps.add(NextStep.builder()
                        .id(node.path("id").asText())
                        .title(node.path("title").asText())
                        .description(node.path("description").asText())
                        .difficulty(node.path("difficulty").asInt(1))
                        .estimatedMinutes(node.path("estimatedMinutes").asInt(30))
                        .build());
            }

            return AIRecommendationResponse.builder()
                    .aiEnabled(true)
                    .statusMessage("Recommendations generated successfully")
                    .learningPaths(paths)
                    .roadmap(roadmap)
                    .nextSteps(steps)
                    .generatedAt(Instant.now())
                    .build();

        } catch (Exception e) {
            log.error("Failed to parse AI response JSON: {}", json, e);
            throw new RuntimeException("Failed to parse AI recommendations", e);
        }
    }

    // ─── Cache Entry ───

    private static class CachedRecommendation {
        final AIRecommendationResponse response;
        final Instant createdAt;

        CachedRecommendation(AIRecommendationResponse response) {
            this.response = response;
            this.createdAt = Instant.now();
        }

        boolean isExpired(int ttlMinutes) {
            return Duration.between(createdAt, Instant.now()).toMinutes() >= ttlMinutes;
        }
    }
}
