package com.example.be.module.admin.service;

import com.example.be.module.horse.dto.response.HorseResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.UUID;

public interface AdminHorseReviewService {

	Page<HorseResponse> getPendingHorses(LocalDate createdFrom, LocalDate createdTo, Pageable pageable);

	HorseResponse getHorse(UUID id);

	HorseResponse approveHorse(UUID id);

	HorseResponse rejectHorse(UUID id, String reason);
}
