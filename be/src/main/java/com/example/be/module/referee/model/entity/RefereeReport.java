package com.example.be.module.referee.model.entity;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.tournament.model.entity.Race;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "referee_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefereeReport {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "race_id", nullable = false, unique = true)
	private Race race;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "referee_id", nullable = false)
	private User referee;

	@Column(nullable = false)
	private Boolean confirmedResult;

	@Column(nullable = false, updatable = false)
	private LocalDateTime submittedAt;

	@PrePersist
	protected void onCreate() {
		if (submittedAt == null) {
			submittedAt = LocalDateTime.now();
		}
		if (confirmedResult == null) {
			confirmedResult = true;
		}
	}
}
