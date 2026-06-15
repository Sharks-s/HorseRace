package com.example.be.module.tournament.job;

import com.example.be.module.tournament.model.entity.Race;
import com.example.be.module.tournament.model.enums.RaceStatus;
import com.example.be.module.tournament.repository.RaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class RaceSchedulingJob {

    private final RaceRepository raceRepository;

    /**
     * Chạy mỗi giờ một lần để kiểm tra và đóng đăng ký (BR-04)
     * Auto-close đăng ký 48h trước đua.
     */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void closeRegistrationsForUpcomingRaces() {
        log.info("Running job: closeRegistrationsForUpcomingRaces");
        LocalDateTime deadline = LocalDateTime.now().plusHours(48);

        List<Race> racesToClose = raceRepository.findAll().stream()
                .filter(r -> r.getStatus() == RaceStatus.SCHEDULED)
                .filter(r -> r.getStartTime().isBefore(deadline) || r.getStartTime().isEqual(deadline))
                .toList();

        if (!racesToClose.isEmpty()) {
            racesToClose.forEach(r -> {
                r.setStatus(RaceStatus.CLOSED_REGISTRATION);
                log.info("Closed registration for race: {}", r.getId());
            });
            raceRepository.saveAll(racesToClose);
        }
    }
}
