package com.example.be.module.result.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitReportRequest {

    private String notes;

    @NotEmpty(message = "Participant results must not be empty")
    @Valid
    private List<ParticipantResultDetail> participants;
}
