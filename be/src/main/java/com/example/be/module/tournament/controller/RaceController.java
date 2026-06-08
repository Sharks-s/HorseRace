package com.example.be.module.tournament.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.tournament.dto.request.RaceRequest;
import com.example.be.module.tournament.dto.response.RaceResponse;
import com.example.be.module.tournament.service.RaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tournaments/{tournamentId}/races")
@RequiredArgsConstructor
public class RaceController {

    private final RaceService raceService;

    // @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<RaceResponse>> createRace(
            @PathVariable UUID tournamentId,
            @Valid @RequestBody RaceRequest request) {
        RaceResponse response = raceService.createRace(tournamentId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RaceResponse>> updateRace(
            @PathVariable UUID tournamentId, // Can optionally validate tournamentId matches
            @PathVariable UUID id,
            @Valid @RequestBody RaceRequest request) {
        RaceResponse response = raceService.updateRace(id, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRace(
            @PathVariable UUID tournamentId,
            @PathVariable UUID id) {
        raceService.deleteRace(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RaceResponse>> getRace(
            @PathVariable UUID tournamentId,
            @PathVariable UUID id) {
        RaceResponse response = raceService.getRace(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RaceResponse>>> getRacesByTournament(@PathVariable UUID tournamentId) {
        List<RaceResponse> response = raceService.getRacesByTournament(tournamentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
