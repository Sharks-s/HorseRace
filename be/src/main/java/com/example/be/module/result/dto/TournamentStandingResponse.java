package com.example.be.module.result.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TournamentStandingResponse {
    private Integer rank;
    private UUID horseId;
    private String horseName;
    private Double totalPoints;
    private Double bestFinishTime; // Used for tie-breaking
}
