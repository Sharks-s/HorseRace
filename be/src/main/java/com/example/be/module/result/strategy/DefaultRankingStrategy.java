package com.example.be.module.result.strategy;

import com.example.be.module.result.model.entity.RaceResult;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class DefaultRankingStrategy implements RankingStrategy {

	@Override
	public List<RankingResult> calculate(List<RaceResult> results, float coeff) {
		AtomicInteger nextRank = new AtomicInteger(1);
		return results.stream()
				.sorted(Comparator
						.comparingDouble((RaceResult result) -> result.getFinishTime() * coeff)
						.thenComparingDouble(RaceResult::getFinishTime))
				.map(result -> new RankingResult(result, nextRank.getAndIncrement(), result.getFinishTime() * coeff))
				.toList();
	}
}
