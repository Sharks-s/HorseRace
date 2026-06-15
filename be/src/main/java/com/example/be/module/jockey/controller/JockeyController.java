package com.example.be.module.jockey.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.jockey.dto.request.JockeyProfileRequest;
import com.example.be.module.jockey.dto.response.DailyRaceLimitResponse;
import com.example.be.module.jockey.dto.response.JockeyProfileResponse;
import com.example.be.module.jockey.dto.response.JockeyRankingResponse;
import com.example.be.module.jockey.dto.response.JockeyScheduleResponse;
import com.example.be.module.jockey.service.JockeyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/jockey")
@RequiredArgsConstructor
@PreAuthorize("hasRole('JOCKEY')")
public class JockeyController {

	private final JockeyService jockeyService;

	@GetMapping("/profile")
	public ApiResponse<JockeyProfileResponse> getMyProfile() {
		return ApiResponse.success(jockeyService.getMyProfile());
	}

	@PutMapping("/profile")
	public ApiResponse<JockeyProfileResponse> updateMyProfile(@Valid @RequestBody JockeyProfileRequest request) {
		return ApiResponse.success(jockeyService.updateMyProfile(request));
	}

	@GetMapping("/ranking")
	public ApiResponse<JockeyRankingResponse> getMyRanking() {
		return ApiResponse.success(jockeyService.getMyRanking());
	}

	@GetMapping("/schedule/upcoming")
	public ApiResponse<List<JockeyScheduleResponse>> getMyUpcomingSchedule() {
		return ApiResponse.success(jockeyService.getMyUpcomingSchedule());
	}

	@GetMapping("/daily-limit")
	public ApiResponse<DailyRaceLimitResponse> checkDailyRaceLimit(
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		return ApiResponse.success(jockeyService.checkDailyRaceLimit(date));
	}
}
