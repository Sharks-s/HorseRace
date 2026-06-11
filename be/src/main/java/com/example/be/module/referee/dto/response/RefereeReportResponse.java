package com.example.be.module.referee.dto.response;

import com.example.be.module.referee.model.entity.RefereeReport;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class RefereeReportResponse {

	private UUID reportId;
	private UUID raceId;
	private String raceName;
	private UUID refereeId;
	private String refereeName;
	private Boolean confirmedResult;
	private LocalDateTime submittedAt;
	private List<RaceResultResponse> results;
	private List<ViolationResponse> violations;

	public static RefereeReportResponse fromEntity(
			RefereeReport report,
			List<RaceResultResponse> results,
			List<ViolationResponse> violations) {
		return RefereeReportResponse.builder()
				.reportId(report.getId())
				.raceId(report.getRace().getId())
				.raceName(report.getRace().getName())
				.refereeId(report.getReferee().getId())
				.refereeName(report.getReferee().getFullName())
				.confirmedResult(report.getConfirmedResult())
				.submittedAt(report.getSubmittedAt())
				.results(results)
				.violations(violations)
				.build();
	}
}
