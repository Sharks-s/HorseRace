package com.example.be.module.result.repository;

import com.example.be.module.result.model.entity.RefereeReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefereeReportRepository extends JpaRepository<RefereeReport, UUID> {

	boolean existsByRace_Id(UUID raceId);

	Optional<RefereeReport> findByRace_Id(UUID raceId);
}
