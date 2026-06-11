package com.example.be.module.referee.service;

import com.example.be.module.referee.dto.request.InspectHorseRequest;
import com.example.be.module.referee.dto.response.PreRaceHorseInspectionResponse;

import java.util.List;
import java.util.UUID;

public interface RefereeInspectionService {

	List<PreRaceHorseInspectionResponse> getAssignedHorseInspections();

	PreRaceHorseInspectionResponse inspectHorse(UUID registrationId, InspectHorseRequest request);
}
