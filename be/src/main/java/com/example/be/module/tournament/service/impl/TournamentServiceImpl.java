package com.example.be.module.tournament.service.impl;

import com.example.be.module.tournament.dto.request.TournamentRequest;
import com.example.be.module.tournament.dto.response.TournamentResponse;
import com.example.be.module.tournament.model.entity.Tournament;
import com.example.be.module.tournament.repository.TournamentRepository;
import com.example.be.module.tournament.service.TournamentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TournamentServiceImpl implements TournamentService {

    private final TournamentRepository tournamentRepository;

    @Override
    @Transactional
    public TournamentResponse createTournament(TournamentRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("Ngày bắt đầu không thể sau ngày kết thúc");
        }

        Tournament tournament = Tournament.builder()
                .name(request.getName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .build();

        Tournament saved = tournamentRepository.save(tournament);
        return TournamentResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public TournamentResponse updateTournament(UUID id, TournamentRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("Ngày bắt đầu không thể sau ngày kết thúc");
        }

        Tournament tournament = tournamentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giải đấu"));

        tournament.setName(request.getName());
        tournament.setStartDate(request.getStartDate());
        tournament.setEndDate(request.getEndDate());
        tournament.setDescription(request.getDescription());

        Tournament updated = tournamentRepository.save(tournament);
        return TournamentResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteTournament(UUID id) {
        Tournament tournament = tournamentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giải đấu"));
        tournamentRepository.delete(tournament);
    }

    @Override
    @Transactional(readOnly = true)
    public TournamentResponse getTournament(UUID id) {
        Tournament tournament = tournamentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giải đấu"));
        return TournamentResponse.fromEntity(tournament);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TournamentResponse> getAllTournaments() {
        return tournamentRepository.findAll().stream()
                .map(TournamentResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
