package com.example.be.module.tournament.repository;

import com.example.be.module.tournament.model.entity.Registration;
import com.example.be.module.tournament.model.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, UUID> {
    List<Registration> findByJockeyId(UUID jockeyId);
    List<Registration> findByRaceId(UUID raceId);
    boolean existsByRaceIdAndHorseId(UUID raceId, UUID horseId);
    boolean existsByRaceIdAndJockeyId(UUID raceId, UUID jockeyId);
}
