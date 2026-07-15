package com.unitidepharma.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MrResponse {
    private Long id;
    private String name;
    private String email;
    private String area;
    private boolean active;
    private LocalDateTime createdAt;
}
