package com.example.be.module.tournament.model.entity;

import com.example.be.module.auth.model.entity.User;
import com.example.be.module.tournament.model.enums.RaceStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "races")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Race {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referee_id")
    private User referee;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private Double distanceFactor; // Phục vụ tính điểm BR-03

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RaceStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referee_id")
    private com.example.be.module.auth.model.entity.User referee;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = RaceStatus.SCHEDULED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
