package com.example.be.module.admin.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.result.service.ResultService;
import com.example.be.module.tournament.dto.response.RaceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/results")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminResultController {

    private final ResultService resultService;

    @GetMapping("/pending")
    public ApiResponse<List<RaceResponse>> getPendingRaces() {
        return ApiResponse.success(resultService.getPendingRaces());
    }

    @PostMapping("/{raceId}/publish")
    public ApiResponse<Void> publishResult(@PathVariable UUID raceId) {
        resultService.publishResult(raceId);
        return ApiResponse.success(null);
    }
}
