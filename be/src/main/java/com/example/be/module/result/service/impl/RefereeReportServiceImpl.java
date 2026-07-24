package com.example.be.module.result.service.impl;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.registration.model.entity.Registration;
import com.example.be.module.registration.repository.RegistrationRepository;
import com.example.be.module.result.dto.ParticipantResultDetail;
import com.example.be.module.result.dto.RefereeReportResponse;
import com.example.be.module.result.dto.SubmitReportRequest;
import com.example.be.module.result.model.entity.RaceResult;
import com.example.be.module.result.model.entity.RefereeReport;
import com.example.be.module.result.repository.RaceResultRepository;
import com.example.be.module.result.repository.RefereeReportRepository;
import com.example.be.module.result.service.RefereeReportService;
import com.example.be.module.result.service.strategy.RankingStrategy;
import com.example.be.module.tournament.model.entity.Race;
import com.example.be.module.result.model.enums.RefereeReportStatus;
import com.example.be.module.tournament.model.enums.RaceStatus;
import com.example.be.module.tournament.repository.RaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefereeReportServiceImpl implements RefereeReportService {

    private final RefereeReportRepository refereeReportRepository;
    private final RaceResultRepository raceResultRepository;
    private final RaceRepository raceRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final RankingStrategy rankingStrategy;

    @Override
    @Transactional
    public RefereeReportResponse submitReport(UUID raceId, SubmitReportRequest request) {
        User referee = currentUser();
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new IllegalArgumentException("Race not found"));

        if (race.getReferee() == null || !race.getReferee().getId().equals(referee.getId())) {
            throw new IllegalArgumentException("You are not assigned as the referee for this race");
        }

        if (refereeReportRepository.existsByRaceId(raceId)) {
            throw new IllegalArgumentException("Report has already been submitted for this race");
        }

        List<RaceResult> results = new ArrayList<>();
        for (ParticipantResultDetail detail : request.getParticipants()) {
            Registration registration = registrationRepository.findByRaceIdAndHorseIdAndJockeyId(
                    raceId, detail.getHorseId(), detail.getJockeyId())
                    .orElseThrow(() -> new IllegalArgumentException("Horse " + detail.getHorseId() + 
                            " and Jockey " + detail.getJockeyId() + " are not registered for this race"));

            RaceResult result = RaceResult.builder()
                    .race(race)
                    .horse(registration.getHorse())
                    .jockey(registration.getJockey())
                    .finishTime(detail.getFinishTime())
                    .violation(detail.getViolation() != null && detail.getViolation())
                    .build();
            results.add(result);
        }

        // Apply ranking strategy
        rankingStrategy.calculateRankingsAndPoints(results, race.getDistanceFactor());

        // Save report
        RefereeReport report = RefereeReport.builder()
                .race(race)
                .referee(referee)
                .notes(request.getNotes())
                .status(RefereeReportStatus.SUBMITTED)
                .build();
        RefereeReport savedReport = refereeReportRepository.save(report);

        // Save results
        List<RaceResult> savedResults = raceResultRepository.saveAll(results);

        // Update race status
        race.setStatus(RaceStatus.RESULT_SUBMITTED);
        raceRepository.save(race);

        return RefereeReportResponse.fromEntities(savedReport, savedResults);
    }

    @Override
    @Transactional(readOnly = true)
    public RefereeReportResponse getReportByRace(UUID raceId) {
        RefereeReport report = refereeReportRepository.findByRaceId(raceId)
                .orElseThrow(() -> new IllegalArgumentException("No report found for this race"));

        List<RaceResult> results = raceResultRepository.findByRaceIdOrderByPlacementAsc(raceId);
        return RefereeReportResponse.fromEntities(report, results);
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
    }
}
