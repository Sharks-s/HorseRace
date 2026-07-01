package com.example.be.module.result.service.impl;

import com.example.be.module.result.dto.RefereeReportResponse;
import com.example.be.module.result.dto.TournamentStandingResponse;
import com.example.be.module.result.model.entity.RaceResult;
import com.example.be.module.result.repository.RaceResultRepository;
import com.example.be.module.result.service.ResultService;
import com.example.be.module.tournament.dto.response.RaceResponse;
import com.example.be.module.tournament.model.entity.Race;
import com.example.be.module.tournament.model.enums.RaceStatus;
import com.example.be.module.tournament.repository.RaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {

    private final RaceRepository raceRepository;
    private final RaceResultRepository raceResultRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RaceResponse> getPendingRaces() {
        return raceRepository.findAll().stream()
                .filter(race -> race.getStatus() == RaceStatus.RESULT_SUBMITTED)
                .map(RaceResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public void publishResult(UUID raceId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new IllegalArgumentException("Race not found"));

        if (race.getStatus() != RaceStatus.RESULT_SUBMITTED) {
            throw new IllegalArgumentException("Results can only be published for races with SUBMITTED results");
        }

        race.setStatus(RaceStatus.OFFICIAL);
        raceRepository.save(race);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RefereeReportResponse.RaceResultDetail> getOfficialResults(UUID raceId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new IllegalArgumentException("Race not found"));

        if (race.getStatus() != RaceStatus.OFFICIAL) {
            throw new IllegalArgumentException("Results for this race are not official yet");
        }

        return raceResultRepository.findByRaceIdOrderByPlacementAsc(raceId).stream()
                .map(RefereeReportResponse.RaceResultDetail::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TournamentStandingResponse> getTournamentStandings(UUID tournamentId) {
        List<Race> officialRaces = raceRepository.findByTournamentId(tournamentId).stream()
                .filter(race -> race.getStatus() == RaceStatus.OFFICIAL)
                .toList();

        if (officialRaces.isEmpty()) {
            return Collections.emptyList();
        }

        List<UUID> raceIds = officialRaces.stream().map(Race::getId).toList();
        
        // Find all results across these races
        List<RaceResult> allResults = new ArrayList<>();
        for (UUID raceId : raceIds) {
            allResults.addAll(raceResultRepository.findByRaceIdOrderByPlacementAsc(raceId));
        }

        // Group by Horse
        Map<UUID, List<RaceResult>> horseResults = allResults.stream()
                .collect(Collectors.groupingBy(r -> r.getHorse().getId()));

        List<TournamentStandingResponse> standings = new ArrayList<>();
        for (Map.Entry<UUID, List<RaceResult>> entry : horseResults.entrySet()) {
            UUID horseId = entry.getKey();
            List<RaceResult> results = entry.getValue();
            
            String horseName = results.get(0).getHorse().getName();
            double totalPoints = results.stream().mapToDouble(RaceResult::getPoints).sum();
            double bestTime = results.stream()
                    .filter(r -> r.getViolation() == null || !r.getViolation())
                    .mapToDouble(RaceResult::getFinishTime)
                    .min()
                    .orElse(99999.9); // high value if disqualified in all races

            standings.add(TournamentStandingResponse.builder()
                    .horseId(horseId)
                    .horseName(horseName)
                    .totalPoints(totalPoints)
                    .bestFinishTime(bestTime)
                    .build());
        }

        // Sort: 1. points desc, 2. bestTime asc
        standings.sort(Comparator.comparing(TournamentStandingResponse::getTotalPoints).reversed()
                .thenComparing(TournamentStandingResponse::getBestFinishTime));

        // Assign Rank
        for (int i = 0; i < standings.size(); i++) {
            standings.get(i).setRank(i + 1);
        }

        return standings;
    }
}
