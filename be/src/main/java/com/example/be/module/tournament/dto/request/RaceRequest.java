package com.example.be.module.tournament.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class RaceRequest {
    @NotBlank(message = "Tên vòng đua không được để trống")
    private String name;

    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalDateTime startTime;

    @NotNull(message = "Hệ số quãng đường không được để trống")
    private Double distanceFactor;

    private UUID refereeId;
}
