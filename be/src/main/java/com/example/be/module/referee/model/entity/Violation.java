package com.example.be.module.referee.model.entity;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.horse.model.entity.Horse;
import com.example.be.module.referee.model.enums.ViolationSeverity;
import com.example.be.module.referee.model.enums.ViolationType;
import com.example.be.module.tournament.model.entity.Race;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "violations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Violation {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "violation_id")
	private UUID violationID;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "race_id", nullable = false)
	private Race race;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "horse_id", nullable = false)
	private Horse horse;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "jockey_id", nullable = false)
	private User jockey;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "referee_id", nullable = false)
	private User referee;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ViolationType type;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ViolationSeverity severity;

	@Column(nullable = false)
	private LocalDateTime timestamp;

	@Column(nullable = false)
	private boolean reportSubmitted;

	@PrePersist
	protected void onCreate() {
		if (timestamp == null) {
			timestamp = LocalDateTime.now();
		}
	}
}
