package com.example.be.module.notification.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.notification.dto.response.NotificationResponse;
import com.example.be.module.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;

	@GetMapping("/my")
	public ApiResponse<List<NotificationResponse>> getMyNotifications() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("Current user not found"));
		List<NotificationResponse> notifications = notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
				.stream()
				.map(NotificationResponse::fromEntity)
				.toList();
		return ApiResponse.success(notifications);
	}
}
