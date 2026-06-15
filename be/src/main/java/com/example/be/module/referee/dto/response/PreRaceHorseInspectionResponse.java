package com.example.be.module.referee.dto.response;

import com.example.be.module.registration.model.entity.RaceRegistration;
import com.example.be.module.registration.model.enums.RaceRegistrationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class PreRaceHorseInspectionResponse {

	private UUID registrationId;
	private RaceRegistrationStatus status;
	private UUID raceId;
	private String raceName;
	private LocalDateTime raceStartTime;
	private UUID tournamentId;
	private String tournamentName;
	private UUID horseId;
	private String horseName;
	private String breed;
	private Integer age;
	private Double weight;
	private LocalDate healthCertExpiry;
	private boolean healthCertValid;
	private boolean weightValid;
	private boolean br01Passed;
	private Double minWeight;
	private Double maxWeight;
	private UUID ownerId;
	private String ownerUsername;
	private UUID jockeyId;
	private String jockeyName;
	private String inspectionNote;
	private LocalDateTime inspectedAt;
	private UUID inspectedById;

	public static PreRaceHorseInspectionResponse fromEntity(
			RaceRegistration registration,
			double minWeight,
			double maxWeight,
			LocalDate today) {
		var horse = registration.getHorse();
		var race = registration.getRace();
		boolean healthCertValid = horse.getHealthCertExpiry() != null && !horse.getHealthCertExpiry().isBefore(today);
		boolean weightValid = horse.getWeight() != null && horse.getWeight() >= minWeight && horse.getWeight() <= maxWeight;

		return PreRaceHorseInspectionResponse.builder()
				.registrationId(registration.getId())
				.status(registration.getStatus())
				.raceId(race.getId())
				.raceName(race.getName())
				.raceStartTime(race.getStartTime())
				.tournamentId(race.getTournament().getId())
				.tournamentName(race.getTournament().getName())
				.horseId(horse.getId())
				.horseName(horse.getName())
				.breed(horse.getBreed())
				.age(horse.getAge())
				.weight(horse.getWeight())
				.healthCertExpiry(horse.getHealthCertExpiry())
				.healthCertValid(healthCertValid)
				.weightValid(weightValid)
				.br01Passed(healthCertValid && weightValid)
				.minWeight(minWeight)
				.maxWeight(maxWeight)
				.ownerId(registration.getOwner().getId())
				.ownerUsername(registration.getOwner().getUsername())
				.jockeyId(registration.getJockey() == null ? null : registration.getJockey().getId())
				.jockeyName(registration.getJockey() == null ? null : registration.getJockey().getFullName())
				.inspectionNote(registration.getInspectionNote())
				.inspectedAt(registration.getInspectedAt())
				.inspectedById(registration.getInspectedBy() == null ? null : registration.getInspectedBy().getId())
				.build();
	}
}
