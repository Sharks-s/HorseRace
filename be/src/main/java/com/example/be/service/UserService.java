package com.example.be.service;

import com.example.be.dto.response.AuthResponse;
import com.example.be.dto.request.LoginRequest;
import com.example.be.dto.request.RegisterRequest;

public interface UserService {
	AuthResponse register(RegisterRequest request);

	AuthResponse login(LoginRequest request);
}
