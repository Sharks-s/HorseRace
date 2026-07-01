package com.example.be.module.referee.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordViolationRequest {

    @NotNull(message = "Horse ID is required")
    private UUID horseId;

    @NotNull(message = "Jockey ID is required")
    private UUID jockeyId;

    @NotBlank(message = "Violation type is required")
    private String type;

    private String notes;

    @NotNull(message = "Occurrence minute is required")
    @Min(value = 0, message = "Occurrence minute must be positive")
    private Integer occurrenceMinute;
}
