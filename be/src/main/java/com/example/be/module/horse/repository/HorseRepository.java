package com.example.be.module.horse.repository;

import com.example.be.module.horse.model.entity.Horse;
import com.example.be.module.horse.model.enums.HorseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("horseModuleHorseRepository")
public interface HorseRepository extends JpaRepository<Horse, UUID>, JpaSpecificationExecutor<Horse> {

	List<Horse> findByOwner_IdOrderByCreatedAtDesc(UUID ownerId);

	List<Horse> findByOwner_IdAndStatusOrderByCreatedAtDesc(UUID ownerId, HorseStatus status);
}
