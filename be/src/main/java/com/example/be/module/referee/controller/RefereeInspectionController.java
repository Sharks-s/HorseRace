package com.example.be.module.referee.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.referee.dto.request.InspectHorseRequest;
import com.example.be.module.referee.dto.response.PreRaceHorseInspectionResponse;
import com.example.be.module.referee.service.RefereeInspectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/referee/pre-race")
@RequiredArgsConstructor
@PreAuthorize("hasRole('REFEREE')")
public class RefereeInspectionController {

	private final RefereeInspectionService refereeInspectionService;

	@GetMapping("/registrations")
	public ApiResponse<List<PreRaceHorseInspectionResponse>> getAssignedHorseInspections() {
		return ApiResponse.success(refereeInspectionService.getAssignedHorseInspections());
	}

	@PutMapping("/registrations/{registrationId}/inspect")
	public ApiResponse<PreRaceHorseInspectionResponse> inspectHorse(
			@PathVariable UUID registrationId,
			@Valid @RequestBody InspectHorseRequest request) {
		return ApiResponse.success(refereeInspectionService.inspectHorse(registrationId, request));
	}
}
