package com.example.be.module.result.repository;

import com.example.be.module.result.model.entity.RaceResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface RaceResultRepository extends JpaRepository<RaceResult, UUID> {

	List<RaceResult> findByRace_IdOrderByRankAsc(UUID raceId);

	long countByJockey_Id(UUID jockeyId);

	long countByJockey_IdAndRank(UUID jockeyId, Integer rank);

	@Query("select coalesce(sum(r.points), 0) from RaceResult r where r.jockey.id = :jockeyId")
	double sumPointsByJockeyId(UUID jockeyId);

	@Query("select coalesce(avg(r.rank), 0) from RaceResult r where r.jockey.id = :jockeyId")
	double averagePlacementByJockeyId(UUID jockeyId);
}
