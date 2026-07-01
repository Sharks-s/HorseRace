package com.example.be.module.referee.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.referee.dto.request.RecordViolationRequest;
import com.example.be.module.referee.dto.response.ViolationResponse;
import com.example.be.module.referee.service.ViolationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/referee")
@RequiredArgsConstructor
@PreAuthorize("hasRole('REFEREE')")
public class ViolationController {

	private final ViolationService violationService;

	@PostMapping("/races/{raceId}/violations")
	public ApiResponse<ViolationResponse> recordViolation(
			@PathVariable UUID raceId,
			@Valid @RequestBody RecordViolationRequest request) {
		return ApiResponse.success(violationService.recordViolation(raceId, request));
	}

	@GetMapping("/races/{raceId}/violations")
	public ApiResponse<List<ViolationResponse>> getViolationsByRace(@PathVariable UUID raceId) {
		return ApiResponse.success(violationService.getViolationsByRace(raceId));
	}

	@DeleteMapping("/violations/{violationId}")
	public ApiResponse<Void> deleteViolation(@PathVariable UUID violationId) {
		violationService.deleteViolation(violationId);
		return ApiResponse.success(null);
	}
}
