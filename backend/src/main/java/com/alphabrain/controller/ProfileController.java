package com.alphabrain.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alphabrain.model.Roadmap;
import com.alphabrain.model.User;
import com.alphabrain.repository.UserRepository;
import com.alphabrain.service.RoadmapService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final RoadmapService roadmapService;

    /**
     * Get my profile
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .map(user -> ResponseEntity.ok(toProfileMap(user, true)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update my profile
     */
    @PutMapping("/me")
    public ResponseEntity<Map<String, Object>> updateMyProfile(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        return userRepository.findByUsername(userDetails.getUsername())
                .map(user -> {
                    if (body.containsKey("displayName")) {
                        user.setDisplayName((String) body.get("displayName"));
                    }
                    if (body.containsKey("bio")) {
                        user.setBio((String) body.get("bio"));
                    }
                    if (body.containsKey("avatarUrl")) {
                        user.setAvatarUrl((String) body.get("avatarUrl"));
                    }
                    if (body.containsKey("publicProfile")) {
                        user.setPublicProfile((Boolean) body.get("publicProfile"));
                    }
                    userRepository.save(user);
                    return ResponseEntity.ok(toProfileMap(user, true));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get a public user profile by username
     */
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(user -> {
                    if (!user.isPublicProfile()) {
                        return ResponseEntity.ok(Map.of(
                                "username", user.getUsername(),
                                "publicProfile", false
                        ));
                    }
                    return ResponseEntity.ok(toProfileMap(user, false));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get a user's public roadmaps
     */
    @GetMapping("/user/{username}/roadmaps")
    public ResponseEntity<List<Roadmap>> getUserPublicRoadmaps(@PathVariable String username) {
        List<Roadmap> roadmaps = roadmapService.getUserRoadmaps(username).stream()
                .filter(Roadmap::isPublic)
                .toList();
        return ResponseEntity.ok(roadmaps);
    }

    private Map<String, Object> toProfileMap(User user, boolean includePrivate) {
        var map = new java.util.LinkedHashMap<String, Object>();
        map.put("username", user.getUsername());
        map.put("displayName", user.getDisplayName());
        map.put("bio", user.getBio());
        map.put("avatarUrl", user.getAvatarUrl());
        map.put("publicProfile", user.isPublicProfile());
        map.put("createdAt", user.getCreatedAt());

        if (includePrivate) {
            map.put("email", user.getEmail());
        }

        // Public roadmap count
        long publicRoadmapCount = roadmapService.getUserRoadmaps(user.getUsername()).stream()
                .filter(Roadmap::isPublic)
                .count();
        map.put("publicRoadmapCount", publicRoadmapCount);

        return map;
    }
}
