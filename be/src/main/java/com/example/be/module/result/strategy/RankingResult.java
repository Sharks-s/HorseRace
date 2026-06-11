package com.example.be.module.result.strategy;

import com.example.be.module.result.model.entity.RaceResult;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RankingResult {

	private RaceResult raceResult;
	private int rank;
	private double score;
}
