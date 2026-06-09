package com.example.be.module.notification.repository;

import com.example.be.module.notification.model.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

	List<Notification> findByUser_IdOrderByCreatedAtDesc(UUID userId);
}
