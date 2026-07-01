package com.example.be.module.result.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.result.dto.RefereeReportResponse;
import com.example.be.module.result.dto.TournamentStandingResponse;
import com.example.be.module.result.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicResultController {

    private final ResultService resultService;

    @GetMapping("/races/{raceId}/results")
    public ApiResponse<List<RefereeReportResponse.RaceResultDetail>> getOfficialResults(@PathVariable UUID raceId) {
        return ApiResponse.success(resultService.getOfficialResults(raceId));
    }

    @GetMapping("/tournaments/{tournamentId}/standings")
    public ApiResponse<List<TournamentStandingResponse>> getTournamentStandings(@PathVariable UUID tournamentId) {
        return ApiResponse.success(resultService.getTournamentStandings(tournamentId));
    }
}
