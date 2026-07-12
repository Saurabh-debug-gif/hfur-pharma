package com.unitidepharma.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class StockLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long medicineId;

    private int changeAmount;

    private String type;

    private String reason;

    private LocalDateTime timestamp;
}