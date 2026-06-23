package com.example.be.module.result.strategy;

import com.example.be.module.result.model.entity.RaceResult;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
public class DefaultRankingStrategy implements RankingStrategy {

	@Override
	public List<RankingResult> calculate(List<RaceResult> results, float coeff) {
		List<RaceResult> sorted = results.stream()
				.peek(result -> result.setCalculatedTime(result.getFinishTime() * coeff))
				.sorted(Comparator
						.comparing(RaceResult::getCalculatedTime)
						.thenComparing(RaceResult::getFinishTime)
						.thenComparing(result -> result.getHorse().getId()))
				.toList();

		for (int i = 0; i < sorted.size(); i++) {
			sorted.get(i).setRank(i + 1);
		}

		return sorted.stream()
				.map(result -> new RankingResult(result, result.getRank(), result.getCalculatedTime()))
				.toList();
	}
}
