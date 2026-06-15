package com.example.be.module.admin.dto.request;

import com.example.be.module.auth.model.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRoleRequest {

	@NotNull(message = "Role không được để trống")
	private Role role;
}