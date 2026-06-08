package com.example.be.module.tournament.dto.response;

import com.example.be.module.tournament.model.entity.Tournament;
import com.example.be.module.tournament.model.enums.TournamentStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Builder
public class TournamentResponse {
    private UUID id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private TournamentStatus status;

    public static TournamentResponse fromEntity(Tournament t) {
        return TournamentResponse.builder()
                .id(t.getId())
                .name(t.getName())
                .startDate(t.getStartDate())
                .endDate(t.getEndDate())
                .description(t.getDescription())
                .status(t.getStatus())
                .build();
    }
}
