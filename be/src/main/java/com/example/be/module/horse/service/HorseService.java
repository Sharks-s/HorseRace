package com.example.be.module.horse.service;

import com.example.be.module.horse.dto.request.HorseCreateRequest;
import com.example.be.module.horse.dto.request.HorseUpdateRequest;
import com.example.be.module.horse.dto.response.HorseResponse;
import com.example.be.module.horse.model.enums.HorseStatus;

import java.util.List;
import java.util.UUID;

public interface HorseService {

	HorseResponse createHorse(HorseCreateRequest request);

	List<HorseResponse> getMyHorses(HorseStatus status);

	HorseResponse updateHorse(UUID id, HorseUpdateRequest request);
}