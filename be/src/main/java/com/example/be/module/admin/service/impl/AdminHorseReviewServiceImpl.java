package com.example.be.module.admin.service.impl;

import com.example.be.module.admin.service.AdminHorseReviewService;
import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.horse.dto.response.HorseResponse;
import com.example.be.module.horse.model.entity.Horse;
import com.example.be.module.horse.model.enums.HorseStatus;
import com.example.be.module.horse.repository.HorseRepository;
import com.example.be.module.notification.model.entity.Notification;
import com.example.be.module.notification.repository.NotificationRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminHorseReviewServiceImpl implements AdminHorseReviewService {

	private final HorseRepository horseRepository;
	private final UserRepository userRepository;
	private final NotificationRepository notificationRepository;

	@Override
	@Transactional(readOnly = true)
	public Page<HorseResponse> getPendingHorses(LocalDate createdFrom, LocalDate createdTo, Pageable pageable) {
		Specification<Horse> specification = (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			predicates.add(cb.equal(root.get("status"), HorseStatus.PENDING_REVIEW));
			if (createdFrom != null) {
				predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), createdFrom.atStartOfDay()));
			}
			if (createdTo != null) {
				predicates.add(cb.lessThan(root.get("createdAt"), createdTo.plusDays(1).atStartOfDay()));
			}
			return cb.and(predicates.toArray(new Predicate[0]));
		};
		return horseRepository.findAll(specification, pageable).map(HorseResponse::fromEntity);
	}

	@Override
	@Transactional(readOnly = true)
	public HorseResponse getHorse(UUID id) {
		return HorseResponse.fromEntity(findHorse(id));
	}

	@Override
	public HorseResponse approveHorse(UUID id) {
		User admin = getCurrentUser();
		Horse horse = findHorse(id);
		horse.setStatus(HorseStatus.APPROVED);
		horse.setReviewNote(null);
		horse.setReviewedAt(LocalDateTime.now());
		horse.setReviewedBy(admin);
		Notification notification = Notification.builder()
				.user(horse.getOwner())
				.title("Horse profile approved")
				.message("Your horse profile '" + horse.getName() + "' has been approved.")
				.read(false)
				.build();
		notificationRepository.save(notification);
		return HorseResponse.fromEntity(horseRepository.save(horse));
	}

	@Override
	public HorseResponse rejectHorse(UUID id, String reason) {
		User admin = getCurrentUser();
		Horse horse = findHorse(id);
		horse.setStatus(HorseStatus.REJECTED);
		horse.setReviewNote(reason);
		horse.setReviewedAt(LocalDateTime.now());
		horse.setReviewedBy(admin);
		Notification notification = Notification.builder()
				.user(horse.getOwner())
				.title("Horse profile rejected")
				.message("Your horse profile '" + horse.getName() + "' was rejected. Reason: " + reason)
				.read(false)
				.build();
		notificationRepository.save(notification);
		return HorseResponse.fromEntity(horseRepository.save(horse));
	}

	private Horse findHorse(UUID id) {
		return horseRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Horse not found"));
	}

	private User getCurrentUser() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("Current user not found"));
	}
}
