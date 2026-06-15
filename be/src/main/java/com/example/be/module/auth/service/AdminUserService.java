package com.example.be.module.auth.service;

import com.example.be.module.auth.dto.request.UpdateUserRequest;
import com.example.be.module.auth.dto.response.UserResponse;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.model.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AdminUserService {
    Page<UserResponse> getUsers(Role role, UserStatus status, Pageable pageable);
    UserResponse getUserById(UUID id);
    UserResponse updateUser(UUID id, UpdateUserRequest request);
    void deleteUser(UUID id);
}
