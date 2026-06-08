package com.example.be.module.auth.service.impl;

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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

		return org.springframework.security.core.userdetails.User
				.withUsername(user.getEmail())
				.password(user.getPassword())
				.roles(user.getRole().name())
				.build();
	}

	@Override
	public AuthResponse register(RegisterRequest request) {
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new IllegalArgumentException("Email already exists");
		}

		if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
			throw new IllegalArgumentException("Phone number already exists");
		}

		// Đọc role được chọn từ request gửi lên
		Role dynamicRole = request.getRole();

		// Fallback phòng trường hợp FE không gửi lên thì mặc định là SPECTATOR (Khán giả)
		if (dynamicRole == null) {
			dynamicRole = Role.SPECTATOR;
		}

		// Theo quy tắc hệ thống: Nếu đăng ký thành SPECTATOR thì ACTIVE luôn,
		// Còn nếu ứng tuyển làm HORSE_OWNER hoặc JOCKEY thì để PENDING_APPROVAL chờ Admin duyệt hồ sơ năng lực
		UserStatus defaultStatus = (dynamicRole == Role.SPECTATOR)
				? UserStatus.ACTIVE
				: UserStatus.PENDING_APPROVAL;

		User user = User.builder()
				.fullName(request.getFullName())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.phoneNumber(request.getPhoneNumber())
				.role(dynamicRole)       // <-- ĐÃ THAY ĐỔI: Sử dụng role động từ request
				.status(defaultStatus)   // <-- ĐÃ THAY ĐỔI: Trạng thái dựa trên phân quyền nghiệp vụ
				.build();

		User saved = userRepository.save(user);

		return new AuthResponse(saved.getId(), saved.getFullName(), saved.getEmail(), saved.getPhoneNumber(), saved.getRole(), saved.getStatus(), saved.getLastLoginAt());
	}

	@Override
	public AuthResponse login(LoginRequest request, HttpServletRequest contextRequest) {
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		user.setLastLoginAt(java.time.LocalDateTime.now());
		userRepository.save(user);

		return new AuthResponse(user.getId(), user.getFullName(), user.getEmail(), user.getPhoneNumber(), user.getRole(), user.getStatus(), user.getLastLoginAt());
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
