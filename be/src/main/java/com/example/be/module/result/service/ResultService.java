package com.example.be.module.result.service;

import com.example.be.module.result.dto.RefereeReportResponse;
import com.example.be.module.result.dto.TournamentStandingResponse;
import com.example.be.module.tournament.dto.response.RaceResponse;

import java.util.List;
import java.util.UUID;

public interface ResultService {
    List<RaceResponse> getPendingRaces();
    void publishResult(UUID raceId);
    List<RefereeReportResponse.RaceResultDetail> getOfficialResults(UUID raceId);
    List<TournamentStandingResponse> getTournamentStandings(UUID tournamentId);
}
