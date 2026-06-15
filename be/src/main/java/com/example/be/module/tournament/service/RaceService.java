package com.example.be.module.tournament.service;

import com.example.be.module.tournament.dto.request.RaceRequest;
import com.example.be.module.tournament.dto.response.RaceResponse;

import java.util.List;
import java.util.UUID;

public interface RaceService {
    RaceResponse createRace(UUID tournamentId, RaceRequest request);
    RaceResponse updateRace(UUID id, RaceRequest request);
    void deleteRace(UUID id);
    RaceResponse getRace(UUID id);
    List<RaceResponse> getRacesByTournament(UUID tournamentId);
    RaceResponse assignReferee(UUID raceId, UUID refereeId);
}
