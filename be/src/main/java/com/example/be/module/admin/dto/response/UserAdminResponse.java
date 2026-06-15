package com.example.be.module.admin.dto.response;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.model.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class UserAdminResponse {

	private UUID id;
	private String username;
	private String fullName;
	private String email;
	private String phoneNumber;
	private Role role;
	private UserStatus status;
	private LocalDateTime emailVerifiedAt;
	private LocalDateTime lastLoginAt;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public static UserAdminResponse fromEntity(User user) {
		return new UserAdminResponse(
				user.getId(),
				user.getUsername(),
				user.getFullName(),
				user.getEmail(),
				user.getPhoneNumber(),
				user.getRole(),
				user.getStatus(),
				user.getEmailVerifiedAt(),
				user.getLastLoginAt(),
				user.getCreatedAt(),
				user.getUpdatedAt());
	}
}