package com.example.be.module.horse.dto.response;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.horse.model.entity.Horse;
import com.example.be.module.horse.model.enums.HorseStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class HorseResponse {

	private UUID id;
	private String name;
	private String breed;
	private Integer age;
	private Double weight;
	private LocalDate healthCertExpiry;
	private HorseStatus status;
	private UUID ownerId;
	private String ownerUsername;
	private String ownerEmail;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private String reviewNote;
	private LocalDateTime reviewedAt;
	private UUID reviewedById;

	public static HorseResponse fromEntity(Horse horse) {
		User owner = horse.getOwner();
		return new HorseResponse(
				horse.getId(),
				horse.getName(),
				horse.getBreed(),
				horse.getAge(),
				horse.getWeight(),
				horse.getHealthCertExpiry(),
				horse.getStatus(),
				owner.getId(),
				owner.getUsername(),
				owner.getEmail(),
				horse.getCreatedAt(),
				horse.getUpdatedAt(),
				horse.getReviewNote(),
				horse.getReviewedAt(),
				horse.getReviewedBy() == null ? null : horse.getReviewedBy().getId());
	}
}
