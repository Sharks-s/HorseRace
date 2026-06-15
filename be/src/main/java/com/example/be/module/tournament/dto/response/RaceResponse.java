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

    private UUID refereeId;
    private String refereeName;

    public static RaceResponse fromEntity(Race r) {
        return RaceResponse.builder()
                .id(r.getId())
                .tournamentId(r.getTournament().getId())
                .name(r.getName())
                .startTime(r.getStartTime())
                .distanceFactor(r.getDistanceFactor())
                .status(r.getStatus())
                .refereeId(r.getReferee() != null ? r.getReferee().getId() : null)
                .refereeName(r.getReferee() != null ? r.getReferee().getFullName() : null)
                .build();
    }
}
