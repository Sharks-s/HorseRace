package com.example.be.module.horse.service.impl;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.model.enums.UserStatus;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.horse.dto.request.HorseCreateRequest;
import com.example.be.module.horse.dto.request.HorseUpdateRequest;
import com.example.be.module.horse.dto.response.HorseResponse;
import com.example.be.module.horse.model.entity.Horse;
import com.example.be.module.horse.model.enums.HorseStatus;
import com.example.be.module.horse.repository.HorseRepository;
import com.example.be.module.horse.service.HorseService;
import com.example.be.module.registration.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class HorseServiceImpl implements HorseService {

	private final HorseRepository horseRepository;
	private final UserRepository userRepository;
	private final RegistrationRepository registrationRepository;

	@Value("${app.horse.max-weight}")
	private double maxHorseWeight;

	@Override
	public HorseResponse createHorse(HorseCreateRequest request) {
		User owner = getCurrentUser();
		validateHealthCertificateExpiry(request.getHealthCertExpiry());
		validateWeightLimit(request.getWeight());

		Horse horse = Horse.builder()
				.name(request.getName())
				.breed(request.getBreed())
				.age(request.getAge())
				.weight(request.getWeight())
				.healthCertExpiry(request.getHealthCertExpiry())
				.status(HorseStatus.PENDING_REVIEW)
				.owner(owner)
				.build();

		return HorseResponse.fromEntity(horseRepository.save(horse));
	}

	@Override
	@Transactional(readOnly = true)
	public List<HorseResponse> getMyHorses(HorseStatus status) {
		User owner = getCurrentUser();
		List<Horse> horses = status == null
				? horseRepository.findByOwner_IdOrderByCreatedAtDesc(owner.getId())
				: horseRepository.findByOwner_IdAndStatusOrderByCreatedAtDesc(owner.getId(), status);
		return horses.stream().map(HorseResponse::fromEntity).toList();
	}

	@Override
	public HorseResponse updateHorse(UUID id, HorseUpdateRequest request) {
		User owner = getCurrentUser();
		Horse horse = horseRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Horse not found."));

		if (!horse.getOwner().getId().equals(owner.getId())) {
			throw new IllegalArgumentException("You are not authorized to update this horse.");
		}

		if (horse.getStatus() == HorseStatus.REGISTERED || registrationRepository.existsByHorse_Id(horse.getId())) {
			throw new IllegalArgumentException("This horse cannot be updated because it has already been registered for a race.");
		}

		validateHealthCertificateExpiry(request.getHealthCertExpiry());
		validateWeightLimit(request.getWeight());
		horse.setName(request.getName());
		horse.setBreed(request.getBreed());
		horse.setAge(request.getAge());
		horse.setWeight(request.getWeight());
		horse.setHealthCertExpiry(request.getHealthCertExpiry());

		return HorseResponse.fromEntity(horseRepository.save(horse));
	}

	private User getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || authentication.getName() == null) {
			throw new IllegalArgumentException("Unable to identify the currently authenticated user.");
		}

		User user = userRepository.findByEmail(authentication.getName())
				.orElseThrow(() -> new IllegalArgumentException("Authenticated user account not found."));
		if (user.getStatus() != UserStatus.ACTIVE) {
			throw new IllegalArgumentException("Your account is not active.");
		}
		return user;
	}

	private void validateHealthCertificateExpiry(LocalDate healthCertExpiry) {
		LocalDate today = LocalDate.now();
		LocalDate maxAllowed = today.plusMonths(6);
		if (healthCertExpiry.isBefore(today)) {
			throw new IllegalArgumentException("The health certificate must still be valid.");
		}
		if (healthCertExpiry.isAfter(maxAllowed)) {
			throw new IllegalArgumentException("BR-01: The health certificate expiry date must be within 6 months from today.");
		}
	}

	private void validateWeightLimit(Double weight) {
		if (weight == null || weight <= 0) {
			throw new IllegalArgumentException("BR-01: Horse weight must be greater than 0 kg.");
		}

		if (weight > maxHorseWeight) {
			throw new IllegalArgumentException(
					"BR-01: Horse weight exceeds the maximum allowed limit (" + maxHorseWeight + " kg).");
		}
	}
}
