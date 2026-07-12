    package com.unitidepharma.backend.entity;

    import jakarta.persistence.*;
    import lombok.*;

    import java.time.LocalDateTime;

    @Entity
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class MRVisit {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String shopName;

        private String notes;

        private LocalDateTime timestamp = LocalDateTime.now();

        @ManyToOne
        @JoinColumn(name = "mr_id")
        private User mr;
    }