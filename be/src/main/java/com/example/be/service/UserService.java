package com.example.be.service;

import com.example.be.dto.response.AuthResponse;
import com.example.be.dto.request.LoginRequest;
import com.example.be.dto.request.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;

public interface UserService {
	AuthResponse register(RegisterRequest request);

	AuthResponse login(LoginRequest request, HttpServletRequest contextRequest);

	void logout(HttpServletRequest contextRequest);

}
