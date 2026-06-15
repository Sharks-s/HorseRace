package com.example.be.module.registration.repository;

import com.example.be.module.registration.model.entity.RaceRegistration;
import com.example.be.module.registration.model.enums.RaceRegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface RaceRegistrationRepository extends JpaRepository<RaceRegistration, UUID> {

	List<RaceRegistration> findByJockey_IdAndStatusAndRace_StartTimeAfterOrderByRace_StartTimeAsc(
			UUID jockeyId,
			RaceRegistrationStatus status,
			LocalDateTime startTime);

	long countByJockey_IdAndStatusAndRace_StartTimeBetween(
			UUID jockeyId,
			RaceRegistrationStatus status,
			LocalDateTime start,
			LocalDateTime end);

	List<RaceRegistration> findByRace_Referee_EmailAndStatusInOrderByRace_StartTimeAsc(
			String refereeEmail,
			Collection<RaceRegistrationStatus> statuses);
}
