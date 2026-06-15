package com.example.be.module.horse.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.horse.dto.request.HorseCreateRequest;
import com.example.be.module.horse.dto.request.HorseUpdateRequest;
import com.example.be.module.horse.dto.response.HorseResponse;
import com.example.be.module.horse.model.enums.HorseStatus;
import com.example.be.module.horse.service.HorseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/owner/horses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('HORSE_OWNER')")
public class HorseController {

	private final HorseService horseService;

	@PostMapping
	public ApiResponse<HorseResponse> createHorse(@Valid @RequestBody HorseCreateRequest request) {
		return ApiResponse.success(horseService.createHorse(request));
	}

	@GetMapping
	public ApiResponse<List<HorseResponse>> getMyHorses(@RequestParam(required = false) HorseStatus status) {
		return ApiResponse.success(horseService.getMyHorses(status));
	}

	@PutMapping("/{id}")
	public ApiResponse<HorseResponse> updateHorse(@PathVariable UUID id, @Valid @RequestBody HorseUpdateRequest request) {
		return ApiResponse.success(horseService.updateHorse(id, request));
	}
}