package com.example.be.module.referee.service;

import com.example.be.module.referee.dto.request.SubmitRaceReportRequest;
import com.example.be.module.referee.dto.response.RaceReportResponse;

import java.util.List;
import java.util.UUID;

public interface RefereeRaceReportService {

	RaceReportResponse submitReport(UUID raceId, List<SubmitRaceReportRequest> request);
}
