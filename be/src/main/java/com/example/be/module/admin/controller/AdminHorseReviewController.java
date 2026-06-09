package com.example.be.module.admin.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.admin.dto.request.RejectHorseRequest;
import com.example.be.module.admin.service.AdminHorseReviewService;
import com.example.be.module.horse.dto.response.HorseResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/horses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminHorseReviewController {

	private final AdminHorseReviewService adminHorseReviewService;

	@GetMapping("/pending")
	public ApiResponse<Page<HorseResponse>> getPendingHorses(
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdFrom,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdTo,
			Pageable pageable) {
		return ApiResponse.success(adminHorseReviewService.getPendingHorses(createdFrom, createdTo, pageable));
	}

	@GetMapping("/{id}")
	public ApiResponse<HorseResponse> getHorse(@PathVariable UUID id) {
		return ApiResponse.success(adminHorseReviewService.getHorse(id));
	}

	@PutMapping("/{id}/approve")
	public ApiResponse<HorseResponse> approveHorse(@PathVariable UUID id) {
		return ApiResponse.success(adminHorseReviewService.approveHorse(id));
	}

	@PutMapping("/{id}/reject")
	public ApiResponse<HorseResponse> rejectHorse(
			@PathVariable UUID id,
			@Valid @RequestBody RejectHorseRequest request) {
		return ApiResponse.success(adminHorseReviewService.rejectHorse(id, request.getReason()));
	}
}
