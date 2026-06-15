package com.example.be.module.tournament.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.tournament.dto.request.RegistrationRequest;
import com.example.be.module.tournament.dto.response.RegistrationResponse;
import com.example.be.module.tournament.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/races")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    // @PreAuthorize("hasRole('HORSE_OWNER')")
    @PostMapping("/{raceId}/invitations")
    public ResponseEntity<ApiResponse<RegistrationResponse>> sendInvitation(
            @PathVariable UUID raceId,
            @Valid @RequestBody RegistrationRequest request) {
        RegistrationResponse response = registrationService.sendInvitation(raceId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // @PreAuthorize("hasRole('JOCKEY')")
    @PutMapping("/invitations/{invitationId}/respond")
    public ResponseEntity<ApiResponse<RegistrationResponse>> respondToInvitation(
            @PathVariable UUID invitationId,
            @RequestParam boolean accept) {
        RegistrationResponse response = registrationService.respondToInvitation(invitationId, accept);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // @PreAuthorize("hasRole('JOCKEY')")
    @GetMapping("/jockeys/{jockeyId}/invitations")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getJockeyInvitations(@PathVariable UUID jockeyId) {
        List<RegistrationResponse> responses = registrationService.getJockeyInvitations(jockeyId);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/{raceId}/registrations")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getRaceRegistrations(@PathVariable UUID raceId) {
        List<RegistrationResponse> responses = registrationService.getRaceRegistrations(raceId);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }
}
