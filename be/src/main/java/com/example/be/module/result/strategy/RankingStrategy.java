package com.example.be.module.result.strategy;

import com.example.be.module.result.model.entity.RaceResult;

import java.util.List;

public interface RankingStrategy {

	List<RankingResult> calculate(List<RaceResult> results, float coeff);
}
