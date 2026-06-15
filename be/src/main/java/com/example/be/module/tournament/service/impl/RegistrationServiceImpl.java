package com.example.be.module.tournament.service.impl;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.profile.model.entity.Horse;
import com.example.be.module.profile.repository.HorseRepository;
import com.example.be.module.tournament.dto.request.RegistrationRequest;
import com.example.be.module.tournament.dto.response.RegistrationResponse;
import com.example.be.module.tournament.model.entity.Race;
import com.example.be.module.tournament.model.entity.Registration;
import com.example.be.module.tournament.model.enums.RaceStatus;
import com.example.be.module.tournament.model.enums.RegistrationStatus;
import com.example.be.module.tournament.repository.RaceRepository;
import com.example.be.module.tournament.repository.RegistrationRepository;
import com.example.be.module.tournament.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final RaceRepository raceRepository;
    private final HorseRepository horseRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RegistrationResponse sendInvitation(UUID raceId, RegistrationRequest request) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vòng đua"));

        // BR-04 Guard check: Cannot register if less than 48 hours to race
        if (LocalDateTime.now().plusHours(48).isAfter(race.getStartTime())) {
            throw new IllegalArgumentException("Không thể đăng ký. Vòng đua sẽ bắt đầu trong vòng 48h tới.");
        }

        if (race.getStatus() != RaceStatus.SCHEDULED) {
            throw new IllegalArgumentException("Vòng đua không ở trạng thái mở đăng ký");
        }

        Horse horse = horseRepository.findById(request.getHorseId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ngựa"));

        User jockey = userRepository.findById(request.getJockeyId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy jockey"));

        if (jockey.getRole() != Role.JOCKEY) {
            throw new IllegalArgumentException("Người dùng không phải là Jockey");
        }

        if (registrationRepository.existsByRaceIdAndHorseId(raceId, horse.getId())) {
            throw new IllegalArgumentException("Ngựa đã được đăng ký cho vòng đua này");
        }

        Registration registration = Registration.builder()
                .race(race)
                .horse(horse)
                .jockey(jockey)
                .status(RegistrationStatus.PENDING_JOCKEY)
                .build();

        Registration saved = registrationRepository.save(registration);
        return RegistrationResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public RegistrationResponse respondToInvitation(UUID registrationId, boolean accept) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lời mời"));

        if (registration.getStatus() != RegistrationStatus.PENDING_JOCKEY) {
            throw new IllegalArgumentException("Lời mời không còn ở trạng thái chờ");
        }

        if (accept) {
            // BR-02: Check daily race limit for jockey could be added here
            // Simplified for now
            registration.setStatus(RegistrationStatus.ACCEPTED);
        } else {
            registration.setStatus(RegistrationStatus.DECLINED);
        }

        Registration updated = registrationRepository.save(registration);
        return RegistrationResponse.fromEntity(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistrationResponse> getJockeyInvitations(UUID jockeyId) {
        return registrationRepository.findByJockeyId(jockeyId).stream()
                .map(RegistrationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistrationResponse> getRaceRegistrations(UUID raceId) {
        return registrationRepository.findByRaceId(raceId).stream()
                .map(RegistrationResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
