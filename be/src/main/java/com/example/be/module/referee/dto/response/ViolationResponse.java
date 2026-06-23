package com.example.be.module.referee.dto.response;

import com.example.be.module.referee.model.entity.Violation;
import com.example.be.module.referee.model.enums.ViolationSeverity;
import com.example.be.module.referee.model.enums.ViolationType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class ViolationResponse {

	private UUID violationID;
	private UUID raceID;
	private UUID horseID;
	private UUID jockeyID;
	private ViolationType type;
	private String description;
	private ViolationSeverity severity;
	private LocalDateTime timestamp;
	private UUID refereeID;

	public static ViolationResponse fromEntity(Violation violation) {
		return ViolationResponse.builder()
				.violationID(violation.getViolationID())
				.raceID(violation.getRace().getId())
				.horseID(violation.getHorse().getId())
				.jockeyID(violation.getJockey().getId())
				.type(violation.getType())
				.description(violation.getDescription())
				.severity(violation.getSeverity())
				.timestamp(violation.getTimestamp())
				.refereeID(violation.getReferee().getId())
				.build();
	}
}
