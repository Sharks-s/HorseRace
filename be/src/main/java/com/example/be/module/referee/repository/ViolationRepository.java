package com.example.be.module.referee.repository;

import com.example.be.module.referee.model.entity.Violation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ViolationRepository extends JpaRepository<Violation, UUID> {
    List<Violation> findByRaceId(UUID raceId);
}
