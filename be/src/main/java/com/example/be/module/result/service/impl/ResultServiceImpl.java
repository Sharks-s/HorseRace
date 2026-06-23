package com.example.be.module.result.service.impl;

import com.example.be.module.registration.model.entity.RaceRegistration;
import com.example.be.module.result.model.entity.RaceResult;
import com.example.be.module.result.service.ResultService;
import com.example.be.module.result.strategy.RankingStrategy;
import com.example.be.module.tournament.model.entity.Race;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {

	private final RankingStrategy rankingStrategy;

	@Override
	public List<RaceResult> updateRaceResult(
			Race race,
			List<RaceRegistration> readyRegistrations,
			Map<UUID, Double> finishTimesByHorseId,
			Set<UUID> violationHorseIds) {
		List<RaceResult> results = readyRegistrations.stream()
				.map(registration -> RaceResult.builder()
						.race(race)
						.horse(registration.getHorse())
						.jockey(registration.getJockey())
						.finishTime(finishTimesByHorseId.get(registration.getHorse().getId()))
						.violationFlag(violationHorseIds.contains(registration.getHorse().getId()))
						.build())
				.toList();

		return rankingStrategy.calculate(results, race.getDistanceFactor().floatValue()).stream()
				.map(rankingResult -> rankingResult.raceResult())
				.toList();
	}
}
