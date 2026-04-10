package com.alphabrain.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Value("${cors.allowed-methods}")
    private String allowedMethods;

    @Value("${cors.allowed-headers}")
    private String allowedHeaders;

    @Value("${cors.allow-credentials}")
    private boolean allowCredentials;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(allowCredentials);
        
        // Set allowed origins from properties
        String[] origins = allowedOrigins.split(",");
        Arrays.stream(origins).forEach(corsConfiguration::addAllowedOrigin);
        
        // Set allowed methods from properties
        String[] methods = allowedMethods.split(",");
        Arrays.stream(methods).forEach(corsConfiguration::addAllowedMethod);
        
        // Set allowed headers from properties
        String[] headers = allowedHeaders.split(",");
        Arrays.stream(headers).forEach(corsConfiguration::addAllowedHeader);
        
        // Allow all exposed headers for better CORS handling
        corsConfiguration.addExposedHeader("Authorization");
        corsConfiguration.addExposedHeader("Content-Type");
        corsConfiguration.addExposedHeader("Accept");
        
        // Set max age
        corsConfiguration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        
        return new CorsFilter(source);
    }
} 