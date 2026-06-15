package com.example.be.module.auth.dto.response;

import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.model.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private UUID id;
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private UserStatus status;
    private LocalDateTime lastLoginAt;
}


