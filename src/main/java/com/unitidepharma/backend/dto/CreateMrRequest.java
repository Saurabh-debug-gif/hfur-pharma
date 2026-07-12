package com.unitidepharma.backend.dto;

import lombok.Data;

@Data
public class CreateMrRequest {
    private String name;
    private String email;
    private String password;
    private String area; // optional
}