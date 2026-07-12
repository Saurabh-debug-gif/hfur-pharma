package com.unitidepharma.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role; // ADMIN, CUSTOMER, MR

    @Column(name = "area")
    private String area; // optional (city / region)

    private String phone;

    private boolean isActive = true;

    private LocalDateTime createdAt = LocalDateTime.now();
}