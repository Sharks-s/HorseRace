package com.example.be.module.tournament.dto.response;

import com.example.be.module.tournament.model.entity.Race;
import com.example.be.module.tournament.model.enums.RaceStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class RaceResponse {
    private UUID id;
    private UUID tournamentId;
    private String name;
    private LocalDateTime startTime;
    private Double distanceFactor;
    private RaceStatus status;

    public static RaceResponse fromEntity(Race r) {
        return RaceResponse.builder()
                .id(r.getId())
                .tournamentId(r.getTournament().getId())
                .name(r.getName())
                .startTime(r.getStartTime())
                .distanceFactor(r.getDistanceFactor())
                .status(r.getStatus())
                .build();
    }
}
