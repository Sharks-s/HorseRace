package com.example.be.module.referee.dto.response;

import com.example.be.module.result.model.entity.RefereeReport;
import com.example.be.module.tournament.model.enums.RaceStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class RaceReportResponse {

	private UUID reportID;
	private UUID raceID;
	private String raceName;
	private RaceStatus raceStatus;
	private UUID refereeID;
	private boolean confirmedResult;
	private LocalDateTime submittedAt;
	private List<RaceResultResponse> results;
	private List<ViolationResponse> violations;

	public static RaceReportResponse fromEntity(
			RefereeReport report,
			List<RaceResultResponse> results,
			List<ViolationResponse> violations) {
		return RaceReportResponse.builder()
				.reportID(report.getReportID())
				.raceID(report.getRace().getId())
				.raceName(report.getRace().getName())
				.raceStatus(report.getRace().getStatus())
				.refereeID(report.getReferee().getId())
				.confirmedResult(report.isConfirmedResult())
				.submittedAt(report.getSubmittedAt())
				.results(results)
				.violations(violations)
				.build();
	}
}
