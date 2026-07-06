package com.example.be.module.tournament.service.impl;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.horse.model.entity.Horse;
import com.example.be.module.horse.repository.HorseRepository;
import com.example.be.module.notification.model.entity.Notification;
import com.example.be.module.notification.repository.NotificationRepository;
import com.example.be.module.registration.model.entity.Registration;
import com.example.be.module.registration.model.enums.RegistrationStatus;
import com.example.be.module.registration.repository.RegistrationRepository;
import com.example.be.module.tournament.dto.request.RegistrationRequest;
import com.example.be.module.tournament.dto.response.RegistrationResponse;
import com.example.be.module.tournament.model.entity.Race;
import com.example.be.module.tournament.model.enums.RaceStatus;
import com.example.be.module.tournament.repository.RaceRepository;
import com.example.be.module.tournament.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public RegistrationResponse sendInvitation(UUID raceId, RegistrationRequest request) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new IllegalArgumentException("Race not found."));

        // BR-04 Guard check: Cannot register if less than 48 hours to race
        if (LocalDateTime.now().plusHours(48).isAfter(race.getStartTime())) {
            throw new IllegalArgumentException("Registration is closed because the race will start within the next 48 hours.");
        }

        if (race.getStatus() != RaceStatus.SCHEDULED) {
            throw new IllegalArgumentException("Race is not in a registrable state.");
        }

        Horse horse = horseRepository.findById(request.getHorseId())
                .orElseThrow(() -> new IllegalArgumentException("Horse not found."));

        User jockey = userRepository.findById(request.getJockeyId())
                .orElseThrow(() -> new IllegalArgumentException("Jockey not found."));

        if (jockey.getRole() != Role.JOCKEY) {
            throw new IllegalArgumentException("User is not a jockey.");
        }

        if (registrationRepository.existsByRaceIdAndHorseId(raceId, horse.getId())) {
            throw new IllegalArgumentException("Horse is already registered for this race.");
        }

        Registration registration = Registration.builder()
                .race(race)
                .horse(horse)
                .owner(horse.getOwner())
                .jockey(jockey)
                .status(RegistrationStatus.PENDING_JOCKEY)
                .build();

        Registration saved = registrationRepository.save(registration);

        // BR-06/Notification: Send notification to the Jockey
        Notification notification = Notification.builder()
                .user(jockey)
                .title("New Race Invitation")
                .message("You have received a new race invitation for horse '" + horse.getName() + "'.")
                .read(false)
                .build();
        notificationRepository.save(notification);

        return RegistrationResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public RegistrationResponse respondToInvitation(UUID registrationId, boolean accept) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new IllegalArgumentException("Registration not found."));

        if (registration.getStatus() != RegistrationStatus.PENDING_JOCKEY) {
            throw new IllegalArgumentException("Registration is no longer in a pending state.");
        }

        if (accept) {
            // BR-02: Check daily race limit for jockey (maximum 3 accepted races in a day)
            LocalDate raceDate = registration.getRace().getStartTime().toLocalDate();
            long acceptedRaces = registrationRepository.countByJockey_IdAndStatusAndRace_StartTimeBetween(
                    registration.getJockey().getId(),
                    RegistrationStatus.ACCEPTED,
                    raceDate.atStartOfDay(),
                    raceDate.plusDays(1).atStartOfDay()
            );
            if (acceptedRaces >= 3) {
                throw new IllegalArgumentException("Jockey has reached the maximum limit of 3 races per day.");
            }
            registration.setStatus(RegistrationStatus.ACCEPTED);
        } else {
            registration.setStatus(RegistrationStatus.DECLINED);
        }

        Registration updated = registrationRepository.save(registration);

        // BR-06/Notification: Send notification to the Owner
        Notification notification = Notification.builder()
                .user(registration.getHorse().getOwner())
                .title(accept ? "Invitation Accepted" : "Invitation Declined")
                .message("Jockey '" + registration.getJockey().getFullName() + "' has " + (accept ? "accepted" : "declined") + " your invitation for horse '" + registration.getHorse().getName() + "'.")
                .read(false)
                .build();
        notificationRepository.save(notification);

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
