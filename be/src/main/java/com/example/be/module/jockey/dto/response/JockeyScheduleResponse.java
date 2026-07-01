package com.example.be.module.jockey.dto.response;

import com.example.be.module.registration.model.entity.Registration;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class JockeyScheduleResponse {

	private UUID registrationId;
	private UUID raceId;
	private String raceName;
	private LocalDateTime startTime;
	private String tournamentName;
	private UUID horseId;
	private String horseName;
	private String ownerUsername;

	public static JockeyScheduleResponse fromEntity(Registration registration) {
		return new JockeyScheduleResponse(
				registration.getId(),
				registration.getRace().getId(),
				registration.getRace().getName(),
				registration.getRace().getStartTime(),
				registration.getRace().getTournament().getName(),
				registration.getHorse().getId(),
				registration.getHorse().getName(),
				registration.getOwner().getUsername());
	}
}
