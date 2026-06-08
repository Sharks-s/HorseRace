package com.example.be.module.admin.dto.request;

import com.example.be.module.auth.model.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserStatusRequest {

	@NotNull(message = "Status không được để trống")
	private UserStatus status;
}