package com.example.be.module.auth.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.auth.dto.request.UpdateUserRequest;
import com.example.be.module.auth.dto.response.UserResponse;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.model.enums.UserStatus;
import com.example.be.module.auth.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController("authModuleUserController")
@RequestMapping("/api/auth/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) UserStatus status,
            Pageable pageable) {
        Page<UserResponse> users = adminUserService.getUsers(role, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable UUID id) {
        UserResponse user = adminUserService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable UUID id,
            @RequestBody UpdateUserRequest request) {
        UserResponse updatedUser = adminUserService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
