package com.example.be.module.referee.service.impl;

import com.example.be.common.exception.ConflictException;
import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.notification.model.entity.Notification;
import com.example.be.module.notification.repository.NotificationRepository;
import com.example.be.module.referee.dto.request.SubmitRaceReportRequest;
import com.example.be.module.referee.dto.response.RaceReportResponse;
import com.example.be.module.referee.dto.response.RaceResultResponse;
import com.example.be.module.referee.dto.response.ViolationResponse;
import com.example.be.module.referee.model.entity.Violation;
import com.example.be.module.referee.repository.ViolationRepository;
import com.example.be.module.referee.service.RefereeRaceReportService;
import com.example.be.module.registration.model.entity.RaceRegistration;
import com.example.be.module.registration.model.enums.RaceRegistrationStatus;
import com.example.be.module.registration.repository.RaceRegistrationRepository;
import com.example.be.module.result.model.entity.RaceResult;
import com.example.be.module.result.model.entity.RefereeReport;
import com.example.be.module.result.repository.RaceResultRepository;
import com.example.be.module.result.repository.RefereeReportRepository;
import com.example.be.module.result.service.ResultService;
import com.example.be.module.tournament.model.entity.Race;
import com.example.be.module.tournament.model.enums.RaceStatus;
import com.example.be.module.tournament.repository.RaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RefereeRaceReportServiceImpl implements RefereeRaceReportService {

	private final RaceRepository raceRepository;
	private final RaceRegistrationRepository raceRegistrationRepository;
	private final RefereeReportRepository refereeReportRepository;
	private final RaceResultRepository raceResultRepository;
	private final ViolationRepository violationRepository;
	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;
	private final ResultService resultService;

	@Override
	@Transactional
	public RaceReportResponse submitReport(UUID raceId, List<SubmitRaceReportRequest> request) {
		Race race = raceRepository.findById(raceId)
				.orElseThrow(() -> new IllegalArgumentException("Race not found"));
		User referee = currentUser();
		validateAssignedReferee(race, referee);

		if (race.getStatus() == RaceStatus.RESULT_SUBMITTED || refereeReportRepository.existsByRace_Id(raceId)) {
			throw new ConflictException("Race report has already been submitted");
		}

		List<RaceRegistration> readyRegistrations = raceRegistrationRepository
				.findByRace_IdAndStatus(raceId, RaceRegistrationStatus.RACE_READY);
		validateReport(readyRegistrations, request);

		Map<UUID, Double> finishTimesByHorseId = finishTimesByHorseId(request);
		Set<UUID> violationHorseIds = violationRepository.findByRace_IdOrderByTimestampAsc(raceId).stream()
				.map(violation -> violation.getHorse().getId())
				.collect(Collectors.toSet());

		RefereeReport report = refereeReportRepository.save(RefereeReport.builder()
				.race(race)
				.referee(referee)
				.confirmedResult(true)
				.submittedAt(LocalDateTime.now())
				.build());

		List<RaceResult> savedResults = raceResultRepository.saveAll(
				resultService.updateRaceResult(race, readyRegistrations, finishTimesByHorseId, violationHorseIds));

		List<Violation> violations = violationRepository.findByRace_IdOrderByTimestampAsc(raceId);
		violations.forEach(violation -> violation.setReportSubmitted(true));
		violationRepository.saveAll(violations);

		race.setStatus(RaceStatus.RESULT_SUBMITTED);
		raceRepository.save(race);

		notifyAdmins(race, referee);

		return RaceReportResponse.fromEntity(
				report,
				savedResults.stream()
						.sorted(java.util.Comparator.comparing(RaceResult::getRank))
						.map(RaceResultResponse::fromEntity)
						.toList(),
				violations.stream()
						.map(ViolationResponse::fromEntity)
						.toList());
	}

	private void validateReport(List<RaceRegistration> readyRegistrations, List<SubmitRaceReportRequest> request) {
		if (readyRegistrations.isEmpty()) {
			throw new IllegalArgumentException("No RACE_READY horses found for this race");
		}
		if (request == null || request.isEmpty()) {
			throw new IllegalArgumentException("Report must include finishTime for all RACE_READY horses");
		}

		Set<UUID> readyHorseIds = readyRegistrations.stream()
				.map(registration -> registration.getHorse().getId())
				.collect(Collectors.toSet());
		Set<UUID> submittedHorseIds = request.stream()
				.map(SubmitRaceReportRequest::getHorseID)
				.collect(Collectors.toSet());

		if (submittedHorseIds.size() != request.size()) {
			throw new IllegalArgumentException("Duplicate horse result in report");
		}
		if (!readyHorseIds.equals(submittedHorseIds)) {
			throw new IllegalArgumentException("All RACE_READY horses must have finishTime");
		}
	}

	private Map<UUID, Double> finishTimesByHorseId(List<SubmitRaceReportRequest> request) {
		Map<UUID, Double> finishTimes = new HashMap<>();
		for (SubmitRaceReportRequest result : request) {
			finishTimes.put(result.getHorseID(), result.getFinishTime());
		}
		return finishTimes;
	}

	private void notifyAdmins(Race race, User referee) {
		List<User> admins = userRepository.findByRole(Role.ADMIN);
		for (User admin : admins) {
			notificationRepository.save(Notification.builder()
					.user(admin)
					.title("Race result submitted")
					.message("Referee " + referee.getFullName() + " submitted results for race " + race.getName())
					.read(false)
					.build());
		}
	}

	private void validateAssignedReferee(Race race, User referee) {
		if (race.getReferee() == null || !race.getReferee().getId().equals(referee.getId())) {
			throw new IllegalArgumentException("You are not assigned to this race");
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
