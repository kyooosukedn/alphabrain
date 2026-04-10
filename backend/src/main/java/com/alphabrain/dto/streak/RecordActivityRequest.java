package com.alphabrain.dto.streak;

import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordActivityRequest {
    
    @NotNull(message = "Study time minutes is required")
    @Min(value = 1, message = "Study time must be at least 1 minute")
    private Integer studyTimeMinutes;
    
    // Optional, if null current date will be used
    private LocalDate activityDate;
} 