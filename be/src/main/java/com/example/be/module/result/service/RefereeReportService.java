package com.example.be.module.result.service;

import com.example.be.module.result.dto.RefereeReportResponse;
import com.example.be.module.result.dto.SubmitReportRequest;

import java.util.UUID;

public interface RefereeReportService {
    RefereeReportResponse submitReport(UUID raceId, SubmitReportRequest request);
    RefereeReportResponse getReportByRace(UUID raceId);
}
