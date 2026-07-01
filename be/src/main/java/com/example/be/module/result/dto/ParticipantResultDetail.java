package com.example.be.module.result.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantResultDetail {

    @NotNull(message = "Horse ID is required")
    private UUID horseId;

    @NotNull(message = "Jockey ID is required")
    private UUID jockeyId;

    @NotNull(message = "Finish time is required")
    @Positive(message = "Finish time must be positive")
    private Double finishTime;

    private Boolean violation;
}
