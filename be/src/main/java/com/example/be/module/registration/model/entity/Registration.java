package com.example.be.module.registration.model.entity;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.horse.model.entity.Horse;
import com.example.be.module.registration.model.enums.RegistrationStatus;
import com.example.be.module.tournament.model.entity.Race;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "registrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Registration {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "race_id", nullable = false)
	private Race race;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "horse_id", nullable = false)
	private Horse horse;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "owner_id", nullable = false)
	private User owner;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "jockey_id")
	private User jockey;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "inspected_by_id")
	private User inspectedBy;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private RegistrationStatus status;

	@Column(columnDefinition = "TEXT")
	private String inspectionNote;

	private LocalDateTime inspectedAt;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(nullable = false)
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
		if (status == null) {
			status = RegistrationStatus.PENDING_JOCKEY;
		}
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
