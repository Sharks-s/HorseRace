package com.example.be.module.referee.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.referee.dto.request.SubmitRaceResultRequest;
import com.example.be.module.referee.dto.response.RefereeReportResponse;
import com.example.be.module.referee.service.RefereeReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/referee/races/{raceId}/report")
@RequiredArgsConstructor
@PreAuthorize("hasRole('REFEREE')")
public class RefereeReportController {

	private final RefereeReportService refereeReportService;

	@GetMapping
	public ApiResponse<RefereeReportResponse> getReport(@PathVariable UUID raceId) {
		return ApiResponse.success(refereeReportService.getReport(raceId).orElse(null));
	}

	@PostMapping
	public ApiResponse<RefereeReportResponse> submitReport(
			@PathVariable UUID raceId,
			@Valid @RequestBody List<SubmitRaceResultRequest.HorseFinishTimeRequest> request) {
		return ApiResponse.success(refereeReportService.submitReport(raceId, request));
	}
}
