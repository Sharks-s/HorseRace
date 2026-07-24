package com.example.be.module.jockey.service.impl;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.jockey.dto.request.JockeyProfileRequest;
import com.example.be.module.jockey.dto.response.DailyRaceLimitResponse;
import com.example.be.module.jockey.dto.response.JockeyProfileResponse;
import com.example.be.module.jockey.dto.response.JockeyRankingResponse;
import com.example.be.module.jockey.dto.response.JockeyScheduleResponse;
import com.example.be.module.jockey.model.entity.JockeyProfile;
import com.example.be.module.jockey.repository.JockeyProfileRepository;
import com.example.be.module.jockey.service.JockeyService;
import com.example.be.module.registration.model.enums.RegistrationStatus;
import com.example.be.module.registration.repository.RegistrationRepository;
import com.example.be.module.result.repository.RaceResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class JockeyServiceImpl implements JockeyService {

	private static final int DAILY_RACE_LIMIT = 3;

	private final UserRepository userRepository;
	private final JockeyProfileRepository jockeyProfileRepository;
	private final RegistrationRepository registrationRepository;
	private final RaceResultRepository raceResultRepository;

	@Override
	@Transactional(readOnly = true)
	public JockeyProfileResponse getMyProfile() {
		User jockey = getCurrentJockey();
		return jockeyProfileRepository.findByUser_Id(jockey.getId())
				.map(JockeyProfileResponse::fromEntity)
				.orElse(null);
	}

	@Override
	public JockeyProfileResponse updateMyProfile(JockeyProfileRequest request) {
		User jockey = getCurrentJockey();
		if (jockeyProfileRepository.existsByLicenseNoAndUser_IdNot(request.getLicenseNo(), jockey.getId())) {
			throw new IllegalArgumentException("License number already exists");
		}
		JockeyProfile profile = jockeyProfileRepository.findByUser_Id(jockey.getId())
				.orElseGet(() -> JockeyProfile.builder().user(jockey).build());
		profile.setLicenseNo(request.getLicenseNo());
		profile.setName(request.getName());
		profile.setWeight(request.getWeight());
		profile.setBio(request.getBio());
		return JockeyProfileResponse.fromEntity(jockeyProfileRepository.save(profile));
	}

	@Override
	@Transactional(readOnly = true)
	public JockeyRankingResponse getMyRanking() {
		User jockey = getCurrentJockey();
		long totalRaces = raceResultRepository.countByJockey_Id(jockey.getId());
		long wins = raceResultRepository.countByJockey_IdAndPlacement(jockey.getId(), 1);
		double points = raceResultRepository.sumPointsByJockeyId(jockey.getId());
		double averagePlacement = raceResultRepository.averagePlacementByJockeyId(jockey.getId());
		return new JockeyRankingResponse(totalRaces, wins, points, averagePlacement);
	}

	@Override
	@Transactional(readOnly = true)
	public List<JockeyScheduleResponse> getMyUpcomingSchedule() {
		User jockey = getCurrentJockey();
		return registrationRepository
				.findByJockey_IdAndStatusAndRace_StartTimeAfterOrderByRace_StartTimeAsc(
						jockey.getId(),
						RegistrationStatus.APPROVED,
						LocalDateTime.now())
				.stream()
				.map(JockeyScheduleResponse::fromEntity)
				.toList();
	}

	@Override
	@Transactional(readOnly = true)
	public DailyRaceLimitResponse checkDailyRaceLimit(LocalDate date) {
		User jockey = getCurrentJockey();
		LocalDate targetDate = date == null ? LocalDate.now() : date;
		long acceptedRaceCount = registrationRepository.countByJockey_IdAndStatusAndRace_StartTimeBetween(
				jockey.getId(),
				RegistrationStatus.APPROVED,
				targetDate.atStartOfDay(),
				targetDate.plusDays(1).atStartOfDay());
		return new DailyRaceLimitResponse(targetDate, acceptedRaceCount, DAILY_RACE_LIMIT, acceptedRaceCount <= DAILY_RACE_LIMIT);
	}

	private User getCurrentJockey() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("Current user not found"));
		if (user.getRole() != Role.JOCKEY) {
			throw new IllegalArgumentException("Current user is not a jockey");
		}
		return user;
	}
}
