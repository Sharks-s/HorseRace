package com.example.be.module.referee.model.entity;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.horse.model.entity.Horse;
import com.example.be.module.tournament.model.entity.Race;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "violations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Violation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "race_id", nullable = false)
    private Race race;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "horse_id", nullable = false)
    private Horse horse;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "jockey_id", nullable = false)
    private User jockey;

    @Column(nullable = false)
    private String type; // e.g., FALSE_START, LANE_VIOLATION, OBSTRUCTION, EQUIPMENT_FAULT

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    private Integer occurrenceMinute;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
