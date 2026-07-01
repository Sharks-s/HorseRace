package com.example.be.module.registration.repository;

import com.example.be.module.registration.model.entity.Registration;
import com.example.be.module.registration.model.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository("registrationRepository")
public interface RegistrationRepository extends JpaRepository<Registration, UUID> {

	List<Registration> findByJockeyId(UUID jockeyId);

	List<Registration> findByRaceId(UUID raceId);

	boolean existsByRaceIdAndHorseId(UUID raceId, UUID horseId);

	boolean existsByRaceIdAndJockeyId(UUID raceId, UUID jockeyId);

	long countByRaceIdAndStatus(UUID raceId, RegistrationStatus status);

	java.util.Optional<Registration> findByRaceIdAndHorseIdAndJockeyId(UUID raceId, UUID horseId, UUID jockeyId);

	List<Registration> findByJockey_IdAndStatusAndRace_StartTimeAfterOrderByRace_StartTimeAsc(
			UUID jockeyId,
			RegistrationStatus status,
			LocalDateTime startTime);

	long countByJockey_IdAndStatusAndRace_StartTimeBetween(
			UUID jockeyId,
			RegistrationStatus status,
			LocalDateTime start,
			LocalDateTime end);

	List<Registration> findByRace_Referee_EmailAndStatusInOrderByRace_StartTimeAsc(
			String refereeEmail,
			Collection<RegistrationStatus> statuses);
}
