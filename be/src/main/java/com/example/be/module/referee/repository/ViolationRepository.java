package com.example.be.module.referee.repository;

import com.example.be.module.referee.model.entity.Violation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ViolationRepository extends JpaRepository<Violation, UUID> {

	List<Violation> findByRace_Referee_EmailOrderByOccurredAtDesc(String refereeEmail);

	List<Violation> findByRace_IdAndRace_Referee_EmailOrderByOccurredAtDesc(UUID raceId, String refereeEmail);

	List<Violation> findByRace_Id(UUID raceId);

	boolean existsByRace_IdAndHorse_Id(UUID raceId, UUID horseId);
}
