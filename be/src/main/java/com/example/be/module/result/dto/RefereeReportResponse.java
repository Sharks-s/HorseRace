package com.example.be.module.result.dto;

import com.example.be.module.result.model.enums.RefereeReportStatus;

import com.example.be.module.result.model.entity.RaceResult;
import com.example.be.module.result.model.entity.RefereeReport;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefereeReportResponse {

    private UUID reportId;
    private UUID raceId;
    private String refereeName;
    private String notes;
    private RefereeReportStatus status;
    private LocalDateTime submittedAt;
    private List<RaceResultDetail> results;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RaceResultDetail {
        private UUID id;
        private UUID horseId;
        private String horseName;
        private UUID jockeyId;
        private String jockeyName;
        private Integer placement;
        private Double points;
        private Double finishTime;
        private Boolean violation;
        
        public static RaceResultDetail fromEntity(RaceResult result) {
            return RaceResultDetail.builder()
                    .id(result.getId())
                    .horseId(result.getHorse().getId())
                    .horseName(result.getHorse().getName())
                    .jockeyId(result.getJockey().getId())
                    .jockeyName(result.getJockey().getFullName())
                    .placement(result.getPlacement())
                    .points(result.getPoints())
                    .finishTime(result.getFinishTime())
                    .violation(result.getViolation())
                    .build();
        }
    }

    public static RefereeReportResponse fromEntities(RefereeReport report, List<RaceResult> results) {
        return RefereeReportResponse.builder()
                .reportId(report.getId())
                .raceId(report.getRace().getId())
                .refereeName(report.getReferee().getFullName())
                .notes(report.getNotes())
                .status(report.getStatus())
                .submittedAt(report.getSubmittedAt())
                .results(results.stream().map(RaceResultDetail::fromEntity).toList())
                .build();
    }
}
