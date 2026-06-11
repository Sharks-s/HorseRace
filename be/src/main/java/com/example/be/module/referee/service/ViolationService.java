package com.example.be.module.referee.service;

import com.example.be.module.referee.dto.request.ViolationRequest;
import com.example.be.module.referee.dto.response.ViolationResponse;

import java.util.List;
import java.util.UUID;

public interface ViolationService {

	List<ViolationResponse> getViolations(UUID raceId);

	ViolationResponse createViolation(ViolationRequest request);

	ViolationResponse updateViolation(UUID id, ViolationRequest request);

	void deleteViolation(UUID id);
}
