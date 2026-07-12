package com.unitidepharma.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MRLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double latitude;

    private double longitude;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "mr_id")
    private User mr;

    // ✅ Set automatically before insert
    @PrePersist
    public void setTimestamp() {
        this.timestamp = LocalDateTime.now();
    }
}