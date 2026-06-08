package com.example.be.module.auth.service.impl;

import com.example.be.common.service.EmailService;
import com.example.be.module.auth.dto.response.AuthResponse;
import com.example.be.module.auth.dto.request.LoginRequest;
import com.example.be.module.auth.dto.request.RegisterRequest;
import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.model.enums.UserStatus;
import com.example.be.module.auth.repository.UserRepository;
import com.example.be.module.auth.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final EmailService emailService;

	@Value("${app.frontend-url}")
	private String frontendUrl;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

		if (user.getStatus() != UserStatus.ACTIVE) {
			throw new DisabledException("Tài khoản chưa được kích hoạt");
		}

		return org.springframework.security.core.userdetails.User
				.withUsername(user.getEmail())
				.password(user.getPassword())
				.roles(user.getRole().name())
				.build();
	}

	@Override
	@Transactional
	public AuthResponse register(RegisterRequest request) {
		if (userRepository.existsByUsername(request.getUsername())) {
			throw new IllegalArgumentException("Username already exists");
		}

		if (userRepository.existsByEmail(request.getEmail())) {
			throw new IllegalArgumentException("Email already exists");
		}

		Role dynamicRole = request.getRole() == null ? Role.SPECTATOR : request.getRole();
		String verificationToken = UUID.randomUUID().toString();
		String displayName = request.getFullName();
		if (displayName == null || displayName.isBlank()) {
			displayName = request.getUsername();
		}

		User user = User.builder()
				.username(request.getUsername())
				.fullName(displayName)
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.phoneNumber(request.getEmail())
				.role(dynamicRole)
				.status(UserStatus.PENDING_VERIFICATION)
				.emailVerificationToken(verificationToken)
				.build();

		User saved = userRepository.save(user);
		String verifyLink = frontendUrl + "/verify-email?token=" + verificationToken;
		emailService.sendVerificationEmail(saved.getEmail(), saved.getUsername(), verifyLink);

		return new AuthResponse(saved.getId(), saved.getUsername(), saved.getFullName(), saved.getEmail(), saved.getPhoneNumber(), saved.getRole(), saved.getStatus(), saved.getLastLoginAt());
	}

	@Override
	@Transactional
	public String verifyEmail(String token) {
		User user = userRepository.findByEmailVerificationToken(token)
				.orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));

		user.setStatus(UserStatus.ACTIVE);
		user.setEmailVerifiedAt(LocalDateTime.now());
		user.setEmailVerificationToken(null);
		userRepository.save(user);
		return "Email verified successfully";
	}

	@Override
	@Transactional
	public AuthResponse login(LoginRequest request, HttpServletRequest contextRequest) {
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		user.setLastLoginAt(java.time.LocalDateTime.now());
		userRepository.save(user);

		return new AuthResponse(user.getId(), user.getUsername(), user.getFullName(), user.getEmail(), user.getPhoneNumber(), user.getRole(), user.getStatus(), user.getLastLoginAt());
	}

	@Override
	public void logout(HttpServletRequest contextRequest) {
		HttpSession session = contextRequest.getSession(false);
		if (session != null) {
			session.invalidate();
		}
		SecurityContextHolder.clearContext();
	}
}
