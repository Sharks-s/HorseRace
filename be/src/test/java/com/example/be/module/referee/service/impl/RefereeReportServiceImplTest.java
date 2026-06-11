package com.example.be.module.referee.service.impl;

import com.example.be.common.exception.ConflictException;
import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.notification.repository.NotificationRepository;
import com.example.be.module.referee.repository.RefereeReportRepository;
import com.example.be.module.referee.repository.ViolationRepository;
import com.example.be.module.registration.repository.RaceRegistrationRepository;
import com.example.be.module.result.repository.RaceResultRepository;
import com.example.be.module.result.strategy.DefaultRankingStrategy;
import com.example.be.module.tournament.model.entity.Race;
import com.example.be.module.tournament.model.entity.Tournament;
import com.example.be.module.tournament.model.enums.RaceStatus;
import com.example.be.module.tournament.repository.RaceRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RefereeReportServiceImplTest {

	@Mock
	private RefereeReportRepository refereeReportRepository;
	@Mock
	private RaceRepository raceRepository;
	@Mock
	private RaceRegistrationRepository raceRegistrationRepository;
	@Mock
	private RaceResultRepository raceResultRepository;
	@Mock
	private ViolationRepository violationRepository;
	@Mock
	private UserRepository userRepository;
	@Mock
	private NotificationRepository notificationRepository;

	@AfterEach
	void clearSecurityContext() {
		SecurityContextHolder.clearContext();
	}

	@Test
	void submitReportReturnsConflictWhenReportAlreadyExists() {
		UUID raceId = UUID.randomUUID();
		User referee = User.builder()
				.id(UUID.randomUUID())
				.email("referee@race.test")
				.fullName("Race Referee")
				.build();
		Race race = Race.builder()
				.id(raceId)
				.referee(referee)
				.tournament(Tournament.builder()
						.id(UUID.randomUUID())
						.name("Spring Cup")
						.startDate(LocalDate.now())
						.endDate(LocalDate.now().plusDays(1))
						.build())
				.name("Round 1")
				.startTime(LocalDateTime.now())
				.distanceFactor(1.2)
				.status(RaceStatus.IN_PROGRESS)
				.build();

		SecurityContextHolder.getContext().setAuthentication(
				new UsernamePasswordAuthenticationToken(referee.getEmail(), "password", List.of()));
		when(userRepository.findByEmail(referee.getEmail())).thenReturn(Optional.of(referee));
		when(raceRepository.findById(raceId)).thenReturn(Optional.of(race));
		when(refereeReportRepository.existsByRace_Id(raceId)).thenReturn(true);

		RefereeReportServiceImpl service = new RefereeReportServiceImpl(
				refereeReportRepository,
				raceRepository,
				raceRegistrationRepository,
				raceResultRepository,
				violationRepository,
				userRepository,
				notificationRepository,
				new DefaultRankingStrategy());

		assertThatThrownBy(() -> service.submitReport(raceId, List.of()))
				.isInstanceOf(ConflictException.class)
				.hasMessageContaining("already been submitted");
	}
}
