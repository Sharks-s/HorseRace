package com.example.be;

import com.example.be.module.horse.model.entity.Horse;
import com.example.be.module.result.model.entity.RaceResult;
import com.example.be.module.result.service.strategy.DefaultRankingStrategy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DefaultRankingStrategyTest {

    private DefaultRankingStrategy strategy;

    @BeforeEach
    void setUp() {
        strategy = new DefaultRankingStrategy();
    }

    @Test
    void testCalculateRankingsAndPoints() {
        Horse h1 = Horse.builder().id(UUID.randomUUID()).name("Horse 1").build();
        Horse h2 = Horse.builder().id(UUID.randomUUID()).name("Horse 2").build();
        Horse h3 = Horse.builder().id(UUID.randomUUID()).name("Horse 3").build();

        RaceResult r1 = RaceResult.builder().horse(h1).finishTime(120.5).violation(false).build();
        RaceResult r2 = RaceResult.builder().horse(h2).finishTime(118.2).violation(false).build();
        RaceResult r3 = RaceResult.builder().horse(h3).finishTime(125.0).violation(true).build(); // Violated

        List<RaceResult> results = new ArrayList<>(List.of(r1, r2, r3));

        strategy.calculateRankingsAndPoints(results, 1.5);

        // Sorting check (r2 should be first as it has 118.2, then r1 with 120.5, then violated r3)
        assertEquals(h2.getId(), results.get(0).getHorse().getId());
        assertEquals(1, results.get(0).getPlacement());
        assertEquals((11 - 1) * 1.5, results.get(0).getPoints()); // 15.0 points

        assertEquals(h1.getId(), results.get(1).getHorse().getId());
        assertEquals(2, results.get(1).getPlacement());
        assertEquals((11 - 2) * 1.5, results.get(1).getPoints()); // 13.5 points

        assertEquals(h3.getId(), results.get(2).getHorse().getId());
        assertEquals(99, results.get(2).getPlacement());
        assertEquals(0.0, results.get(2).getPoints());
    }
}
