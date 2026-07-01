package com.example.be.module.result.service.strategy;

import com.example.be.module.result.model.entity.RaceResult;

import java.util.List;

public interface RankingStrategy {
    void calculateRankingsAndPoints(List<RaceResult> results, double distanceFactor);
}
