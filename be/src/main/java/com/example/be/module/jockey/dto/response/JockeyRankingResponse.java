package com.example.be.module.jockey.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JockeyRankingResponse {

	private long totalRaces;
	private long wins;
	private double totalPoints;
	private double averagePlacement;
}
