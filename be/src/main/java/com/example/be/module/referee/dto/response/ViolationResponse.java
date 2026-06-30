package com.example.be.module.referee.dto.response;

import com.example.be.module.referee.model.entity.Violation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ViolationResponse {

    private UUID id;
    private UUID raceId;
    private UUID horseId;
    private String horseName;
    private UUID jockeyId;
    private String jockeyName;
    private String type;
    private String notes;
    private Integer occurrenceMinute;
    private LocalDateTime createdAt;

    public static ViolationResponse fromEntity(Violation violation) {
        return ViolationResponse.builder()
                .id(violation.getId())
                .raceId(violation.getRace().getId())
                .horseId(violation.getHorse().getId())
                .horseName(violation.getHorse().getName())
                .jockeyId(violation.getJockey().getId())
                .jockeyName(violation.getJockey().getFullName())
                .type(violation.getType())
                .notes(violation.getNotes())
                .occurrenceMinute(violation.getOccurrenceMinute())
                .createdAt(violation.getCreatedAt())
                .build();
    }
}
