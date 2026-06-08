package com.example.be.module.auth.dto.request;

import com.example.be.module.auth.model.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String fullName;

    private String email;

    private String password;

    private String phoneNumber;

    private Role role;
}
