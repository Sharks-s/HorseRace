package com.example.be.module.referee.service.impl;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.referee.dto.request.RecordViolationRequest;
import com.example.be.module.referee.dto.response.ViolationResponse;
import com.example.be.module.referee.model.entity.Violation;
import com.example.be.module.referee.repository.ViolationRepository;
import com.example.be.module.referee.service.ViolationService;
import com.example.be.module.registration.model.entity.Registration;
import com.example.be.module.registration.repository.RegistrationRepository;
import com.example.be.module.tournament.model.entity.Race;
import com.example.be.module.tournament.repository.RaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ViolationServiceImpl implements ViolationService {

    private final ViolationRepository violationRepository;
    private final RaceRepository raceRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ViolationResponse recordViolation(UUID raceId, RecordViolationRequest request) {
        User referee = currentUser();
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new IllegalArgumentException("Race not found"));

        if (race.getReferee() == null || !race.getReferee().getId().equals(referee.getId())) {
            throw new IllegalArgumentException("You are not assigned as the referee for this race");
        }

        Registration registration = registrationRepository.findByRaceIdAndHorseIdAndJockeyId(
                raceId, request.getHorseId(), request.getJockeyId())
                .orElseThrow(() -> new IllegalArgumentException("The specified Horse and Jockey are not registered for this race"));

        Violation violation = Violation.builder()
                .race(race)
                .horse(registration.getHorse())
                .jockey(registration.getJockey())
                .type(request.getType())
                .notes(request.getNotes())
                .occurrenceMinute(request.getOccurrenceMinute())
                .build();

        Violation saved = violationRepository.save(violation);
        return ViolationResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ViolationResponse> getViolationsByRace(UUID raceId) {
        return violationRepository.findByRaceId(raceId).stream()
                .map(ViolationResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public void deleteViolation(UUID violationId) {
        Violation violation = violationRepository.findById(violationId)
                .orElseThrow(() -> new IllegalArgumentException("Violation record not found"));
        
        User referee = currentUser();
        if (violation.getRace().getReferee() == null || !violation.getRace().getReferee().getId().equals(referee.getId())) {
            throw new IllegalArgumentException("You are not assigned as the referee for this race");
        }
        
        violationRepository.delete(violation);
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
    }
}
