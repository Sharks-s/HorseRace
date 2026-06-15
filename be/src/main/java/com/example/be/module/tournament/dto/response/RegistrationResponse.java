package com.example.be.module.tournament.dto.response;

import com.example.be.module.tournament.model.entity.Registration;
import com.example.be.module.tournament.model.enums.RegistrationStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class RegistrationResponse {
    private UUID id;
    private UUID raceId;
    private String raceName;
    private UUID horseId;
    private String horseName;
    private UUID jockeyId;
    private String jockeyName;
    private RegistrationStatus status;

    public static RegistrationResponse fromEntity(Registration reg) {
        return RegistrationResponse.builder()
                .id(reg.getId())
                .raceId(reg.getRace().getId())
                .raceName(reg.getRace().getName())
                .horseId(reg.getHorse().getId())
                .horseName(reg.getHorse().getName())
                .jockeyId(reg.getJockey().getId())
                .jockeyName(reg.getJockey().getFullName())
                .status(reg.getStatus())
                .build();
    }
}
