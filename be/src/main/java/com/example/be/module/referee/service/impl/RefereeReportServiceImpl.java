package com.example.be.module.referee.service.impl;

import com.example.be.common.exception.ConflictException;
import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.notification.model.entity.Notification;
import com.example.be.module.notification.repository.NotificationRepository;
import com.example.be.module.referee.dto.request.SubmitRaceResultRequest;
import com.example.be.module.referee.dto.response.RaceResultResponse;
import com.example.be.module.referee.dto.response.RefereeReportResponse;
import com.example.be.module.referee.dto.response.ViolationResponse;
import com.example.be.module.referee.model.entity.RefereeReport;
import com.example.be.module.referee.repository.RefereeReportRepository;
import com.example.be.module.referee.repository.ViolationRepository;
import com.example.be.module.referee.service.RefereeReportService;
import com.example.be.module.registration.model.entity.RaceRegistration;
import com.example.be.module.registration.model.enums.RaceRegistrationStatus;
import com.example.be.module.registration.repository.RaceRegistrationRepository;
import com.example.be.module.result.model.entity.RaceResult;
import com.example.be.module.result.repository.RaceResultRepository;
import com.example.be.module.result.strategy.RankingStrategy;
import com.example.be.module.tournament.model.entity.Race;
import com.example.be.module.tournament.model.enums.RaceStatus;
import com.example.be.module.tournament.repository.RaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RefereeReportServiceImpl implements RefereeReportService {

	private final RefereeReportRepository refereeReportRepository;
	private final RaceRepository raceRepository;
	private final RaceRegistrationRepository raceRegistrationRepository;
	private final RaceResultRepository raceResultRepository;
	private final ViolationRepository violationRepository;
	private final UserRepository userRepository;
	private final NotificationRepository notificationRepository;
	private final RankingStrategy rankingStrategy;

	@Override
	@Transactional(readOnly = true)
	public Optional<RefereeReportResponse> getReport(UUID raceId) {
		return refereeReportRepository.findByRace_IdAndRace_Referee_Email(raceId, currentEmail())
				.map(this::toResponse);
	}

	@Override
	@Transactional
	public RefereeReportResponse submitReport(UUID raceId, List<SubmitRaceResultRequest.HorseFinishTimeRequest> request) {
		User referee = currentUser();
		Race race = getAssignedRace(raceId, referee.getEmail());
		if (refereeReportRepository.existsByRace_Id(raceId)) {
			throw new ConflictException("Race report has already been submitted");
		}
		validateReport(race, request);

		Map<UUID, Double> finishTimes = request.stream()
				.collect(Collectors.toMap(
						SubmitRaceResultRequest.HorseFinishTimeRequest::getHorseId,
						SubmitRaceResultRequest.HorseFinishTimeRequest::getFinishTime,
						(first, second) -> second,
						HashMap::new));

		List<RaceRegistration> readyRegistrations = getReadyRegistrations(raceId);
		List<RaceResult> draftResults = readyRegistrations.stream()
				.map(registration -> RaceResult.builder()
						.race(race)
						.horse(registration.getHorse())
						.jockey(registration.getJockey())
						.finishTime(finishTimes.get(registration.getHorse().getId()))
						.violationFlag(violationRepository.existsByRace_IdAndHorse_Id(raceId, registration.getHorse().getId()))
						.build())
				.toList();

		rankingStrategy.calculate(draftResults, race.getDistanceFactor().floatValue())
				.forEach(ranking -> {
					RaceResult result = ranking.getRaceResult();
					result.setRank(ranking.getRank());
					result.setPlacement(ranking.getRank());
					result.setScore(ranking.getScore());
					result.setPoints(calculatePoints(ranking.getRank()));
				});

		RefereeReport report = refereeReportRepository.save(RefereeReport.builder()
				.race(race)
				.referee(referee)
				.confirmedResult(true)
				.build());

		raceResultRepository.saveAll(draftResults);
		race.setStatus(RaceStatus.RESULT_SUBMITTED);
		raceRepository.save(race);
		notifyAdmins(race, referee);

		return toResponse(report);
	}

	private void validateReport(Race race, List<SubmitRaceResultRequest.HorseFinishTimeRequest> request) {
		if (race.getStatus() == RaceStatus.RESULT_SUBMITTED || race.getStatus() == RaceStatus.FINISHED) {
			throw new ConflictException("Race report has already been submitted");
		}
		if (race.getStatus() == RaceStatus.CANCELLED) {
			throw new IllegalArgumentException("Cancelled races cannot be reported");
		}

		List<RaceRegistration> readyRegistrations = getReadyRegistrations(race.getId());
		if (readyRegistrations.isEmpty()) {
			throw new IllegalArgumentException("No RACE_READY horses found for this race");
		}
		if (readyRegistrations.stream().anyMatch(registration -> registration.getJockey() == null)) {
			throw new IllegalArgumentException("All RACE_READY horses must have assigned jockeys");
		}

		Map<UUID, Double> finishTimes = request.stream()
				.collect(Collectors.toMap(
						SubmitRaceResultRequest.HorseFinishTimeRequest::getHorseId,
						SubmitRaceResultRequest.HorseFinishTimeRequest::getFinishTime,
						(first, second) -> second));

		List<UUID> missingHorseIds = readyRegistrations.stream()
				.map(registration -> registration.getHorse().getId())
				.filter(horseId -> !finishTimes.containsKey(horseId))
				.toList();
		if (!missingHorseIds.isEmpty()) {
			throw new IllegalArgumentException("All RACE_READY horses must have finishTime");
		}
	}

	private List<RaceRegistration> getReadyRegistrations(UUID raceId) {
		return raceRegistrationRepository.findByRace_IdAndStatusOrderByHorse_NameAsc(
				raceId,
				RaceRegistrationStatus.RACE_READY);
	}

	private RefereeReportResponse toResponse(RefereeReport report) {
		List<RaceResultResponse> results = raceResultRepository.findByRace_IdOrderByRankAsc(report.getRace().getId())
				.stream()
				.map(RaceResultResponse::fromEntity)
				.toList();
		List<ViolationResponse> violations = violationRepository.findByRace_Id(report.getRace().getId())
				.stream()
				.map(ViolationResponse::fromEntity)
				.toList();
		return RefereeReportResponse.fromEntity(report, results, violations);
	}

	private Race getAssignedRace(UUID raceId, String refereeEmail) {
		Race race = raceRepository.findById(raceId)
				.orElseThrow(() -> new IllegalArgumentException("Race not found"));
		if (race.getReferee() == null || !race.getReferee().getEmail().equals(refereeEmail)) {
			throw new IllegalArgumentException("You are not assigned to this race");
		}
		return race;
	}

	private void notifyAdmins(Race race, User referee) {
		List<Notification> notifications = userRepository.findByRole(Role.ADMIN).stream()
				.map(admin -> Notification.builder()
						.user(admin)
						.title("Race report submitted")
						.message("Referee " + referee.getFullName() + " submitted results for " + race.getName())
						.read(false)
						.build())
				.toList();
		notificationRepository.saveAll(notifications);
	}

	private double calculatePoints(Integer place) {
		if (place == null || place <= 0) {
			return 0;
		}
		return Math.max(0, 11 - place);
	}

	private User currentUser() {
		return userRepository.findByEmail(currentEmail())
				.orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
	}

	private String currentEmail() {
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}
}
