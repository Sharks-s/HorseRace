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

	private UUID id;
	private UUID raceId;
	private String raceName;
	private UUID horseId;
	private String horseName;
	private UUID jockeyId;
	private String jockeyName;
	private ViolationType type;
	private String description;
	private ViolationSeverity severity;
	private LocalDateTime timestamp;
	private UUID recordedById;
	private String recordedByName;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public static ViolationResponse fromEntity(Violation violation) {
		return ViolationResponse.builder()
				.id(violation.getId())
				.raceId(violation.getRace().getId())
				.raceName(violation.getRace().getName())
				.horseId(violation.getHorse().getId())
				.horseName(violation.getHorse().getName())
				.jockeyId(violation.getJockey().getId())
				.jockeyName(violation.getJockey().getFullName())
				.type(violation.getType())
				.description(violation.getDescription())
				.severity(violation.getSeverity())
				.timestamp(violation.getOccurredAt())
				.recordedById(violation.getRecordedBy().getId())
				.recordedByName(violation.getRecordedBy().getFullName())
				.createdAt(violation.getCreatedAt())
				.updatedAt(violation.getUpdatedAt())
				.build();
	}
}
