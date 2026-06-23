package com.example.be.module.referee.service;

import com.example.be.module.referee.dto.request.CreateViolationRequest;
import com.example.be.module.referee.dto.response.ViolationResponse;

import java.util.List;
import java.util.UUID;

public interface RefereeViolationService {

	List<ViolationResponse> getViolations(UUID raceId);

	ViolationResponse createViolation(UUID raceId, CreateViolationRequest request);

	void deleteViolation(UUID raceId, UUID violationId);
}
