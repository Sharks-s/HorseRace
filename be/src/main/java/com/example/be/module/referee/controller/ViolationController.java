package com.example.be.module.referee.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.referee.dto.request.ViolationRequest;
import com.example.be.module.referee.dto.response.ViolationResponse;
import com.example.be.module.referee.service.ViolationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/referee/violations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('REFEREE')")
public class ViolationController {

	private final ViolationService violationService;

	@GetMapping
	public ApiResponse<List<ViolationResponse>> getViolations(@RequestParam(required = false) UUID raceId) {
		return ApiResponse.success(violationService.getViolations(raceId));
	}

	@PostMapping
	public ApiResponse<ViolationResponse> createViolation(@Valid @RequestBody ViolationRequest request) {
		return ApiResponse.success(violationService.createViolation(request));
	}

	@PutMapping("/{id}")
	public ApiResponse<ViolationResponse> updateViolation(
			@PathVariable UUID id,
			@Valid @RequestBody ViolationRequest request) {
		return ApiResponse.success(violationService.updateViolation(id, request));
	}

	@DeleteMapping("/{id}")
	public ApiResponse<Void> deleteViolation(@PathVariable UUID id) {
		violationService.deleteViolation(id);
		return ApiResponse.success(null);
	}
}
