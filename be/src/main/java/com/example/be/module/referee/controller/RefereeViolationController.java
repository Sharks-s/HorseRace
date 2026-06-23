package com.example.be.module.referee.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.referee.dto.request.CreateViolationRequest;
import com.example.be.module.referee.dto.response.ViolationResponse;
import com.example.be.module.referee.service.RefereeViolationService;
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
public class RefereeViolationController {

	private final RefereeViolationService refereeViolationService;

	@GetMapping("/races/{raceId}/violations")
	public ApiResponse<List<ViolationResponse>> getViolations(@PathVariable UUID raceId) {
		return ApiResponse.success(refereeViolationService.getViolations(raceId));
	}

	@PostMapping("/races/{raceId}/violations")
	public ApiResponse<ViolationResponse> createViolation(
			@PathVariable UUID raceId,
			@Valid @RequestBody CreateViolationRequest request) {
		return ApiResponse.success(refereeViolationService.createViolation(raceId, request));
	}

	@DeleteMapping("/races/{raceId}/violations/{id}")
	public ApiResponse<Void> deleteViolation(@PathVariable UUID raceId, @PathVariable UUID id) {
		refereeViolationService.deleteViolation(raceId, id);
		return ApiResponse.success(null);
	}
}
