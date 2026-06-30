package com.example.be.module.result.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.result.dto.RefereeReportResponse;
import com.example.be.module.result.dto.SubmitReportRequest;
import com.example.be.module.result.service.RefereeReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/referee/races")
@RequiredArgsConstructor
@PreAuthorize("hasRole('REFEREE')")
public class RefereeReportController {

    private final RefereeReportService refereeReportService;

    @PostMapping("/{raceId}/report")
    public ApiResponse<RefereeReportResponse> submitReport(
            @PathVariable UUID raceId,
            @Valid @RequestBody SubmitReportRequest request) {
        return ApiResponse.success(refereeReportService.submitReport(raceId, request));
    }

    @GetMapping("/{raceId}/report")
    public ApiResponse<RefereeReportResponse> getReport(@PathVariable UUID raceId) {
        return ApiResponse.success(refereeReportService.getReportByRace(raceId));
    }
}
