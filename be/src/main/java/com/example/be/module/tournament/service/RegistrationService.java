package com.example.be.module.tournament.service;

import com.example.be.module.tournament.dto.request.RegistrationRequest;
import com.example.be.module.tournament.dto.response.RegistrationResponse;

import java.util.List;
import java.util.UUID;

public interface RegistrationService {
    RegistrationResponse sendInvitation(UUID raceId, RegistrationRequest request);
    RegistrationResponse respondToInvitation(UUID registrationId, boolean accept);
    List<RegistrationResponse> getJockeyInvitations(UUID jockeyId);
    List<RegistrationResponse> getRaceRegistrations(UUID raceId);
}
