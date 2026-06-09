package com.example.be.module.jockey.service;

import com.example.be.module.jockey.dto.request.JockeyProfileRequest;
import com.example.be.module.jockey.dto.response.DailyRaceLimitResponse;
import com.example.be.module.jockey.dto.response.JockeyProfileResponse;
import com.example.be.module.jockey.dto.response.JockeyRankingResponse;
import com.example.be.module.jockey.dto.response.JockeyScheduleResponse;

import java.time.LocalDate;
import java.util.List;

public interface JockeyService {

	JockeyProfileResponse getMyProfile();

	JockeyProfileResponse updateMyProfile(JockeyProfileRequest request);

	JockeyRankingResponse getMyRanking();

	List<JockeyScheduleResponse> getMyUpcomingSchedule();

	DailyRaceLimitResponse checkDailyRaceLimit(LocalDate date);
}
