package com.example.be.module.referee.service;

import com.example.be.module.referee.dto.request.SubmitRaceResultRequest;
import com.example.be.module.referee.dto.response.RefereeReportResponse;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefereeReportService {

	Optional<RefereeReportResponse> getReport(UUID raceId);

	RefereeReportResponse submitReport(UUID raceId, List<SubmitRaceResultRequest.HorseFinishTimeRequest> request);
}
