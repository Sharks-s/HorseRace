package com.example.be.module.notification.dto.response;

import com.example.be.module.notification.model.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class NotificationResponse {

	private UUID id;
	private String title;
	private String message;
	private boolean read;
	private LocalDateTime createdAt;

	public static NotificationResponse fromEntity(Notification notification) {
		return new NotificationResponse(
				notification.getId(),
				notification.getTitle(),
				notification.getMessage(),
				notification.isRead(),
				notification.getCreatedAt());
	}
}
