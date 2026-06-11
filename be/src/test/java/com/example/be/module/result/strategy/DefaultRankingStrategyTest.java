package com.example.be.module.result.strategy;

import com.example.be.module.result.model.entity.RaceResult;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class DefaultRankingStrategyTest {

	private final DefaultRankingStrategy strategy = new DefaultRankingStrategy();

	@Test
	void calculateRanksByFinishTimeTimesCoefficient() {
		RaceResult slow = RaceResult.builder().finishTime(62.5).build();
		RaceResult fast = RaceResult.builder().finishTime(58.2).build();

		List<RankingResult> rankings = strategy.calculate(List.of(slow, fast), 1.5f);

		assertThat(rankings).extracting(RankingResult::getRaceResult).containsExactly(fast, slow);
		assertThat(rankings).extracting(RankingResult::getRank).containsExactly(1, 2);
		assertThat(rankings.get(0).getScore()).isEqualTo(58.2 * 1.5f);
	}

	@Test
	void calculateUsesFastestFinishTimeAsTieBreak() {
		RaceResult slowerTie = RaceResult.builder().finishTime(61.0).build();
		RaceResult fasterTie = RaceResult.builder().finishTime(59.0).build();

		List<RankingResult> rankings = strategy.calculate(List.of(slowerTie, fasterTie), 0f);

		assertThat(rankings).extracting(RankingResult::getRaceResult).containsExactly(fasterTie, slowerTie);
		assertThat(rankings).extracting(RankingResult::getRank).containsExactly(1, 2);
	}

	@Test
	void calculateSingleRaceResult() {
		RaceResult only = RaceResult.builder().finishTime(70.0).build();

		List<RankingResult> rankings = strategy.calculate(List.of(only), 2f);

		assertThat(rankings).hasSize(1);
		assertThat(rankings.get(0).getRank()).isEqualTo(1);
		assertThat(rankings.get(0).getScore()).isEqualTo(140.0);
	}
}
