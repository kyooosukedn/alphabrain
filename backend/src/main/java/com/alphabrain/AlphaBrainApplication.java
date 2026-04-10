package com.alphabrain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.alphabrain")
@EnableMongoRepositories(basePackages = "com.alphabrain.repository")
@EnableJpaRepositories(basePackages = "com.alphabrain.repository.jpa")
@EntityScan(basePackages = "com.alphabrain.model")
@EnableMongoAuditing
public class AlphaBrainApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlphaBrainApplication.class, args);
    }
} 