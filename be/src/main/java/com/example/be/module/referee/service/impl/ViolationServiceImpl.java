package com.example.be.module.referee.service.impl;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.horse.model.entity.Horse;
import com.example.be.module.horse.repository.HorseRepository;
import com.example.be.module.referee.dto.request.ViolationRequest;
import com.example.be.module.referee.dto.response.ViolationResponse;
import com.example.be.module.referee.model.entity.Violation;
import com.example.be.module.referee.repository.ViolationRepository;
import com.example.be.module.referee.service.ViolationService;
import com.example.be.module.registration.repository.RaceRegistrationRepository;
import com.example.be.module.tournament.model.entity.Race;
import com.example.be.module.tournament.model.enums.RaceStatus;
import com.example.be.module.tournament.repository.RaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ViolationServiceImpl implements ViolationService {

	private final ViolationRepository violationRepository;
	private final RaceRepository raceRepository;
	private final HorseRepository horseRepository;
	private final UserRepository userRepository;
	private final RaceRegistrationRepository raceRegistrationRepository;

	@Override
	@Transactional(readOnly = true)
	public List<ViolationResponse> getViolations(UUID raceId) {
		String refereeEmail = currentEmail();
		if (raceId == null) {
			return violationRepository.findByRace_Referee_EmailOrderByOccurredAtDesc(refereeEmail)
					.stream()
					.map(ViolationResponse::fromEntity)
					.toList();
		}
		ensureAssignedRace(raceId, refereeEmail);
		return violationRepository.findByRace_IdAndRace_Referee_EmailOrderByOccurredAtDesc(raceId, refereeEmail)
				.stream()
				.map(ViolationResponse::fromEntity)
				.toList();
	}

	@Override
	@Transactional
	public ViolationResponse createViolation(ViolationRequest request) {
		User referee = currentUser();
		Race race = getAssignedRace(request.getRaceId(), referee.getEmail());
		ensureRaceEditable(race);
		Horse horse = getHorse(request.getHorseId());
		User jockey = getUser(request.getJockeyId());
		ensureRegisteredPair(race.getId(), horse.getId(), jockey.getId());

		Violation violation = Violation.builder()
				.race(race)
				.horse(horse)
				.jockey(jockey)
				.recordedBy(referee)
				.type(request.getType())
				.description(request.getDescription().trim())
				.severity(request.getSeverity())
				.occurredAt(resolveTimestamp(request.getTimestamp()))
				.build();

		return ViolationResponse.fromEntity(violationRepository.save(violation));
	}

	@Override
	@Transactional
	public ViolationResponse updateViolation(UUID id, ViolationRequest request) {
		User referee = currentUser();
		Violation violation = getOwnedViolation(id, referee.getEmail());
		ensureRaceEditable(violation.getRace());

		Race race = getAssignedRace(request.getRaceId(), referee.getEmail());
		ensureRaceEditable(race);
		Horse horse = getHorse(request.getHorseId());
		User jockey = getUser(request.getJockeyId());
		ensureRegisteredPair(race.getId(), horse.getId(), jockey.getId());

		violation.setRace(race);
		violation.setHorse(horse);
		violation.setJockey(jockey);
		violation.setType(request.getType());
		violation.setDescription(request.getDescription().trim());
		violation.setSeverity(request.getSeverity());
		violation.setOccurredAt(resolveTimestamp(request.getTimestamp()));

		return ViolationResponse.fromEntity(violationRepository.save(violation));
	}

	@Override
	@Transactional
	public void deleteViolation(UUID id) {
		Violation violation = getOwnedViolation(id, currentEmail());
		ensureRaceEditable(violation.getRace());
		violationRepository.delete(violation);
	}

	private Violation getOwnedViolation(UUID id, String refereeEmail) {
		Violation violation = violationRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Violation not found"));
		if (violation.getRace().getReferee() == null
				|| !violation.getRace().getReferee().getEmail().equals(refereeEmail)) {
			throw new IllegalArgumentException("You are not assigned to this violation's race");
		}
		return violation;
	}

	private Race getAssignedRace(UUID raceId, String refereeEmail) {
		Race race = raceRepository.findById(raceId)
				.orElseThrow(() -> new IllegalArgumentException("Race not found"));
		if (race.getReferee() == null || !race.getReferee().getEmail().equals(refereeEmail)) {
			throw new IllegalArgumentException("You are not assigned to this race");
		}
		return race;
	}

	private void ensureAssignedRace(UUID raceId, String refereeEmail) {
		getAssignedRace(raceId, refereeEmail);
	}

	private void ensureRaceEditable(Race race) {
		if (race.getStatus() == RaceStatus.RESULT_SUBMITTED || race.getStatus() == RaceStatus.FINISHED) {
			throw new IllegalArgumentException("Violations cannot be changed after report submission");
		}
		if (race.getStatus() == RaceStatus.CANCELLED) {
			throw new IllegalArgumentException("Violations cannot be changed for a cancelled race");
		}
	}

	private void ensureRegisteredPair(UUID raceId, UUID horseId, UUID jockeyId) {
		if (!raceRegistrationRepository.existsByRace_IdAndHorse_IdAndJockey_Id(raceId, horseId, jockeyId)) {
			throw new IllegalArgumentException("Horse and jockey are not registered together in this race");
		}
	}

	private Horse getHorse(UUID horseId) {
		return horseRepository.findById(horseId)
				.orElseThrow(() -> new IllegalArgumentException("Horse not found"));
	}

	private User getUser(UUID userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("Jockey not found"));
	}

	private LocalDateTime resolveTimestamp(LocalDateTime timestamp) {
		return timestamp == null ? LocalDateTime.now() : timestamp;
	}

	private User currentUser() {
		return userRepository.findByEmail(currentEmail())
				.orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
	}

	private String currentEmail() {
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}
}
