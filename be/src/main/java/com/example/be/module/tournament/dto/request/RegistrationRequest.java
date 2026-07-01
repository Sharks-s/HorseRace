package com.example.be.module.tournament.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class RegistrationRequest {
    @NotNull(message = "Horse ID is required")
    private UUID horseId;
    
    @NotNull(message = "Jockey ID is required")
    private UUID jockeyId;
}
