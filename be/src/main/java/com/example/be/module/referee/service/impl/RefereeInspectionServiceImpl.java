package com.example.be.module.referee.service.impl;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.referee.dto.request.HorseInspectionDecision;
import com.example.be.module.referee.dto.request.InspectHorseRequest;
import com.example.be.module.referee.dto.response.PreRaceHorseInspectionResponse;
import com.example.be.module.referee.service.RefereeInspectionService;
import com.example.be.module.registration.model.entity.Registration;
import com.example.be.module.registration.model.enums.RegistrationStatus;
import com.example.be.module.registration.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefereeInspectionServiceImpl implements RefereeInspectionService {

	private static final List<RegistrationStatus> INSPECTION_STATUSES = List.of(
			RegistrationStatus.ACCEPTED,
			RegistrationStatus.RACE_READY,
			RegistrationStatus.DISQUALIFIED);

	private final RegistrationRepository registrationRepository;
	private final UserRepository userRepository;

	@Value("${app.horse.min-weight:0}")
	private double minWeight;

	@Value("${app.horse.max-weight:650}")
	private double maxWeight;

	@Override
	@Transactional(readOnly = true)
	public List<PreRaceHorseInspectionResponse> getAssignedHorseInspections() {
		String refereeEmail = currentEmail();
		LocalDate today = LocalDate.now();
		return registrationRepository
				.findByRace_Referee_EmailAndStatusInOrderByRace_StartTimeAsc(refereeEmail, INSPECTION_STATUSES)
				.stream()
				.map(registration -> PreRaceHorseInspectionResponse.fromEntity(registration, minWeight, maxWeight, today))
				.toList();
	}

	@Override
	@Transactional
	public PreRaceHorseInspectionResponse inspectHorse(UUID registrationId, InspectHorseRequest request) {
		User referee = currentUser();
		Registration registration = registrationRepository.findById(registrationId)
				.orElseThrow(() -> new IllegalArgumentException("Race registration not found"));

		if (registration.getRace().getReferee() == null
				|| !registration.getRace().getReferee().getId().equals(referee.getId())) {
			throw new IllegalArgumentException("You are not assigned to this race");
		}

		if (!INSPECTION_STATUSES.contains(registration.getStatus())) {
			throw new IllegalArgumentException("Only accepted race registrations can be inspected");
		}

		boolean br01Passed = PreRaceHorseInspectionResponse
				.fromEntity(registration, minWeight, maxWeight, LocalDate.now())
				.isBr01Passed();

		if (request.getDecision() == HorseInspectionDecision.PASSED && !br01Passed) {
			throw new IllegalArgumentException("Horse does not satisfy BR-01 and cannot be marked PASSED");
		}

		registration.setStatus(request.getDecision() == HorseInspectionDecision.PASSED
				? RegistrationStatus.RACE_READY
				: RegistrationStatus.DISQUALIFIED);
		registration.setInspectionNote(buildInspectionNote(request.getNote(), br01Passed));
		registration.setInspectedAt(LocalDateTime.now());
		registration.setInspectedBy(referee);

		Registration saved = registrationRepository.save(registration);
		return PreRaceHorseInspectionResponse.fromEntity(saved, minWeight, maxWeight, LocalDate.now());
	}

	private String buildInspectionNote(String note, boolean br01Passed) {
		String normalizedNote = note == null ? "" : note.trim();
		String systemNote = "BR-01: health certificate "
				+ (br01Passed ? "valid" : "or weight invalid")
				+ "; weight range " + minWeight + "-" + maxWeight + " kg.";
		return normalizedNote.isBlank() ? systemNote : systemNote + " Referee note: " + normalizedNote;
	}

	private User currentUser() {
		return userRepository.findByEmail(currentEmail())
				.orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
	}

	private String currentEmail() {
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}
}
