package com.example.be.common.config;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.model.enums.UserStatus;
import com.example.be.module.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class AdminAccountInitializer implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Value("${app.admin.seed.enabled:false}")
	private boolean seedAdminEnabled;

	@Value("${app.admin.seed.username:admin}")
	private String adminUsername;

	@Value("${app.admin.seed.full-name:System Admin}")
	private String adminFullName;

	@Value("${app.admin.seed.email:admin@horserace.local}")
	private String adminEmail;

	@Value("${app.admin.seed.password:ChangeMe123!}")
	private String adminPassword;

	@Override
	@Transactional
	public void run(String... args) {
		if (!seedAdminEnabled || userRepository.existsByEmail(adminEmail)) {
			return;
		}

		if (userRepository.existsByUsername(adminUsername)) {
			throw new IllegalStateException("Cannot seed admin because username already exists: " + adminUsername);
		}

		LocalDateTime now = LocalDateTime.now();
		User admin = User.builder()
				.username(adminUsername)
				.fullName(adminFullName)
				.email(adminEmail)
				.password(passwordEncoder.encode(adminPassword))
				.phoneNumber(adminEmail)
				.role(Role.ADMIN)
				.status(UserStatus.ACTIVE)
				.emailVerifiedAt(now)
				.build();

		userRepository.save(admin);
	}
}
