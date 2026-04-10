package com.alphabrain.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class PublicController {

    @GetMapping("/demo")
    public String demo() {
        return "Hello from public demo endpoint!";
    }

    @GetMapping("/direct-test")
    public String directTest() {
        return "Hello from direct test endpoint!";
    }

    @GetMapping("/test/hello")
    public String testHello() {
        return "Hello from test hello endpoint!";
    }

    @GetMapping("/test/ping")
    public ResponseEntity<Map<String, String>> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Server is running!");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
} 