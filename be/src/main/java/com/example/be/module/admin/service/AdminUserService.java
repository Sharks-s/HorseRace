package com.example.be.module.admin.service;

import com.example.be.module.admin.dto.response.UserAdminResponse;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.model.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AdminUserService {

	Page<UserAdminResponse> getUsers(Role role, UserStatus status, Pageable pageable);

	UserAdminResponse getUser(UUID id);

	UserAdminResponse updateUserStatus(UUID id, UserStatus status);

	UserAdminResponse updateUserRole(UUID id, Role role);
}