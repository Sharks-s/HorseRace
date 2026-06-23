package com.example.be.module.referee.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.referee.dto.request.SubmitRaceReportRequest;
import com.example.be.module.referee.dto.response.RaceReportResponse;
import com.example.be.module.referee.service.RefereeRaceReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/referee/races")
@RequiredArgsConstructor
@PreAuthorize("hasRole('REFEREE')")
public class RefereeRaceReportController {

	private final RefereeRaceReportService refereeRaceReportService;

	@PostMapping("/{raceId}/report")
	public ApiResponse<RaceReportResponse> submitReport(
			@PathVariable UUID raceId,
			@Valid @RequestBody List<SubmitRaceReportRequest> request) {
		return ApiResponse.success(refereeRaceReportService.submitReport(raceId, request));
	}
}
