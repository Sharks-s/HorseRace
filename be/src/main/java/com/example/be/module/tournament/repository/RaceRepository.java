package com.example.be.module.tournament.repository;

import com.example.be.module.tournament.model.entity.Race;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RaceRepository extends JpaRepository<Race, UUID> {
    List<Race> findByTournamentId(UUID tournamentId);
}
