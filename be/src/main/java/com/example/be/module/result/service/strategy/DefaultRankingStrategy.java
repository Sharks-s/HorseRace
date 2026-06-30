package com.example.be.module.result.service.strategy;

import com.example.be.module.result.model.entity.RaceResult;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
public class DefaultRankingStrategy implements RankingStrategy {

    @Override
    public void calculateRankingsAndPoints(List<RaceResult> results, double distanceFactor) {
        if (results == null || results.isEmpty()) {
            return;
        }

        // Sort: 
        // 1. Non-violated participants first, then violated participants
        // 2. Sort by finishTime ascending (faster times first)
        results.sort(Comparator.comparing((RaceResult r) -> r.getViolation() != null && r.getViolation())
                .thenComparing(RaceResult::getFinishTime));

        int currentRank = 1;
        for (RaceResult result : results) {
            boolean isViolated = result.getViolation() != null && result.getViolation();
            if (isViolated) {
                result.setPlacement(99); // Place at the bottom
                result.setPoints(0.0);
            } else {
                result.setPlacement(currentRank);
                // Points formula: (11 - placement) * distanceFactor, min 0
                double basePoints = Math.max(0, 11 - currentRank);
                result.setPoints(basePoints * distanceFactor);
                currentRank++;
            }
        }
    }
}
