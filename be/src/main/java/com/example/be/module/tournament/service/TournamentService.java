package com.example.be.module.tournament.service;

import com.example.be.module.tournament.dto.request.TournamentRequest;
import com.example.be.module.tournament.dto.response.TournamentResponse;

import java.util.List;
import java.util.UUID;

public interface TournamentService {
    TournamentResponse createTournament(TournamentRequest request);
    TournamentResponse updateTournament(UUID id, TournamentRequest request);
    void deleteTournament(UUID id);
    TournamentResponse getTournament(UUID id);
    List<TournamentResponse> getAllTournaments();
}
