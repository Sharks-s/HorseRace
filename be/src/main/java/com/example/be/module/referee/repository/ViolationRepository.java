package com.example.be.module.referee.repository;

import com.example.be.module.referee.model.entity.Violation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ViolationRepository extends JpaRepository<Violation, UUID> {

	List<Violation> findByRace_IdOrderByTimestampAsc(UUID raceId);

	Optional<Violation> findByViolationIDAndRace_Id(UUID violationID, UUID raceId);
}
