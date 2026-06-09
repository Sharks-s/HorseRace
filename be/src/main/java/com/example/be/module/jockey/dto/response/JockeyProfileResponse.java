package com.example.be.module.jockey.dto.response;

import com.example.be.module.jockey.model.entity.JockeyProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class JockeyProfileResponse {

	private UUID id;
	private UUID userId;
	private String licenseNo;
	private String name;
	private Double weight;
	private String bio;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public static JockeyProfileResponse fromEntity(JockeyProfile profile) {
		return new JockeyProfileResponse(
				profile.getId(),
				profile.getUser().getId(),
				profile.getLicenseNo(),
				profile.getName(),
				profile.getWeight(),
				profile.getBio(),
				profile.getCreatedAt(),
				profile.getUpdatedAt());
	}
}
