package com.example.be.module.profile.repository;

import com.example.be.module.profile.model.entity.Horse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface HorseRepository extends JpaRepository<Horse, UUID> {
}
