package com.example.be.module.tournament.service.impl;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.repository.UserRepository;
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
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RaceResponse createRace(UUID tournamentId, RaceRequest request) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found."));

        validateSchedule(tournament, request);

        Race race = Race.builder()
                .tournament(tournament)
                .referee(resolveReferee(request.getRefereeId()))
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
                .orElseThrow(() -> new IllegalArgumentException("Race not found."));

        validateSchedule(race.getTournament(), request);

        race.setName(request.getName());
        race.setStartTime(request.getStartTime());
        race.setDistanceFactor(request.getDistanceFactor());
        race.setReferee(resolveReferee(request.getRefereeId()));

        Race updated = raceRepository.save(race);
        return RaceResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteRace(UUID id) {
        Race race = raceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Race not found."));
        raceRepository.delete(race);
    }

    @Override
    @Transactional(readOnly = true)
    public RaceResponse getRace(UUID id) {
        Race race = raceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Race not found."));
        return RaceResponse.fromEntity(race);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RaceResponse> getRacesByTournament(UUID tournamentId) {
        return raceRepository.findByTournamentId(tournamentId).stream()
                .map(RaceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RaceResponse assignReferee(UUID raceId, UUID refereeId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new IllegalArgumentException("Race not found."));

        com.example.be.module.auth.model.entity.User referee = userRepository.findById(refereeId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (referee.getRole() != com.example.be.module.auth.model.enums.Role.REFEREE) {
            throw new IllegalArgumentException("User does not have the role of referee.");
        }

        // Validate conflict: check if this referee is already assigned to a race overlapping in time
        // Simplification for SHR-58: just check if they are already assigned to a race with the exact same start time
        // Real implementation would check time ranges
        boolean hasConflict = raceRepository.findAll().stream()
                .anyMatch(r -> !r.getId().equals(raceId) && r.getReferee() != null && r.getReferee().getId().equals(refereeId) 
                        && r.getStartTime().equals(race.getStartTime()));
        
        if (hasConflict) {
            throw new IllegalArgumentException("Referee is already assigned to a race at the same time.");
        }

        race.setReferee(referee);
        Race updated = raceRepository.save(race);
        return RaceResponse.fromEntity(updated);
    }

    private void validateSchedule(Tournament tournament, RaceRequest request) {
        LocalDate raceDate = request.getStartTime().toLocalDate();
        if (raceDate.isBefore(tournament.getStartDate()) || raceDate.isAfter(tournament.getEndDate())) {
            throw new IllegalArgumentException("The start time of the race must be within the tournament duration ("
                    + tournament.getStartDate() + " to " + tournament.getEndDate() + ")");
        }
    }

    private User resolveReferee(UUID refereeId) {
        if (refereeId == null) {
            return null;
        }
        User referee = userRepository.findById(refereeId)
                .orElseThrow(() -> new IllegalArgumentException("Referee not found"));
        if (referee.getRole() != Role.REFEREE) {
            throw new IllegalArgumentException("Assigned user must have REFEREE role");
        }
        return referee;
    }
}
