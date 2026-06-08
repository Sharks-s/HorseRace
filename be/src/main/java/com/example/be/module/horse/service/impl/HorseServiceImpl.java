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
import lombok.RequiredArgsConstructor;
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

	@Override
	public HorseResponse createHorse(HorseCreateRequest request) {
		User owner = getCurrentUser();
		validateHealthCertificateExpiry(request.getHealthCertExpiry());

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
				.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ngựa"));

		if (!horse.getOwner().getId().equals(owner.getId())) {
			throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa ngựa này");
		}

		if (horse.getStatus() == HorseStatus.REGISTERED) {
			throw new IllegalArgumentException("Không thể chỉnh sửa ngựa đã tham gia đua");
		}

		validateHealthCertificateExpiry(request.getHealthCertExpiry());
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
			throw new IllegalArgumentException("Không xác định được người dùng hiện tại");
		}

		User user = userRepository.findByEmail(authentication.getName())
				.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản đang đăng nhập"));
		if (user.getStatus() != UserStatus.ACTIVE) {
			throw new IllegalArgumentException("Tài khoản chưa được kích hoạt");
		}
		return user;
	}

	private void validateHealthCertificateExpiry(LocalDate healthCertExpiry) {
		LocalDate today = LocalDate.now();
		LocalDate maxAllowed = today.plusMonths(6);
		if (healthCertExpiry.isBefore(today)) {
			throw new IllegalArgumentException("Giấy chứng nhận sức khỏe phải còn hiệu lực");
		}
		if (healthCertExpiry.isAfter(maxAllowed)) {
			throw new IllegalArgumentException("BR-01: healthCertExpiry phải trong vòng 6 tháng kể từ hôm nay");
		}
	}
}