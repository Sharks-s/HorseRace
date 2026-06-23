package com.example.be.module.result.strategy;

import com.example.be.module.result.model.entity.RaceResult;

public record RankingResult(RaceResult raceResult, int rank, double calculatedTime) {
}
