package com.example.be.module.jockey.repository;

import com.example.be.module.jockey.model.entity.JockeyProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface JockeyProfileRepository extends JpaRepository<JockeyProfile, UUID> {

	Optional<JockeyProfile> findByUser_Id(UUID userId);

	boolean existsByLicenseNoAndUser_IdNot(String licenseNo, UUID userId);
}
