package com.example.be.module.admin.service.impl;

import com.example.be.module.admin.dto.response.UserAdminResponse;
import com.example.be.module.admin.service.AdminUserService;
import com.example.be.module.auth.model.entity.User;
import com.example.be.module.auth.model.enums.Role;
import com.example.be.module.auth.model.enums.UserStatus;
import com.example.be.module.auth.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserServiceImpl implements AdminUserService {

	private final UserRepository userRepository;

	@Override
	@Transactional(readOnly = true)
	public Page<UserAdminResponse> getUsers(Role role, UserStatus status, Pageable pageable) {
		Specification<User> specification = (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			if (role != null) {
				predicates.add(cb.equal(root.get("role"), role));
			}
			if (status != null) {
				predicates.add(cb.equal(root.get("status"), status));
			}
			return cb.and(predicates.toArray(new Predicate[0]));
		};

		return userRepository.findAll(specification, pageable).map(UserAdminResponse::fromEntity);
	}

	@Override
	@Transactional(readOnly = true)
	public UserAdminResponse getUser(UUID id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản"));
		return UserAdminResponse.fromEntity(user);
	}

	@Override
	public UserAdminResponse updateUserStatus(UUID id, UserStatus status) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản"));
		user.setStatus(status);
		return UserAdminResponse.fromEntity(userRepository.save(user));
	}

	@Override
	public UserAdminResponse updateUserRole(UUID id, Role role) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản"));
		user.setRole(role);
		return UserAdminResponse.fromEntity(userRepository.save(user));
	}
}