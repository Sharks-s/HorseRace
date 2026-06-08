package com.example.be.module.auth.service;

import com.example.be.module.auth.dto.response.AuthResponse;
import com.example.be.module.auth.dto.request.LoginRequest;
import com.example.be.module.auth.dto.request.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;

public interface UserService {
	AuthResponse register(RegisterRequest request);

	AuthResponse login(LoginRequest request, HttpServletRequest contextRequest);

	void logout(HttpServletRequest contextRequest);

}

