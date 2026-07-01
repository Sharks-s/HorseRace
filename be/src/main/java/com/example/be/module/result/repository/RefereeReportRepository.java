package com.example.be.module.result.repository;

import com.example.be.module.result.model.entity.RefereeReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefereeReportRepository extends JpaRepository<RefereeReport, UUID> {
    Optional<RefereeReport> findByRaceId(UUID raceId);
    boolean existsByRaceId(UUID raceId);
}
