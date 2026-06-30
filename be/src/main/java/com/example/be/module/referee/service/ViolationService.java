package com.example.be.module.referee.service;

import com.example.be.module.referee.dto.request.RecordViolationRequest;
import com.example.be.module.referee.dto.response.ViolationResponse;

import java.util.List;
import java.util.UUID;

public interface ViolationService {
    ViolationResponse recordViolation(UUID raceId, RecordViolationRequest request);
    List<ViolationResponse> getViolationsByRace(UUID raceId);
    void deleteViolation(UUID violationId);
}
