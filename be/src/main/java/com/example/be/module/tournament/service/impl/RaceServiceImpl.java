package com.example.be.module.tournament.service.impl;

import com.example.be.module.tournament.dto.request.RaceRequest;
import com.example.be.module.tournament.dto.response.RaceResponse;
import com.example.be.module.tournament.model.entity.Race;
import com.example.be.module.tournament.model.entity.Tournament;
import com.example.be.module.tournament.repository.RaceRepository;
import com.example.be.module.tournament.repository.TournamentRepository;
import com.example.be.module.tournament.service.RaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RaceServiceImpl implements RaceService {

    private final RaceRepository raceRepository;
    private final TournamentRepository tournamentRepository;

    @Override
    @Transactional
    public RaceResponse createRace(UUID tournamentId, RaceRequest request) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giải đấu"));

        validateSchedule(tournament, request);

        Race race = Race.builder()
                .tournament(tournament)
                .name(request.getName())
                .startTime(request.getStartTime())
                .distanceFactor(request.getDistanceFactor())
                .build();

        Race saved = raceRepository.save(race);
        return RaceResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public RaceResponse updateRace(UUID id, RaceRequest request) {
        Race race = raceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vòng đua"));

        validateSchedule(race.getTournament(), request);

        race.setName(request.getName());
        race.setStartTime(request.getStartTime());
        race.setDistanceFactor(request.getDistanceFactor());

        Race updated = raceRepository.save(race);
        return RaceResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteRace(UUID id) {
        Race race = raceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vòng đua"));
        raceRepository.delete(race);
    }

    @Override
    @Transactional(readOnly = true)
    public RaceResponse getRace(UUID id) {
        Race race = raceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vòng đua"));
        return RaceResponse.fromEntity(race);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RaceResponse> getRacesByTournament(UUID tournamentId) {
        return raceRepository.findByTournamentId(tournamentId).stream()
                .map(RaceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private void validateSchedule(Tournament tournament, RaceRequest request) {
        LocalDate raceDate = request.getStartTime().toLocalDate();
        if (raceDate.isBefore(tournament.getStartDate()) || raceDate.isAfter(tournament.getEndDate())) {
            throw new IllegalArgumentException("Thời gian bắt đầu của vòng đua phải nằm trong khoảng thời gian diễn ra giải đấu ("
                    + tournament.getStartDate() + " đến " + tournament.getEndDate() + ")");
        }
    }
}
