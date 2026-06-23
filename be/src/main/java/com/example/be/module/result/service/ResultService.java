package com.example.be.module.result.service;

import com.example.be.module.registration.model.entity.RaceRegistration;
import com.example.be.module.result.model.entity.RaceResult;
import com.example.be.module.tournament.model.entity.Race;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public interface ResultService {

	List<RaceResult> updateRaceResult(
			Race race,
			List<RaceRegistration> readyRegistrations,
			Map<UUID, Double> finishTimesByHorseId,
			Set<UUID> violationHorseIds);
}
