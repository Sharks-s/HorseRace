package com.example.be.module.auth.controller;

import com.example.be.common.dto.response.ApiResponse;
import com.example.be.module.auth.dto.response.UserResponse;
import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.model.enums.UserStatus;
import com.example.be.module.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserLookupController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> listByRole(@RequestParam Role role) {
        List<UserResponse> users = userRepository.findByRole(role).stream()
                .filter(u -> u.getStatus() == UserStatus.ACTIVE)
                .map(this::mapToResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }
}
