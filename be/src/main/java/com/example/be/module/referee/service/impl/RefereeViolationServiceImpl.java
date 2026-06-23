package com.example.be.module.referee.service.impl;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.horse.model.entity.Horse;
import com.example.be.module.horse.repository.HorseRepository;
import com.example.be.module.referee.dto.request.CreateViolationRequest;
import com.example.be.module.referee.dto.response.ViolationResponse;
import com.example.be.module.referee.model.entity.Violation;
import com.example.be.module.referee.repository.ViolationRepository;
import com.example.be.module.referee.service.RefereeViolationService;
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
public class RefereeViolationServiceImpl implements RefereeViolationService {

	private final ViolationRepository violationRepository;
	private final RaceRepository raceRepository;
	private final RaceRegistrationRepository raceRegistrationRepository;
	private final HorseRepository horseRepository;
	private final UserRepository userRepository;

	@Override
	@Transactional(readOnly = true)
	public List<ViolationResponse> getViolations(UUID raceId) {
		Race race = raceRepository.findById(raceId)
				.orElseThrow(() -> new IllegalArgumentException("Race not found"));
		User referee = currentUser();
		validateAssignedReferee(race, referee);

		return violationRepository.findByRace_IdOrderByTimestampAsc(raceId).stream()
				.map(ViolationResponse::fromEntity)
				.toList();
	}

	@Override
	@Transactional
	public ViolationResponse createViolation(UUID raceId, CreateViolationRequest request) {
		Race race = raceRepository.findById(raceId)
				.orElseThrow(() -> new IllegalArgumentException("Race not found"));
		User referee = currentUser();
		validateAssignedReferee(race, referee);
		validateReportNotSubmitted(race);

		Horse horse = horseRepository.findById(request.getHorseID())
				.orElseThrow(() -> new IllegalArgumentException("Horse not found"));
		User jockey = userRepository.findById(request.getJockeyID())
				.orElseThrow(() -> new IllegalArgumentException("Jockey not found"));
		if (jockey.getRole() != Role.JOCKEY) {
			throw new IllegalArgumentException("Assigned user must have JOCKEY role");
		}

		boolean registeredPair = raceRegistrationRepository.existsByRace_IdAndHorse_IdAndJockey_Id(
				raceId,
				horse.getId(),
				jockey.getId());
		if (!registeredPair) {
			throw new IllegalArgumentException("Horse and jockey are not registered for this race");
		}

		Violation violation = Violation.builder()
				.race(race)
				.horse(horse)
				.jockey(jockey)
				.referee(referee)
				.type(request.getType())
				.description(request.getDescription().trim())
				.severity(request.getSeverity())
				.timestamp(request.getTimestamp() == null ? LocalDateTime.now() : request.getTimestamp())
				.reportSubmitted(false)
				.build();

		return ViolationResponse.fromEntity(violationRepository.save(violation));
	}

	@Override
	@Transactional
	public void deleteViolation(UUID raceId, UUID violationId) {
		Violation violation = violationRepository.findByViolationIDAndRace_Id(violationId, raceId)
				.orElseThrow(() -> new IllegalArgumentException("Violation not found"));
		User referee = currentUser();
		validateAssignedReferee(violation.getRace(), referee);
		validateReportNotSubmitted(violation.getRace());

		if (violation.isReportSubmitted()) {
			throw new IllegalArgumentException("Cannot delete violation after report submission");
		}

		violationRepository.delete(violation);
	}

	private void validateAssignedReferee(Race race, User referee) {
		if (race.getReferee() == null || !race.getReferee().getId().equals(referee.getId())) {
			throw new IllegalArgumentException("You are not assigned to this race");
		}
	}

	private void validateReportNotSubmitted(Race race) {
		if (race.getStatus() == RaceStatus.RESULT_SUBMITTED) {
			throw new IllegalArgumentException("Cannot modify violations after report submission");
		}
	}

	private User currentUser() {
		return userRepository.findByEmail(currentEmail())
				.orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
	}

	private String currentEmail() {
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}
}
