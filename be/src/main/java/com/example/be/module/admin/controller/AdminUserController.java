package com.example.be.module.admin.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.admin.dto.request.UpdateUserRoleRequest;
import com.example.be.module.admin.dto.request.UpdateUserStatusRequest;
import com.example.be.module.admin.dto.response.UserAdminResponse;
import com.example.be.module.admin.service.AdminUserService;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.model.enums.UserStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController("adminModuleUserController")
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

	private final AdminUserService adminUserService;

	@GetMapping
	public ApiResponse<Page<UserAdminResponse>> getUsers(
			@RequestParam(required = false) Role role,
			@RequestParam(required = false) UserStatus status,
			Pageable pageable) {
		return ApiResponse.success(adminUserService.getUsers(role, status, pageable));
	}

	@GetMapping("/{id}")
	public ApiResponse<UserAdminResponse> getUser(@PathVariable UUID id) {
		return ApiResponse.success(adminUserService.getUser(id));
	}

	@PutMapping("/{id}/status")
	public ApiResponse<UserAdminResponse> updateUserStatus(
			@PathVariable UUID id,
			@Valid @RequestBody UpdateUserStatusRequest request) {
		return ApiResponse.success(adminUserService.updateUserStatus(id, request.getStatus()));
	}

	@PutMapping("/{id}/role")
	public ApiResponse<UserAdminResponse> updateUserRole(
			@PathVariable UUID id,
			@Valid @RequestBody UpdateUserRoleRequest request) {
		return ApiResponse.success(adminUserService.updateUserRole(id, request.getRole()));
	}
}