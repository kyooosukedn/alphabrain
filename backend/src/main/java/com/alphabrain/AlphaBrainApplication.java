package com.alphabrain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.alphabrain.repository")
@EnableMongoAuditing
public class AlphaBrainApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlphaBrainApplication.class, args);
    }
}
