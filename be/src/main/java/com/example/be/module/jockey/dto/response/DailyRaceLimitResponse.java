package com.example.be.module.jockey.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class DailyRaceLimitResponse {

	private LocalDate date;
	private long acceptedRaceCount;
	private int dailyLimit;
	private boolean withinLimit;
}
