package com.example.be.module.result.model.entity;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.horse.model.entity.Horse;
import com.example.be.module.tournament.model.entity.Race;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "race_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RaceResult {

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
	@JoinColumn(name = "jockey_id", nullable = false)
	private User jockey;

	@Column(nullable = false)
	private Integer placement;

	@Column(nullable = false)
	private Double finishTime;

	@Column(nullable = false)
	private Integer rank;

	@Column(nullable = false)
	private Double score;

	@Column(nullable = false)
	private Boolean violationFlag;

	@Column(nullable = false)
	private Double points;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		if (points == null) {
			points = calculatePoints(placement);
		}
		if (rank == null) {
			rank = placement;
		}
		if (placement == null) {
			placement = rank;
		}
		if (violationFlag == null) {
			violationFlag = false;
		}
	}

	private double calculatePoints(Integer place) {
		if (place == null || place <= 0) {
			return 0;
		}
		return Math.max(0, 11 - place);
	}
}
