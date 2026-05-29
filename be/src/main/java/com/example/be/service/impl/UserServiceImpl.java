package com.example.be.service.impl;

import com.example.be.dto.response.AuthResponse;
import com.example.be.dto.request.LoginRequest;
import com.example.be.dto.request.RegisterRequest;
import com.example.be.model.entity.User;
import com.example.be.model.enums.UserStatus;
import com.example.be.repository.UserRepository;
import com.example.be.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public AuthResponse register(RegisterRequest request) {
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new IllegalArgumentException("Email already exists");
		}

		if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
			throw new IllegalArgumentException("Phone number already exists");
		}

		User user = User.builder()
				.fullName(request.getFullName())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.phoneNumber(request.getPhoneNumber())
				.status(UserStatus.ACTIVE)
				.build();

		User saved = userRepository.save(user);

		return new AuthResponse(saved.getId(), saved.getFullName(), saved.getEmail(), saved.getPhoneNumber(), saved.getRole(), saved.getStatus(), saved.getLastLoginAt());
	}

	@Override
	public AuthResponse login(LoginRequest request) {
		Optional<User> optional = userRepository.findByEmail(request.getEmail());
		if (optional.isEmpty()) {
			throw new IllegalArgumentException("Invalid credentials");
		}

		User user = optional.get();
		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new IllegalArgumentException("Invalid credentials");
		}

		user.setLastLoginAt(java.time.LocalDateTime.now());
		userRepository.save(user);

		return new AuthResponse(user.getId(), user.getFullName(), user.getEmail(), user.getPhoneNumber(), user.getRole(), user.getStatus(), user.getLastLoginAt());
	}
}
